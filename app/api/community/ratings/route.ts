import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CommunityService } from "@/lib/community-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession();
    const ratings = await CommunityService.getProjectRatings(
      parseInt(projectId),
      session?.user?.email || undefined
    );

    return NextResponse.json(ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, rating } = body;

    if (!projectId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid project ID and rating (1-5) are required" },
        { status: 400 }
      );
    }

    const newRating = await CommunityService.rateProject(
      projectId,
      session.user.email!,
      rating
    );

    // Track the interaction
    await CommunityService.trackUserInteraction({
      userId: session.user.email!,
      projectId,
      type: "rate",
      metadata: { rating },
    });

    return NextResponse.json(newRating);
  } catch (error) {
    console.error("Error adding rating:", error);
    return NextResponse.json(
      { error: "Failed to add rating" },
      { status: 500 }
    );
  }
}
