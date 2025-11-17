"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  GitFork,
  ExternalLink,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  Users,
  Code,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

import { Project, fetchProjects } from "@/lib/github-api";
import { useSimilaritySearch } from "@/hooks/use-advanced-search";
import { SimilarityScore } from "@/lib/project-similarity";

interface SimilarProjectsEnhancedProps {
  project: Project;
  limit?: number;
  className?: string;
}

interface SimilarProjectWithData extends SimilarityScore {
  projectData?: Project;
}

export default function SimilarProjectsEnhanced({
  project,
  limit = 6,
  className,
}: SimilarProjectsEnhancedProps) {
  const { findSimilar, loading, error, results } = useSimilaritySearch();
  const [similarProjects, setSimilarProjects] = useState<
    SimilarProjectWithData[]
  >([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  useEffect(() => {
    loadAllProjects();
  }, []);

  useEffect(() => {
    if (project.id && allProjects.length > 0) {
      loadSimilarProjects();
    }
  }, [project.id, allProjects]);

  const loadAllProjects = async () => {
    try {
      const projects = await fetchProjects(1, "", "All", []);
      setAllProjects(projects);
    } catch (err) {
      console.error("Failed to load projects:", err);
    }
  };

  const loadSimilarProjects = async () => {
    try {
      const data = await findSimilar(project.id, limit);
      const similarityScores = data.results || [];

      // Map similarity scores to projects with data
      const projectsWithData = similarityScores
        .map((score: SimilarityScore) => ({
          ...score,
          projectData: allProjects.find((p) => p.id === score.projectId),
        }))
        .filter(
          (item: SimilarProjectWithData) => item.projectData !== undefined
        );

      setSimilarProjects(projectsWithData);
    } catch (err) {
      console.error("Failed to load similar projects:", err);
      toast.error("Failed to load similar projects");
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getSimilarityIcon = (type: string) => {
    switch (type) {
      case "language":
        return <Code className="h-3 w-3" />;
      case "topics":
        return <Lightbulb className="h-3 w-3" />;
      case "size":
        return <TrendingUp className="h-3 w-3" />;
      case "activity":
        return <Users className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 dark:text-green-400";
    if (score >= 0.6) return "text-blue-600 dark:text-blue-400";
    if (score >= 0.4) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Similar Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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
            <Lightbulb className="h-5 w-5" />
            Similar Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadSimilarProjects}
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

  if (similarProjects.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Similar Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              No similar projects found
            </p>
            <p className="text-sm text-muted-foreground">
              This project might be quite unique!
            </p>
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
            <Lightbulb className="h-5 w-5" />
            Similar Projects
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadSimilarProjects}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {similarProjects.map((similarProject, index) => {
            const proj = similarProject.projectData;
            if (!proj) return null;
            const topReason = similarProject.reasons[0];

            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group border rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/projects/${proj.id}`}
                        className="font-medium hover:underline block truncate"
                      >
                        {proj.full_name || proj.name}
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {proj.description || "No description available"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{formatNumber(proj.stargazers_count || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        <span>{formatNumber(proj.forks_count || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Similarity Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getSimilarityColor(
                          similarProject.score
                        )}`}
                      >
                        {Math.round(similarProject.score * 100)}% similar
                      </Badge>
                      {topReason && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {getSimilarityIcon(topReason.type)}
                          <span>{topReason.explanation}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Link href={`/projects/${proj.id}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>

                  {/* Language and Topics */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {proj.language && (
                      <div className="flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs">{proj.language}</span>
                      </div>
                    )}
                    {proj.topics?.slice(0, 2).map((topic: string) => (
                      <Badge
                        key={topic}
                        variant="secondary"
                        className="text-xs"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  {/* Additional Similarity Reasons */}
                  {similarProject.reasons.length > 1 && (
                    <div className="flex flex-wrap gap-1">
                      {similarProject.reasons.slice(1, 3).map((reason, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1"
                        >
                          {getSimilarityIcon(reason.type)}
                          <span>{reason.explanation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View More */}
        {similarProjects.length >= limit && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/projects?similar=${project.id}`}>
                View More Similar Projects
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
