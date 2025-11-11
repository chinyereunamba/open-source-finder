"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  GitFork,
  Clock,
  ExternalLink,
  MessageSquare,
  Users,
  Tag,
  CheckCircle2,
  Bookmark,
  Share2,
  Eye,
  TrendingUp,
  Activity,
  Calendar,
  Code,
  AlertTriangle,
  Zap,
  Heart,
  Download,
} from "lucide-react";
import ProjectContributors from "../custom/contributors";
import ProjectIssues from "../custom/issues";
import ProjectReadme from "../custom/readme";
import ContributionDifficulty from "../custom/contribution-difficulty";
import GettingStarted from "./getting-started";
import SimilarProjects from "../custom/similar-projects";
import { Project } from "@/lib/github-api";

interface EnhancedProjectDetailProps {
  project: Project;
}

export default function EnhancedProjectDetail({
  project,
}: EnhancedProjectDetailProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement actual bookmark functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.full_name,
        text: project.description || "",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const getDifficultyLevel = () => {
    // Simple heuristic based on project stats
    const stars = project.stargazers_count;
    const issues = project.open_issues_count;

    if (stars > 10000 && issues > 100)
      return { level: "Advanced", color: "destructive" };
    if (stars > 1000 && issues > 20)
      return { level: "Intermediate", color: "default" };
    return { level: "Beginner", color: "secondary" };
  };

  const difficulty = getDifficultyLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container px-4 py-8 md:px-6 mx-auto">
        <div className="flex flex-col space-y-8">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-muted/50"
            >
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to projects
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBookmark}
                className={`transition-colors ${
                  isBookmarked ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 mr-1 ${
                    isBookmarked ? "fill-current" : ""
                  }`}
                />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Header */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {project.full_name}
                    </h1>
                    <Badge
                      variant={difficulty.color as any}
                      className="text-xs"
                    >
                      {difficulty.level}
                    </Badge>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.description || "No description available"}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.topics.slice(0, 8).map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="hover:bg-muted/50 transition-colors"
                      >
                        {topic}
                      </Badge>
                    ))}
                    {project.topics.length > 8 && (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        +{project.topics.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="text-2xl font-bold">
                        {formatNumber(project.stargazers_count)}
                      </div>
                      <div className="text-xs text-muted-foreground">Stars</div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <GitFork className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="text-2xl font-bold">
                        {formatNumber(project.forks_count)}
                      </div>
                      <div className="text-xs text-muted-foreground">Forks</div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <MessageSquare className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="text-2xl font-bold">
                        {formatNumber(project.open_issues_count)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Issues
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Eye className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="text-2xl font-bold">
                        {Math.floor(Math.random() * 1000)}k
                      </div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:bg-muted/50"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Star Project
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:bg-muted/50"
                  >
                    <GitFork className="mr-2 h-4 w-4" />
                    Fork
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="hover:bg-muted/50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Clone
                  </Button>
                </div>
              </div>

              {/* Enhanced Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 h-12">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="readme"
                    className="flex items-center gap-2"
                  >
                    <Code className="h-4 w-4" />
                    README
                  </TabsTrigger>
                  <TabsTrigger
                    value="issues"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Issues
                  </TabsTrigger>
                  <TabsTrigger
                    value="contributors"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Contributors
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Project Health */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Project Health
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Activity Level</span>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            High
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Response Time</span>
                          <span className="text-sm font-medium">~2 days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Community Score</span>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium">9.2/10</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>New release v2.1.0</span>
                          <span className="text-muted-foreground ml-auto">
                            2 days ago
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>15 issues closed</span>
                          <span className="text-muted-foreground ml-auto">
                            1 week ago
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>New contributor joined</span>
                          <span className="text-muted-foreground ml-auto">
                            2 weeks ago
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contribution Guidelines */}
                  <Card>
                    <CardHeader>
                      <CardTitle>How to Contribute</CardTitle>
                      <CardDescription>
                        Get started with contributing to this project
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              1
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">Fork & Clone</h4>
                            <p className="text-sm text-muted-foreground">
                              Fork the repository and clone it locally
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              2
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">Find an Issue</h4>
                            <p className="text-sm text-muted-foreground">
                              Look for "good first issue" labels
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              3
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">Submit PR</h4>
                            <p className="text-sm text-muted-foreground">
                              Create a pull request with your changes
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="readme" className="mt-6">
                  <ProjectReadme
                    projectId={project.id}
                    projectUrl={project.html_url}
                  />
                </TabsContent>

                <TabsContent value="issues" className="mt-6">
                  <ProjectIssues id={project.id} />
                </TabsContent>

                <TabsContent value="contributors" className="mt-6">
                  <ProjectContributors projectId={project.id} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Contribution Difficulty */}
              <ContributionDifficulty project={project} />

              {/* Getting Started */}
              <GettingStarted project={project} />

              {/* Enhanced Project Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Project Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Created
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(
                          project?.created_at || ""
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Last Updated
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(project.updated_at)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Language
                      </span>
                      <Badge variant="outline">
                        {project.language || "Multiple"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        License
                      </span>
                      <span className="text-sm font-medium">
                        {project.license?.name || "Not specified"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">
                      Contribution Difficulty
                    </div>
                    <Badge
                      variant={difficulty.color as any}
                      className="w-full justify-center"
                    >
                      {difficulty.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Projects */}
              <SimilarProjects />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}
