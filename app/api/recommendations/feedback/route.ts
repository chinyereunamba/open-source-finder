import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { FeedbackData } from "@/lib/recommendation-engine";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, feedbackType } = body as {
      projectId: number;
      feedbackType: "interested" | "not_interested" | "dismissed";
    };

    if (!projectId || !feedbackType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const feedback: FeedbackData = {
      projectId,
      userId: session.user.email || "",
      feedbackType,
      timestamp: new Date(),
    };

    // In a real application, you would save this to a database
    // For now, we'll just acknowledge the feedback
    console.log("Feedback received:", feedback);

    return NextResponse.json({
      success: true,
      message: "Feedback recorded successfully",
    });
  } catch (error) {
    console.error("Error recording feedback:", error);
    return NextResponse.json(
      { error: "Failed to record feedback" },
      { status: 500 }
    );
  }
}
