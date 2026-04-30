import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are CivicAI, a friendly and neutral election education assistant.
You help citizens understand the democratic election process clearly and accurately.
You explain complex electoral concepts in simple language.
You are strictly non-partisan — never favour any party, candidate, or ideology.
When asked about specific elections, explain the process only, not outcomes or opinions.
Always encourage civic participation.
Keep responses concise — under 150 words unless the user asks for more detail.`;

export async function POST(request: NextRequest) {
  try {
    const { messages, newMessage } = await request.json();

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

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "I apologize, I encountered an error. Please try again." },
      { status: 500 }
    );
  }
}
