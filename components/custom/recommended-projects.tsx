"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ArrowRight } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  tags: string[];
  reason: string;
}

export default function RecommendedProjects() {
  const [projects] = useState<Project[]>([
    {
      id: 5,
      name: "rust-lang/rust",
      description:
        "Empowering everyone to build reliable and efficient software.",
      language: "Rust",
      stars: 79000,
      forks: 10000,
      tags: ["systems-programming", "language", "good-first-issue"],
      reason: "Based on your interest in systems programming",
    },
    {
      id: 6,
      name: "kubernetes/kubernetes",
      description: "Production-Grade Container Scheduling and Management",
      language: "Go",
      stars: 97000,
      forks: 35000,
      tags: ["container", "orchestration", "cloud", "help-wanted"],
      reason: "Matches your cloud infrastructure skills",
    },
    {
      id: 7,
      name: "django/django",
      description: "The Web framework for perfectionists with deadlines.",
      language: "Python",
      stars: 65000,
      forks: 27000,
      tags: ["web-framework", "python", "good-first-issue"],
      reason: "You might enjoy this based on your web development experience",
    },
  ]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/projects/${project.id}`}
                    className="font-medium hover:underline"
                  >
                    {project.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{formatNumber(project.stars)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{formatNumber(project.forks)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <span className="text-sm">{project.language}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  {project.reason}
                </p>
              </div>
              <div className="flex items-center">
                <Button variant="ghost" size="sm" asChild className="gap-1">
                  <Link href={`/projects/${project.id}`}>
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
