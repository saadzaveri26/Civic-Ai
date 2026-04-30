import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, score, total, answers } = await request.json();

    // In production, save to Firestore. For demo, just acknowledge.
    console.log("Quiz submitted:", { userId, score, total, answersCount: answers?.length });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
