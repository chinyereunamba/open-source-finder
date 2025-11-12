"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  GitFork,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  X,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { useRecommendations } from "@/hooks/use-recommendations";
import { RecommendationReason } from "@/lib/recommendation-engine";
import { useState } from "react";
import { toast } from "sonner";

export default function RecommendedProjects() {
  const {
    recommendations,
    loading,
    error,
    provideFeedback,
    refreshRecommendations,
  } = useRecommendations({ limit: 6 });

  const [feedbackLoading, setFeedbackLoading] = useState<number | null>(null);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getReasonIcon = (type: RecommendationReason["type"]) => {
    switch (type) {
      case "language_match":
        return "💻";
      case "topic_interest":
        return "🎯";
      case "difficulty_level":
        return "📊";
      case "community_activity":
        return "👥";
      case "similar_projects":
        return "🔗";
      case "trending":
        return "🔥";
      default:
        return "✨";
    }
  };

  const handleFeedback = async (
    projectId: number,
    feedbackType: "interested" | "not_interested" | "dismissed"
  ) => {
    const project = recommendations.find((p) => p.id === projectId);
    if (!project) return;

    setFeedbackLoading(projectId);
    try {
      await provideFeedback(projectId, feedbackType, project);

      if (feedbackType === "interested") {
        toast.success("Great! We'll show you more projects like this.");
      } else if (feedbackType === "not_interested") {
        toast.info(
          "Thanks for the feedback. We'll adjust your recommendations."
        );
      }
    } catch (err) {
      toast.error("Failed to record feedback");
    } finally {
      setFeedbackLoading(null);
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshRecommendations();
      toast.success("Recommendations refreshed!");
    } catch (err) {
      toast.error("Failed to refresh recommendations");
    }
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">
          No recommendations yet. Start exploring projects to get personalized
          suggestions!
        </p>
        <Button asChild variant="outline" size="sm">
          <Link href="/projects">Browse Projects</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {recommendations.map((project) => {
        const topReason = project.reasons[0];
        const isFeedbackLoading = feedbackLoading === project.id;

        return (
          <Card
            key={project.id}
            className="group hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="font-medium hover:underline flex-1"
                  >
                    {project.full_name || project.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{formatNumber(project.stargazers_count)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{formatNumber(project.forks_count)}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description || "No description available"}
                </p>

                {/* Language and Topics */}
                <div className="flex items-center gap-2 flex-wrap">
                  {project.language && (
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                      <span className="text-sm">{project.language}</span>
                    </div>
                  )}
                  {project.topics?.slice(0, 2).map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Recommendation Reason */}
                {topReason && topReason.explanation && (
                  <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md">
                    <span className="text-base shrink-0">
                      {getReasonIcon(topReason.type)}
                    </span>
                    <p className="text-xs text-muted-foreground italic">
                      {topReason.explanation}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(project.id, "interested")}
                      disabled={isFeedbackLoading}
                      className="gap-1 h-8"
                      title="I'm interested"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span className="text-xs">Interested</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleFeedback(project.id, "not_interested")
                      }
                      disabled={isFeedbackLoading}
                      className="gap-1 h-8"
                      title="Not interested"
                    >
                      <ThumbsDown className="h-3 w-3" />
                      <span className="text-xs">Not for me</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(project.id, "dismissed")}
                      disabled={isFeedbackLoading}
                      className="h-8 px-2"
                      title="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="gap-1 h-8"
                  >
                    <Link href={`/projects/${project.id}`}>
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
