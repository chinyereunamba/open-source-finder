import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CommunityService } from "@/lib/community-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get("projectId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const comments = await CommunityService.getProjectComments(
      parseInt(projectId),
      page,
      limit
    );

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
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
    const { projectId, content, parentId } = body;

    if (!projectId || !content) {
      return NextResponse.json(
        { error: "Project ID and content are required" },
        { status: 400 }
      );
    }

    const user = {
      name: session.user.name || "Anonymous",
      avatar: session.user.image || "",
      githubUsername: session.user.email?.split("@")[0],
    };

    const newComment = await CommunityService.addProjectComment(
      projectId,
      session.user.email!,
      content,
      user,
      parentId
    );

    // Track the interaction
    await CommunityService.trackUserInteraction({
      userId: session.user.email!,
      projectId,
      type: "comment",
      metadata: { parentId },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
