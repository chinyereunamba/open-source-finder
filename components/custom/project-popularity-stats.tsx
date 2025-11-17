"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectPopularityMetrics } from "@/lib/analytics-engine";
import { Eye, Users, Bookmark, Share2, MousePointerClick } from "lucide-react";

interface ProjectPopularityStatsProps {
  projectId: number;
}

export function ProjectPopularityStats({
  projectId,
}: ProjectPopularityStatsProps) {
  const [metrics, setMetrics] = useState<ProjectPopularityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `/api/analytics/popularity?projectId=${projectId}`
        );
        const data = await response.json();

        if (data.success) {
          setMetrics(data.data);
        }
      } catch (error) {
        console.error("Error fetching popularity metrics:", error);
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
          <CardTitle>Popularity Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
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

  const getPopularityLevel = (score: number) => {
    if (score >= 75) return { label: "Very Popular", color: "bg-green-500" };
    if (score >= 50) return { label: "Popular", color: "bg-blue-500" };
    if (score >= 25) return { label: "Growing", color: "bg-yellow-500" };
    return { label: "New", color: "bg-gray-500" };
  };

  const popularityLevel = getPopularityLevel(metrics.popularityScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Popularity Metrics</span>
          <Badge className={`${popularityLevel.color} text-white`}>
            {popularityLevel.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Popularity Score */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Popularity Score</span>
            <span className="text-2xl font-bold">
              {metrics.popularityScore}
            </span>
          </div>
          <Progress value={metrics.popularityScore} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-lg font-semibold">{metrics.viewCount}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Viewers</p>
              <p className="text-lg font-semibold">{metrics.uniqueViewers}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bookmark className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bookmarks</p>
              <p className="text-lg font-semibold">{metrics.bookmarkCount}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Share2 className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shares</p>
              <p className="text-lg font-semibold">{metrics.shareCount}</p>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Click-Through Rate
            </span>
            <span className="font-semibold">
              {metrics.clickThroughRate.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Avg. Time on Page
            </span>
            <span className="font-semibold">
              {Math.round(metrics.averageTimeOnPage)}s
            </span>
          </div>
          {metrics.popularityRank > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Popularity Rank
              </span>
              <Badge variant="outline">#{metrics.popularityRank}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
