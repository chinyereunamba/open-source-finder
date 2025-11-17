"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CommunityHealthMetrics } from "@/lib/analytics-engine";
import {
  Heart,
  Activity,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface CommunityHealthIndicatorProps {
  projectId: number;
}

export function CommunityHealthIndicator({
  projectId,
}: CommunityHealthIndicatorProps) {
  const [metrics, setMetrics] = useState<CommunityHealthMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/analytics/community-health?projectId=${projectId}`
        );
        const data = await response.json();

        if (data.success) {
          setMetrics(data.data);
        }
      } catch (error) {
        console.error("Error fetching community health metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [projectId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return null;
  }

  const getHealthColor = (score: number) => {
    if (score >= 75) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-blue-600 bg-blue-100";
    if (score >= 25) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getHealthLabel = (score: number) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 25) return "Fair";
    return "Needs Attention";
  };

  const getActivityBadgeColor = (level: string) => {
    switch (level) {
      case "very_active":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "moderate":
        return "bg-yellow-500";
      case "low":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Community Health
          </span>
          <Badge
            className={`${getActivityBadgeColor(
              metrics.activityLevel
            )} text-white`}
          >
            {metrics.activityLevel.replace("_", " ")}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Health Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Health Score</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{metrics.healthScore}</span>
              <Badge className={getHealthColor(metrics.healthScore)}>
                {getHealthLabel(metrics.healthScore)}
              </Badge>
            </div>
          </div>
          <Progress value={metrics.healthScore} className="h-2" />
        </div>

        {/* Health Indicators */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Maintainer Responsiveness
              </span>
              <span className="font-semibold">
                {metrics.maintainerResponsiveness}%
              </span>
            </div>
            <Progress
              value={metrics.maintainerResponsiveness}
              className="h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contributor Diversity
              </span>
              <span className="font-semibold">
                {metrics.contributorDiversity}%
              </span>
            </div>
            <Progress value={metrics.contributorDiversity} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Heart className="h-4 w-4" />
                New Contributor Friendliness
              </span>
              <span className="font-semibold">
                {metrics.newContributorFriendliness}%
              </span>
            </div>
            <Progress
              value={metrics.newContributorFriendliness}
              className="h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documentation Quality
              </span>
              <span className="font-semibold">
                {metrics.documentationQuality}%
              </span>
            </div>
            <Progress value={metrics.documentationQuality} className="h-1.5" />
          </div>
        </div>

        {/* Recommendations */}
        {metrics.healthScore < 50 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Community Health Needs Attention
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Consider improving documentation, responding to issues faster,
                  and welcoming new contributors.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
