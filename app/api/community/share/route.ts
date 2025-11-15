import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CommunityService } from "@/lib/community-service";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, platform } = body;

    if (!projectId || !platform) {
      return NextResponse.json(
        { error: "Project ID and platform are required" },
        { status: 400 }
      );
    }

    // Track the share interaction
    await CommunityService.trackUserInteraction({
      userId: session.user.email!,
      projectId,
      type: "share",
      metadata: { platform },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking share:", error);
    return NextResponse.json(
      { error: "Failed to track share" },
      { status: 500 }
    );
  }
}
