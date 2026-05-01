import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const BASE_SYSTEM_PROMPT = `You are CivicAI, a friendly and neutral election education assistant.
You help citizens understand the democratic election process clearly and accurately.
You explain complex electoral concepts in simple language.
You are strictly non-partisan — never favour any party, candidate, or ideology.
When asked about specific elections, explain the process only, not outcomes or opinions.
Always encourage civic participation.
Keep responses concise — under 150 words unless the user asks for more detail.`;

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

export async function POST(request: NextRequest) {
  try {
    const { messages, newMessage, language } = await request.json();

    const langName = LANGUAGE_MAP[language] || "English";
    const SYSTEM_PROMPT =
      language && language !== "en"
        ? `${BASE_SYSTEM_PROMPT}\n\nAlways respond in ${langName}. Maintain the same accuracy and neutrality in all languages.`
        : BASE_SYSTEM_PROMPT;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "AI service is not configured. Please set up your API key." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const history = (messages || [])
      .filter((m: { role: string }) => m.role === "user" || m.role === "assistant")
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am CivicAI, ready to help with election education." }] },
        ...history.slice(0, -1),
      ],
    });

    const result = await chat.sendMessage(newMessage || "Hello");
    const reply = result.response.text();

    // Generate follow-up suggestions with a second Gemini call
    let followUps: string[] = [];
    try {
      const langInstruction =
        language && language !== "en"
          ? ` Generate the questions in ${langName}.`
          : "";
      const followUpPrompt = `Based on this conversation about elections, suggest exactly 3 short follow-up questions the user might want to ask next. Return ONLY a JSON array of 3 strings, no markdown, no preamble. Example: ["What is an EVM?", "How long does counting take?", "Can I vote without an ID?"]${langInstruction}\nConversation context: ${newMessage} → ${reply}`;

      const followUpResult = await model.generateContent(followUpPrompt);
      const followUpText = followUpResult.response
        .text()
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(followUpText);
      if (Array.isArray(parsed)) {
        followUps = parsed.slice(0, 3).map(String);
      }
    } catch {
      // If follow-up generation fails, return empty array
      followUps = [];
    }

    return NextResponse.json({ reply, followUps });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "I apologize, I encountered an error. Please try again.", followUps: [] },
      { status: 500 }
    );
  }
}
