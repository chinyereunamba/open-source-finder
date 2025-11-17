"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Flame,
  Star,
  GitFork,
  Activity,
  RefreshCw,
  ExternalLink,
  Code,
  Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

import { useTrendingProjects } from "@/hooks/use-advanced-search";
import { TrendingProject, TrendingCategory } from "@/lib/trending-projects";

interface TrendingDashboardProps {
  className?: string;
  showSummary?: boolean;
  defaultTimeframe?: "daily" | "weekly" | "monthly";
}

export default function TrendingDashboard({
  className,
  showSummary = true,
  defaultTimeframe = "weekly",
}: TrendingDashboardProps) {
  const {
    getTrending,
    getTrendingCategories,
    getTrendingSummary,
    loading,
    error,
    trendingProjects,
    trendingCategories,
    trendingSummary,
    timeframe,
  } = useTrendingProjects();

  const [activeView, setActiveView] = useState<"categories" | "timeframe">(
    "categories"
  );
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "daily" | "weekly" | "monthly"
  >(defaultTimeframe);

  useEffect(() => {
    if (showSummary) {
      getTrendingSummary();
    }
    getTrendingCategories();
  }, []);

  const handleTimeframeChange = async (
    newTimeframe: "daily" | "weekly" | "monthly"
  ) => {
    setSelectedTimeframe(newTimeframe);
    try {
      await getTrending(newTimeframe, 20);
    } catch (err) {
      console.error("Failed to load trending projects:", err);
      toast.error("Failed to load trending projects");
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getTrendingIcon = (type: string) => {
    switch (type) {
      case "rapid_growth":
        return <Flame className="h-4 w-4 text-orange-500" />;
      case "community_buzz":
        return <Activity className="h-4 w-4 text-blue-500" />;
      case "recent_release":
        return <Star className="h-4 w-4 text-yellow-500" />;
      case "consistent_activity":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const renderTrendingProject = (project: TrendingProject, index: number) => (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group border rounded-lg p-4 hover:shadow-md transition-all"
    >
      <div className="space-y-3">
        {/* Header with Rank */}
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
            #{index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <Link
              href={`/projects/${project.id}`}
              className="font-medium hover:underline block truncate"
            >
              {project.full_name || project.name}
            </Link>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description || "No description available"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <Link href={`/projects/${project.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{formatNumber(project.stargazers_count || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-4 w-4 text-blue-500" />
            <span>{formatNumber(project.forks_count || 0)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4 text-green-500" />
            <span>{formatNumber(project.open_issues_count || 0)} issues</span>
          </div>
        </div>

        {/* Trending Reason */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {getTrendingIcon(project.trendingReason.type)}
            <span>{Math.round(project.trendingScore * 100)}% trending</span>
          </Badge>
          <span className="text-xs text-muted-foreground">
            {project.trendingReason.explanation}
          </span>
        </div>

        {/* Language and Topics */}
        <div className="flex items-center gap-2 flex-wrap">
          {project.language && (
            <div className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              <span className="text-xs">{project.language}</span>
            </div>
          )}
          {project.topics?.slice(0, 3).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );

  if (loading && !trendingCategories.length && !trendingSummary) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => getTrendingCategories()}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Projects
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => getTrendingCategories()}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Section */}
        {showSummary && trendingSummary && (
          <div className="mb-6 space-y-4">
            <h3 className="font-semibold text-sm">Trending Overview</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Top Languages */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  Top Languages
                </h4>
                <div className="space-y-1">
                  {(trendingSummary as any).topLanguages
                    ?.slice(0, 5)
                    .map((lang: any) => (
                      <div
                        key={lang.language}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{lang.language}</span>
                        <Badge variant="secondary" className="text-xs">
                          {lang.count} projects
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>

              {/* Top Topics */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3 w-3" />
                  Top Topics
                </h4>
                <div className="flex flex-wrap gap-1">
                  {(trendingSummary as any).topTopics?.slice(0, 10).map((topic: any) => (
                    <Badge
                      key={topic.topic}
                      variant="outline"
                      className="text-xs"
                    >
                      {topic.topic} ({topic.count})
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="timeframe">By Timeframe</TabsTrigger>
          </TabsList>

          {/* Categories View */}
          <TabsContent value="categories" className="space-y-6 mt-4">
            {trendingCategories.map((category) => (
              <div key={category.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {category.timeframe}
                  </Badge>
                </div>

                {category.projects.length > 0 ? (
                  <div className="space-y-3">
                    {category.projects
                      .slice(0, 5)
                      .map((project, index) =>
                        renderTrendingProject(project, index)
                      )}
                  </div>
                ) : (
                  <div className="text-center py-6 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No trending projects in this category
                    </p>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          {/* Timeframe View */}
          <TabsContent value="timeframe" className="space-y-4 mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedTimeframe === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange("daily")}
                disabled={loading}
              >
                Daily
              </Button>
              <Button
                variant={selectedTimeframe === "weekly" ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange("weekly")}
                disabled={loading}
              >
                Weekly
              </Button>
              <Button
                variant={
                  selectedTimeframe === "monthly" ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleTimeframeChange("monthly")}
                disabled={loading}
              >
                Monthly
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : trendingProjects.length > 0 ? (
              <div className="space-y-3">
                {trendingProjects.map((project, index) =>
                  renderTrendingProject(project, index)
                )}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No trending projects for this timeframe
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
