import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CommunityService } from "@/lib/community-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const reviews = await CommunityService.getProjectReviews(
      parseInt(projectId),
      page,
      limit
    );

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
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
    const { projectId, rating, title, content } = body;

    if (!projectId || !rating || !title || !content) {
      return NextResponse.json(
        { error: "Project ID, rating, title, and content are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const user = {
      name: session.user.name || "Anonymous",
      avatar: session.user.image || "",
      githubUsername: session.user.email?.split("@")[0],
    };

    const newReview = await CommunityService.addProjectReview(
      projectId,
      session.user.email!,
      rating,
      title,
      content,
      user
    );

    // Track the interaction
    await CommunityService.trackUserInteraction({
      userId: session.user.email!,
      projectId,
      type: "review",
      metadata: { rating, title },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}
