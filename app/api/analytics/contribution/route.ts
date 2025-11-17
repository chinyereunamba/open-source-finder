import { NextRequest, NextResponse } from "next/server";
import { ContributionAnalytics } from "@/lib/analytics-engine";

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

    const metrics = ContributionAnalytics.getContributionImpactMetrics(userId);

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error("Error fetching contribution metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch contribution metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, projectId, contributionType, size } = body;

    if (!userId || !projectId || !contributionType) {
      return NextResponse.json(
        { error: "User ID, project ID, and contribution type are required" },
        { status: 400 }
      );
    }

    ContributionAnalytics.trackContribution(
      userId,
      projectId,
      contributionType,
      size
    );

    return NextResponse.json({
      success: true,
      message: "Contribution tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking contribution:", error);
    return NextResponse.json(
      { error: "Failed to track contribution" },
      { status: 500 }
    );
  }
}
