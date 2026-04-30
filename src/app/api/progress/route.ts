import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, stepId } = await request.json();

    // In production, update Firestore. For demo, just acknowledge.
    console.log("Progress update:", { userId, stepId });

    return NextResponse.json({ ok: true, completedSteps: [stepId] });
  } catch (error) {
    console.error("Progress error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
