import { NextRequest, NextResponse } from "next/server";
import { CommunityService } from "@/lib/community-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type =
      (searchParams.get("type") as "contributions" | "reviews" | "helpful") ||
      "contributions";
    const limit = parseInt(searchParams.get("limit") || "50");

    const leaderboard = await CommunityService.getLeaderboard(type, limit);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
