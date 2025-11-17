import { NextResponse } from "next/server";
import { getHealthStatus } from "@/lib/monitoring";

/**
 * Health check endpoint
 * Returns system health status and metrics
 */
export async function GET() {
  try {
    const health = getHealthStatus();

    const statusCode =
      health.status === "healthy"
        ? 200
        : health.status === "degraded"
          ? 200
          : 503;

    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Failed to get health status",
      },
      { status: 503 }
    );
  }
}
