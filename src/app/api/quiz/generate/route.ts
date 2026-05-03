import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { quizGenerateBodySchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";
import { logEvent } from "@/lib/logger";

const BASE_PROMPT = `Generate exactly 5 multiple choice questions about the democratic election process. Return ONLY a JSON array with no markdown, no preamble, no code fences. Schema: [{"question": string, "options": [string, string, string, string], "correctIndex": 0|1|2|3, "explanation": string}]. Questions must be factual, non-partisan, and educational. Cover topics like voter registration, EVMs, VVPAT, counting process, and government formation.`;

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  mr: "Marathi",
  ta: "Tamil",
  te: "Telugu",
  bn: "Bengali",
  gu: "Gujarati",
  kn: "Kannada",
};

/**
 * Handles POST requests to generate a quiz.
 * Validates language with Zod, enforces rate limits (10/min), then uses
 * the Gemini API to generate 5 multiple-choice questions about the
 * democratic election process.
 *
 * @param request - The incoming Next.js request with optional `language` in the body.
 * @returns JSON array of quiz question objects.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  // Rate limiting: 10 requests per IP per minute
  const rateLimitResponse = rateLimit(request, "quiz-generate", {
    maxRequests: 10,
    windowMs: 60_000,
  });
  if (rateLimitResponse) return rateLimitResponse;

  try {
    let language = "en";
    try {
      const body = await request.json();
      const parsed = quizGenerateBodySchema.safeParse(body);
      if (parsed.success) {
        language = parsed.data.language;
      }
      // If validation fails, default to English rather than rejecting
    } catch {
      // No body or invalid JSON — default to English
    }

    const langName = LANGUAGE_MAP[language] || "English";
    const PROMPT =
      language && language !== "en"
        ? `${BASE_PROMPT}\n\nGenerate all questions, options and explanations in ${langName}.`
        : BASE_PROMPT;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let questions = null;

    // First attempt
    try {
      const result = await model.generateContent(PROMPT);
      const text = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      questions = JSON.parse(text);
    } catch {
      // Retry once on JSON parse failure
      const result = await model.generateContent(PROMPT + "\n\nIMPORTANT: Return ONLY valid JSON. No markdown fences.");
      const text = result.response.text().replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      questions = JSON.parse(text);
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      await logEvent("ERROR", "Quiz generation invalid format", { language, success: false, responseTime: Date.now() - startTime });
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
    }

    await logEvent("INFO", "Quiz generated", { language, success: true, responseTime: Date.now() - startTime });
    return NextResponse.json(questions);
  } catch (error) {
    void error;
    await logEvent("ERROR", "Quiz generation failed", { success: false, responseTime: Date.now() - startTime });
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
