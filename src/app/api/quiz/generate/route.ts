import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PROMPT = `Generate exactly 5 multiple choice questions about the democratic election process. Return ONLY a JSON array with no markdown, no preamble, no code fences. Schema: [{"question": string, "options": [string, string, string, string], "correctIndex": 0|1|2|3, "explanation": string}]. Questions must be factual, non-partisan, and educational. Cover topics like voter registration, EVMs, VVPAT, counting process, and government formation.`;

export async function POST() {
  try {
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
      return NextResponse.json({ error: "Invalid response format" }, { status: 500 });
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Quiz generate error:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}
