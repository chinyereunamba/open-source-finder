import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { fetchProjects } from "@/lib/github-api";
import {
  RecommendationEngine,
  UserPreferences,
} from "@/lib/recommendation-engine";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { preferences, limit = 10 } = body as {
      preferences: UserPreferences;
      limit?: number;
    };

    // Fetch projects from GitHub
    const projects = await fetchProjects(1, "", "All", []);

    // Generate recommendations
    const recommendations = await RecommendationEngine.generateRecommendations(
      projects,
      preferences,
      limit
    );

    return NextResponse.json({
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    // Fetch trending projects for users without preferences
    const projects = await fetchProjects(1, "", "All", []);
    const trending = RecommendationEngine.getTrendingRecommendations(projects);

    return NextResponse.json({
      recommendations: trending.slice(0, limit),
      count: trending.length,
    });
  } catch (error) {
    console.error("Error fetching trending recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
