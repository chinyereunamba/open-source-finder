"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  UserEngagementMetrics,
  ProjectPopularityMetrics,
  ContributionImpactMetrics,
} from "@/lib/analytics-engine";
import {
  Activity,
  TrendingUp,
  Users,
  Eye,
  Bookmark,
  Share2,
  Award,
  Target,
} from "lucide-react";

interface AnalyticsDashboardProps {
  userId: string;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [engagementMetrics, setEngagementMetrics] =
    useState<UserEngagementMetrics | null>(null);
  const [contributionMetrics, setContributionMetrics] =
    useState<ContributionImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [engagementRes, contributionRes] = await Promise.all([
          fetch(`/api/analytics/engagement?userId=${userId}`),
          fetch(`/api/analytics/contribution?userId=${userId}`),
        ]);

        const engagementData = await engagementRes.json();
        const contributionData = await contributionRes.json();

        if (engagementData.success) {
          setEngagementMetrics(engagementData.data);
        }

        if (contributionData.success) {
          setContributionMetrics(contributionData.data);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [userId]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!engagementMetrics || !contributionMetrics) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  const getActivityLevelColor = (level: string) => {
    switch (level) {
      case "very_high":
        return "bg-green-500";
      case "high":
        return "bg-blue-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "expert":
        return "bg-purple-500";
      case "advanced":
        return "bg-blue-500";
      case "intermediate":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Score
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementMetrics.engagementScore}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge
                className={`${getActivityLevelColor(
                  engagementMetrics.activityLevel
                )} text-white`}
              >
                {engagementMetrics.activityLevel.replace("_", " ")}
              </Badge>
            </p>
            <Progress
              value={engagementMetrics.engagementScore}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projects Viewed
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementMetrics.projectsViewed}
            </div>
            <p className="text-xs text-muted-foreground">
              {engagementMetrics.projectsBookmarked} bookmarked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Contributions
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contributionMetrics.totalContributions}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {contributionMetrics.projectsContributed} projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contributionMetrics.impactScore}
            </div>
            <p className="text-xs text-muted-foreground">
              <Badge
                className={`${getQualityColor(
                  contributionMetrics.contributionQuality
                )} text-white`}
              >
                {contributionMetrics.contributionQuality}
              </Badge>
            </p>
            <Progress
              value={contributionMetrics.impactScore}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sessions</span>
              <span className="font-semibold">
                {engagementMetrics.sessionCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Time Spent</span>
              <span className="font-semibold">
                {Math.round(engagementMetrics.totalTimeSpent)} min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Searches Performed
              </span>
              <span className="font-semibold">
                {engagementMetrics.searchesPerformed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Filters Applied
              </span>
              <span className="font-semibold">
                {engagementMetrics.filtersApplied}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contribution Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Quality Level
              </span>
              <Badge
                className={`${getQualityColor(
                  contributionMetrics.contributionQuality
                )} text-white`}
              >
                {contributionMetrics.contributionQuality}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Average Size
              </span>
              <span className="font-semibold capitalize">
                {contributionMetrics.averageContributionSize}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Mentorship Provided
              </span>
              <span className="font-semibold">
                {contributionMetrics.mentorshipProvided}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Community Influence
              </span>
              <span className="font-semibold">
                {contributionMetrics.communityInfluence}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
