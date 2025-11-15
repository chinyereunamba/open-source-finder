"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectManagementDashboard } from "@/components/custom/project-management-dashboard";
import {
  Plus,
  Eye,
  Star,
  GitFork,
  Calendar,
  BarChart3,
  Settings,
  ExternalLink,
} from "lucide-react";

interface SubmittedProject {
  id: string;
  repoUrl: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  verificationScore?: number;
  githubData?: {
    name: string;
    full_name: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
    updated_at: string;
  };
}

export default function ProjectsManagementPage() {
  const [projects, setProjects] = useState<SubmittedProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/projects/submit");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (selectedProject) {
    const project = projects.find((p) => p.id === selectedProject);
    if (project) {
      return (
        <div className="container px-4 py-8 md:px-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setSelectedProject(null)}>
              ← Back to Projects
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {project.githubData?.name || "Project Analytics"}
              </h1>
              <p className="text-muted-foreground">
                {project.githubData?.full_name}
              </p>
            </div>
          </div>

          <ProjectManagementDashboard
            projectId={project.id}
            projectName={project.githubData?.name || "Unknown Project"}
          />
        </div>
      );
    }
  }

  return (
    <div className="container px-4 py-8 md:px-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your submitted projects and view analytics
          </p>
        </div>
        <Button asChild>
          <Link href="/submit">
            <Plus className="mr-2 h-4 w-4" />
            Submit New Project
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted animate-pulse rounded w-16" />
                    <div className="h-6 bg-muted animate-pulse rounded w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No projects yet</h3>
                <p className="text-muted-foreground">
                  Submit your first open source project to get started
                </p>
              </div>
              <Button asChild>
                <Link href="/submit">Submit Your First Project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {project.githubData?.name || "Unknown Project"}
                      </h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      {project.verificationScore && (
                        <Badge variant="outline">
                          Score: {project.verificationScore}/100
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground mb-3">
                      {project.description}
                    </p>

                    {project.githubData && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {project.githubData.stargazers_count} stars
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {project.githubData.forks_count} forks
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Updated{" "}
                          {new Date(
                            project.githubData.updated_at
                          ).toLocaleDateString()}
                        </span>
                        {project.githubData.language && (
                          <span>{project.githubData.language}</span>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Submitted{" "}
                      {new Date(project.submittedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {project.status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Button>
                    )}

                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.repoUrl} target="_blank">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
