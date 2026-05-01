import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

let cache = { data: null as any, timestamp: 0 };

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get("language") || "en";

    // Use a different cache key if language changes?
    // Actually the prompt says "cache response in a module-level variable with 5 minute TTL"
    // Let's implement it for the current language. 
    // To be safe, we can cache per language:
    const cacheKey = language;
    if (!cache.data) cache.data = {};
    
    if (cache.data[cacheKey] && Date.now() - cache.timestamp < 300000) {
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

    return NextResponse.json(newsData);
  } catch (error) {
    console.error("News generate error:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
