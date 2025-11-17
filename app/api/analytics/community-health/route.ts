import { NextRequest, NextResponse } from "next/server";
import { CommunityHealthAnalytics } from "@/lib/analytics-engine";
import { fetchProject } from "@/lib/github-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await fetchProject(parseInt(projectId));

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const healthMetrics =
      CommunityHealthAnalytics.calculateCommunityHealth(project);

    return NextResponse.json({
      success: true,
      data: healthMetrics,
    });
  } catch (error) {
    console.error("Error fetching community health metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch community health metrics" },
      { status: 500 }
    );
  }
}
