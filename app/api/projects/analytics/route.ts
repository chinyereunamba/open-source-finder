import { NextRequest, NextResponse } from "next/server";

interface ProjectAnalytics {
  projectId: string;
  views: number;
  uniqueViews: number;
  bookmarks: number;
  shares: number;
  clickThroughs: number;
  dailyViews: Array<{ date: string; views: number }>;
  referrers: Array<{ source: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
}

// Simulate analytics data storage
const analyticsData: Record<string, ProjectAnalytics> = {};

// Generate mock analytics data for demonstration
function generateMockAnalytics(projectId: string): ProjectAnalytics {
  const now = new Date();
  const dailyViews = [];

  // Generate last 30 days of data
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dailyViews.push({
      date: date.toISOString().split("T")[0],
      views: Math.floor(Math.random() * 50) + 10,
    });
  }

  return {
    projectId,
    views: Math.floor(Math.random() * 1000) + 100,
    uniqueViews: Math.floor(Math.random() * 800) + 80,
    bookmarks: Math.floor(Math.random() * 50) + 5,
    shares: Math.floor(Math.random() * 20) + 2,
    clickThroughs: Math.floor(Math.random() * 200) + 20,
    dailyViews,
    referrers: [
      { source: "Direct", count: Math.floor(Math.random() * 100) + 20 },
      { source: "Google", count: Math.floor(Math.random() * 80) + 15 },
      { source: "GitHub", count: Math.floor(Math.random() * 60) + 10 },
      { source: "Twitter", count: Math.floor(Math.random() * 40) + 5 },
      { source: "Reddit", count: Math.floor(Math.random() * 30) + 3 },
    ],
    countries: [
      { country: "United States", count: Math.floor(Math.random() * 100) + 30 },
      { country: "Germany", count: Math.floor(Math.random() * 50) + 15 },
      { country: "United Kingdom", count: Math.floor(Math.random() * 40) + 12 },
      { country: "Canada", count: Math.floor(Math.random() * 30) + 8 },
      { country: "France", count: Math.floor(Math.random() * 25) + 6 },
    ],
    devices: [
      { device: "Desktop", count: Math.floor(Math.random() * 150) + 50 },
      { device: "Mobile", count: Math.floor(Math.random() * 100) + 30 },
      { device: "Tablet", count: Math.floor(Math.random() * 30) + 10 },
    ],
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const timeRange = searchParams.get("timeRange") || "30d";

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  // In a real application, you would:
  // 1. Verify the user has permission to view this project's analytics
  // 2. Fetch real analytics data from your database
  // 3. Apply time range filtering

  // For now, generate or return mock data
  if (!analyticsData[projectId]) {
    analyticsData[projectId] = generateMockAnalytics(projectId);
  }

  const analytics = analyticsData[projectId];

  // Apply time range filtering (simplified)
  let filteredAnalytics = { ...analytics };

  if (timeRange === "7d") {
    filteredAnalytics.dailyViews = analytics.dailyViews.slice(-7);
  } else if (timeRange === "14d") {
    filteredAnalytics.dailyViews = analytics.dailyViews.slice(-14);
  }

  return NextResponse.json(filteredAnalytics);
}

export async function POST(request: NextRequest) {
  try {
    const { projectId, event, metadata } = await request.json();

    if (!projectId || !event) {
      return NextResponse.json(
        { error: "Project ID and event type are required" },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate the event type
    // 2. Store the event in your analytics database
    // 3. Update aggregated metrics

    // For now, just simulate updating the analytics
    if (!analyticsData[projectId]) {
      analyticsData[projectId] = generateMockAnalytics(projectId);
    }

    const analytics = analyticsData[projectId];

    switch (event) {
      case "view":
        analytics.views += 1;
        analytics.uniqueViews += metadata?.isUnique ? 1 : 0;
        break;
      case "bookmark":
        analytics.bookmarks += 1;
        break;
      case "share":
        analytics.shares += 1;
        break;
      case "click_through":
        analytics.clickThroughs += 1;
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
