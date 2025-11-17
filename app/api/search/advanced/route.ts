import { NextRequest, NextResponse } from "next/server";
import { fetchProjects } from "@/lib/github-api";
import { SemanticSearchEngine, SearchQuery } from "@/lib/semantic-search";
import { ProjectSimilarityEngine } from "@/lib/project-similarity";
import { TrendingProjectsEngine } from "@/lib/trending-projects";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      type = "semantic",
      filters = {},
      limit = 20,
      page = 1,
    } = body;

    // Fetch projects from GitHub API
    const projects = await fetchProjects(1, "", "All", []);

    let results;

    switch (type) {
      case "semantic":
        const searchQuery: SearchQuery = {
          text: query || "",
          filters,
        };
        const semanticResults = SemanticSearchEngine.searchProjects(
          projects,
          searchQuery
        );
        results = {
          type: "semantic",
          results: semanticResults.slice((page - 1) * limit, page * limit),
          total: semanticResults.length,
          page,
          limit,
        };
        break;

      case "similar":
        if (!body.projectId) {
          return NextResponse.json(
            { error: "Project ID required for similarity search" },
            { status: 400 }
          );
        }

        const targetProject = projects.find((p) => p.id === body.projectId);
        if (!targetProject) {
          return NextResponse.json(
            { error: "Project not found" },
            { status: 404 }
          );
        }

        const similarityResults = ProjectSimilarityEngine.findSimilarProjects(
          targetProject,
          projects,
          limit
        );

        results = {
          type: "similar",
          results: similarityResults,
          targetProject,
          total: similarityResults.length,
        };
        break;

      case "clusters":
        const clusters = ProjectSimilarityEngine.createTopicClusters(projects);
        results = {
          type: "clusters",
          results: clusters,
          total: clusters.length,
        };
        break;

      case "trending":
        const timeframe = body.timeframe || "weekly";
        const trendingResults = TrendingProjectsEngine.getTrendingProjects(
          projects,
          timeframe,
          limit
        );

        results = {
          type: "trending",
          results: trendingResults,
          timeframe,
          total: trendingResults.length,
        };
        break;

      case "trending-categories":
        const categories =
          TrendingProjectsEngine.getTrendingByCategory(projects);
        results = {
          type: "trending-categories",
          results: categories,
          total: categories.length,
        };
        break;

      case "trending-summary":
        const summary = TrendingProjectsEngine.getTrendingSummary(projects);
        results = {
          type: "trending-summary",
          results: summary,
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid search type" },
          { status: 400 }
        );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Advanced search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "semantic";
    const limit = parseInt(searchParams.get("limit") || "20");
    const page = parseInt(searchParams.get("page") || "1");

    // Parse filters from query parameters
    const filters: SearchQuery["filters"] = {};

    const languages = searchParams.get("languages");
    if (languages) {
      filters.languages = languages.split(",");
    }

    const topics = searchParams.get("topics");
    if (topics) {
      filters.topics = topics.split(",");
    }

    const minStars = searchParams.get("minStars");
    if (minStars) {
      filters.minStars = parseInt(minStars);
    }

    const maxStars = searchParams.get("maxStars");
    if (maxStars) {
      filters.maxStars = parseInt(maxStars);
    }

    const hasGoodFirstIssues = searchParams.get("hasGoodFirstIssues");
    if (hasGoodFirstIssues === "true") {
      filters.hasGoodFirstIssues = true;
    }

    // Use POST handler logic by creating a mock request
    const body = { query, type, filters, limit, page };
    const mockRequest = {
      json: async () => body,
    } as NextRequest;

    return POST(mockRequest);
  } catch (error) {
    console.error("Advanced search GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
