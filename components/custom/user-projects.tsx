"use client";

import { useState } from "react";
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
import { Star, GitFork, ExternalLink } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  url: string;
  githubUrl: string;
  stars: number;
  forks: number;
  language: string;
  tags: string[];
  isOwner: boolean;
}

export default function UserProjects() {
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "react-data-table",
      description: "A lightweight, fast and extendable data table for React",
      url: "/projects/101",
      githubUrl: "https://github.com/sarahjohnson/react-data-table",
      stars: 1240,
      forks: 320,
      language: "TypeScript",
      tags: ["react", "data-visualization", "ui-component"],
      isOwner: true,
    },
    {
      id: 2,
      name: "next-auth-helpers",
      description:
        "A collection of helper functions for authentication in Next.js applications",
      url: "/projects/102",
      githubUrl: "https://github.com/sarahjohnson/next-auth-helpers",
      stars: 780,
      forks: 150,
      language: "TypeScript",
      tags: ["next.js", "authentication", "security"],
      isOwner: true,
    },
    {
      id: 3,
      name: "tailwind-components",
      description:
        "A library of reusable Tailwind CSS components for rapid UI development",
      url: "/projects/103",
      githubUrl: "https://github.com/sarahjohnson/tailwind-components",
      stars: 560,
      forks: 120,
      language: "JavaScript",
      tags: ["tailwind", "ui", "components"],
      isOwner: true,
    },
    {
      id: 4,
      name: "react",
      description:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces",
      url: "/projects/1",
      githubUrl: "https://github.com/facebook/react",
      stars: 198000,
      forks: 41000,
      language: "JavaScript",
      tags: ["javascript", "ui", "frontend"],
      isOwner: false,
    },
    {
      id: 5,
      name: "next.js",
      description: "The React Framework for Production",
      url: "/projects/8",
      githubUrl: "https://github.com/vercel/next.js",
      stars: 89000,
      forks: 19000,
      language: "JavaScript",
      tags: ["react", "framework", "javascript"],
      isOwner: false,
    },
  ]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">My Projects</h3>
        <Button asChild>
          <Link href="/submit">
            <ExternalLink className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {projects
          .filter((p) => p.isOwner)
          .map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  <Link href={project.url} className="hover:underline">
                    {project.name}
                  </Link>
                  {project.isOwner && (
                    <Badge variant="outline" className="ml-2">
                      Owner
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
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
                    <span>{formatNumber(project.stars)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{formatNumber(project.forks)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Contributing To</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {projects
            .filter((p) => !p.isOwner)
            .map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="line-clamp-1">
                    <Link href={project.url} className="hover:underline">
                      {project.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
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
                      <span>{formatNumber(project.stars)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{formatNumber(project.forks)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
