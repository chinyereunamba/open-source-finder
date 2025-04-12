"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Clock, ArrowRight } from "lucide-react";
import { fetchFeaturedProjects } from "@/lib/github-api";

interface Project {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  html_url: string;
  topics: string[];
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchFeaturedProjects();
        setProjects(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted"></CardHeader>
            <CardContent className="h-32 mt-4 space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // For demo purposes, use placeholder data if API fails
  const demoProjects: Project[] =
    projects.length > 0
      ? projects
      : [
          {
            id: 1,
            name: "react",
            full_name: "facebook/react",
            description:
              "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
            language: "JavaScript",
            stargazers_count: 198000,
            forks_count: 41000,
            open_issues_count: 1100,
            updated_at: "2023-04-01T12:00:00Z",
            html_url: "https://github.com/facebook/react",
            topics: ["javascript", "ui", "frontend", "good-first-issue"],
          },
          {
            id: 2,
            name: "tensorflow",
            full_name: "tensorflow/tensorflow",
            description:
              "An Open Source Machine Learning Framework for Everyone",
            language: "C++",
            stargazers_count: 170000,
            forks_count: 87000,
            open_issues_count: 2300,
            updated_at: "2023-04-02T10:30:00Z",
            html_url: "https://github.com/tensorflow/tensorflow",
            topics: ["machine-learning", "ai", "python", "help-wanted"],
          },
          {
            id: 3,
            name: "vscode",
            full_name: "microsoft/vscode",
            description: "Visual Studio Code",
            language: "TypeScript",
            stargazers_count: 142000,
            forks_count: 24000,
            open_issues_count: 7800,
            updated_at: "2023-04-03T09:15:00Z",
            html_url: "https://github.com/microsoft/vscode",
            topics: ["editor", "typescript", "good-first-issue"],
          },
          {
            id: 4,
            name: "flutter",
            full_name: "flutter/flutter",
            description:
              "Flutter makes it easy and fast to build beautiful apps for mobile and beyond",
            language: "Dart",
            stargazers_count: 147000,
            forks_count: 23000,
            open_issues_count: 11000,
            updated_at: "2023-04-01T14:20:00Z",
            html_url: "https://github.com/flutter/flutter",
            topics: ["mobile", "ui", "dart", "help-wanted"],
          },
          {
            id: 5,
            name: "rust",
            full_name: "rust-lang/rust",
            description:
              "Empowering everyone to build reliable and efficient software.",
            language: "Rust",
            stargazers_count: 79000,
            forks_count: 10000,
            open_issues_count: 8700,
            updated_at: "2023-04-02T16:45:00Z",
            html_url: "https://github.com/rust-lang/rust",
            topics: ["systems-programming", "language", "good-first-issue"],
          },
          {
            id: 6,
            name: "kubernetes",
            full_name: "kubernetes/kubernetes",
            description: "Production-Grade Container Scheduling and Management",
            language: "Go",
            stargazers_count: 97000,
            forks_count: 35000,
            open_issues_count: 2200,
            updated_at: "2023-04-03T11:30:00Z",
            html_url: "https://github.com/kubernetes/kubernetes",
            topics: ["container", "orchestration", "cloud", "help-wanted"],
          },
        ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {demoProjects.map((project) => (
        <Card key={project.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1">
              <Link
                href={`/projects/${project.id}`}
                className="hover:underline"
              >
                {project.full_name}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground line-clamp-2 mb-4">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.topics.slice(0, 3).map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {project.language && (
                <div className="flex items-center gap-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span>{project.language}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{formatNumber(project.stargazers_count)}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-4 w-4" />
                <span>{formatNumber(project.forks_count)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated {formatDate(project.updated_at)}</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/projects/${project.id}`}>
                  View <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function formatNumber(num: number): string {
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
