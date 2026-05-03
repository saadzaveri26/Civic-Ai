import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { newsQuerySchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { logEvent } from "@/lib/logger";

let cache: { data: Record<string, unknown[]> | null; timestamp: number } = { data: null, timestamp: 0 };

/**
 * Handles GET requests for the election news endpoint.
 * Validates the language query param with Zod, enforces rate limits (30/min),
 * generates AI-curated election news via Gemini, and caches responses
 * with a 5-minute TTL keyed by language.
 *
 * @param request - The incoming Next.js request with optional `language` query parameter.
 * @returns JSON array of news items.
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  // Rate limiting: 30 requests per IP per minute
  const rateLimitResponse = rateLimit(request, "news", {
    maxRequests: 30,
    windowMs: 60_000,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const searchParams = request.nextUrl.searchParams;

    // Zod validation for query params
    const parsed = newsQuerySchema.safeParse({
      language: searchParams.get("language") || "en",
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid language parameter", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { language } = parsed.data;

    const cacheKey = language;
    if (!cache.data) cache.data = {};
    
    if (cache.data[cacheKey] && Date.now() - cache.timestamp < 300000) {
      await logEvent("INFO", "News fetched", { language, cacheHit: true, responseTime: Date.now() - startTime });
      return NextResponse.json(cache.data[cacheKey]);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let PROMPT = `You are a news aggregator. Generate a JSON array of exactly 8 recent and realistic election-related news items from India. Return ONLY valid JSON, no markdown, no preamble, no backticks.
Schema: [{
  id: string (uuid-like e.g. news_1),
  headline: string (max 12 words),
  summary: string (max 40 words, factual and neutral),
  category: 'Voting' | 'Policy' | 'Campaign' | 'Results' | 'Legal',
  state: string (Indian state name or 'National'),
  timeAgo: string (e.g. '2 hours ago', '1 day ago'),
  isBreaking: boolean (true for max 1 item)
}]
Make headlines realistic and educational. Non-partisan strictly.`;

    if (language !== "en") {
      PROMPT += `\nGenerate all text fields in ${language} language.`;
    }

    let newsData = null;

    try {
      const result = await model.generateContent(PROMPT);
      const text = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      newsData = JSON.parse(text);
    } catch {
      // Retry once on parse failure
      const simplerPrompt = PROMPT + "\n\nIMPORTANT: You must return ONLY a JSON array. No other text.";
      const result = await model.generateContent(simplerPrompt);
      const text = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      newsData = JSON.parse(text);
    }

    if (!Array.isArray(newsData)) {
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
    }

    cache.data[cacheKey] = newsData;
    cache.timestamp = Date.now();

    await logEvent("INFO", "News fetched", { language, cacheHit: false, responseTime: Date.now() - startTime });
    return NextResponse.json(newsData);
  } catch (error) {
    void error;
    await logEvent("ERROR", "News fetch failed", { responseTime: Date.now() - startTime });
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
