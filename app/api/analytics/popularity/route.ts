import { NextRequest, NextResponse } from "next/server";
import { AnalyticsEngine } from "@/lib/analytics-engine";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const projectIds = searchParams.get("projectIds");

    if (projectId) {
      const metrics = AnalyticsEngine.getProjectPopularityMetrics(
        parseInt(projectId)
      );
      return NextResponse.json({
        success: true,
        data: metrics,
      });
    }

    if (projectIds) {
      const ids = projectIds.split(",").map((id) => parseInt(id));
      const topProjects = AnalyticsEngine.getTopProjects(ids, 10);
      return NextResponse.json({
        success: true,
        data: topProjects,
      });
    }

    return NextResponse.json(
      { error: "Project ID or IDs are required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching popularity metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch popularity metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, action, duration } = body;

    if (!projectId || !userId || !action) {
      return NextResponse.json(
        { error: "Project ID, user ID, and action are required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "view":
        AnalyticsEngine.trackProjectView(projectId, userId, duration);
        break;
      case "bookmark":
        AnalyticsEngine.trackProjectBookmark(projectId, true);
        break;
      case "unbookmark":
        AnalyticsEngine.trackProjectBookmark(projectId, false);
        break;
      case "share":
        AnalyticsEngine.trackProjectShare(projectId);
        break;
      case "click_through":
        AnalyticsEngine.trackProjectClickThrough(projectId);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Popularity tracked successfully",
    });
  } catch (error) {
    console.error("Error tracking popularity:", error);
    return NextResponse.json(
      { error: "Failed to track popularity" },
      { status: 500 }
    );
  }
}
