import { NextRequest, NextResponse } from "next/server";
import { quizSubmitBodySchema } from "@/lib/validation";
import { adminAuth } from "@/lib/firebaseAdmin";

/**
 * Handles POST requests to submit a completed quiz.
 * Requires a valid Firebase ID token in the Authorization header.
 * Validates the request body with Zod and uses the decoded UID
 * from the token (ignoring client-sent userId for security).
 *
 * @param request - The incoming Next.js request containing quiz submission data.
 * @returns JSON response acknowledging the submission.
 */
export async function POST(request: NextRequest) {
  try {
    // Firebase Admin token verification
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or malformed Authorization header" },
        { status: 401 }
      );
    }

    const idToken = authHeader.slice(7);
    let decodedUid: string;
    try {
      const decoded = await adminAuth.verifyIdToken(idToken);
      decodedUid = decoded.uid;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired authentication token" },
        { status: 401 }
      );
    }

    // Zod validation
    const rawBody = await request.json();
    const parsed = quizSubmitBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Use decoded UID from the token, not the client-sent userId
    const { score, total, answers } = parsed.data;
    void decodedUid;
    void score;
    void total;
    void answers;

    // In production, save to Firestore using decodedUid as the document key.

    return NextResponse.json({ ok: true });
  } catch (error) {
    void error;
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
