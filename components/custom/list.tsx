"use client";

import { useState, useEffect } from "react";
import { fetchProjects } from "@/lib/github-api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Star,
  GitFork,
  Clock,
  MessageSquare,
  Link,
} from "./index";

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

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
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
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-16 bg-muted"></CardHeader>
            <CardContent className="h-24 mt-4 space-y-2">
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
          {
            id: 7,
            name: "django",
            full_name: "django/django",
            description: "The Web framework for perfectionists with deadlines.",
            language: "Python",
            stargazers_count: 65000,
            forks_count: 27000,
            open_issues_count: 1200,
            updated_at: "2023-04-01T18:20:00Z",
            html_url: "https://github.com/django/django",
            topics: ["web-framework", "python", "good-first-issue"],
          },
          {
            id: 8,
            name: "next.js",
            full_name: "vercel/next.js",
            description: "The React Framework for Production",
            language: "JavaScript",
            stargazers_count: 89000,
            forks_count: 19000,
            open_issues_count: 1500,
            updated_at: "2023-04-02T20:15:00Z",
            html_url: "https://github.com/vercel/next.js",
            topics: ["react", "framework", "javascript", "help-wanted"],
          },
        ];

  return (
    <div className="grid gap-4">
      {demoProjects.map((project) => (
        <Card key={project.id}>
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-6 ">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center">
                  <Link
                    href={`/projects/${project.id}`}
                    className="hover:underline"
                  >
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      {project.full_name}
                    </h3>
                  </Link>
                </div>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.topics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-row md:flex-col justify-between items-start p-6 border-t md:border-l md:border-t-0 md:max-w-[350px] w-full ">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-1 text-sm">
                  {project.language && (
                    <div className="flex items-center gap-1 mr-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                      <span>{project.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 mr-3">
                    <Star className="h-4 w-4" />
                    <span>{formatNumber(project.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center gap-1 mr-3">
                    <GitFork className="h-4 w-4" />
                    <span>{formatNumber(project.forks_count)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{formatNumber(project.open_issues_count)}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Updated {formatDate(project.updated_at)}</span>
                </div>
              </div>
              <Button size="sm" asChild className="mt-4">
                <Link href={`/projects/${project.id}`}>View Project</Link>
              </Button>
            </div>
          </div>
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
