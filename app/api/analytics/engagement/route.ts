import { NextRequest, NextResponse } from "next/server";
import { AnalyticsEngine, UserAction } from "@/lib/analytics-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const metrics = AnalyticsEngine.getUserEngagementMetrics(userId);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error fetching engagement metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagement metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action } = body as { userId: string; action: UserAction };

    if (!userId || !action) {
      return NextResponse.json(
        { error: "User ID and action are required" },
        { status: 400 }
      );
    }

    AnalyticsEngine.trackUserEngagement(userId, action);

    return NextResponse.json({
      success: true,
      message: "Engagement tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking engagement:", error);
    return NextResponse.json(
      { error: "Failed to track engagement" },
      { status: 500 }
    );
  }
}
