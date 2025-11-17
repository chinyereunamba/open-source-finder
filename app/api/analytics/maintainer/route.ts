import { NextRequest, NextResponse } from "next/server";
import { MaintainerAnalyticsDashboard } from "@/lib/analytics-engine";
import { fetchProject } from "@/lib/github-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const maintainerId = searchParams.get("maintainerId");

    if (!projectId || !maintainerId) {
      return NextResponse.json(
        { error: "Project ID and maintainer ID are required" },
        { status: 400 }
      );
    }

    const project = await fetchProject(parseInt(projectId));

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const analytics = MaintainerAnalyticsDashboard.getMaintainerAnalytics(
      parseInt(projectId),
      maintainerId,
      project
    );

    const summary = MaintainerAnalyticsDashboard.getAnalyticsSummary(analytics);

    return NextResponse.json({
      success: true,
      data: {
        analytics,
        summary,
      },
    });
  } catch (error) {
    console.error("Error fetching maintainer analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintainer analytics" },
      { status: 500 }
    );
  }
}
