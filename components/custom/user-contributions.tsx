"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitPullRequest, GitMerge, Clock, ExternalLink } from "lucide-react";

interface Contribution {
  id: number;
  title: string;
  description: string;
  projectName: string;
  projectUrl: string;
  type: "pull-request" | "issue" | "code-review";
  status: "open" | "merged" | "closed";
  date: string;
  url: string;
}

export default function UserContributions() {
  const [contributions] = useState<Contribution[]>([
    {
      id: 1,
      title: "Fix accessibility issues in Button component",
      description:
        "Improved keyboard navigation and screen reader support for the Button component",
      projectName: "facebook/react",
      projectUrl: "/projects/1",
      type: "pull-request",
      status: "merged",
      date: "2023-04-15",
      url: "https://github.com/facebook/react/pull/12345",
    },
    {
      id: 2,
      title: "Add TypeScript types for new API methods",
      description:
        "Added comprehensive TypeScript definitions for the new API methods introduced in v18",
      projectName: "facebook/react",
      projectUrl: "/projects/1",
      type: "pull-request",
      status: "open",
      date: "2023-04-10",
      url: "https://github.com/facebook/react/pull/12346",
    },
    {
      id: 3,
      title: "Improve error handling in data fetching hooks",
      description:
        "Enhanced error handling and added better error messages for data fetching hooks",
      projectName: "vercel/next.js",
      projectUrl: "/projects/8",
      type: "pull-request",
      status: "merged",
      date: "2023-03-28",
      url: "https://github.com/vercel/next.js/pull/7890",
    },
    {
      id: 4,
      title: "Fix memory leak in useCallback hook",
      description:
        "Identified and fixed a memory leak when using useCallback with certain dependency patterns",
      projectName: "facebook/react",
      projectUrl: "/projects/1",
      type: "issue",
      status: "closed",
      date: "2023-03-22",
      url: "https://github.com/facebook/react/issues/24683",
    },
    {
      id: 5,
      title: "Add example for server components integration",
      description:
        "Created comprehensive examples showing how to integrate React Server Components with existing applications",
      projectName: "vercel/next.js",
      projectUrl: "/projects/8",
      type: "pull-request",
      status: "merged",
      date: "2023-03-15",
      url: "https://github.com/vercel/next.js/pull/7891",
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "merged":
        return (
          <Badge variant="default" className="bg-green-600">
            Merged
          </Badge>
        );
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pull-request":
        return <GitPullRequest className="h-4 w-4 mr-1" />;
      case "issue":
        return <GitMerge className="h-4 w-4 mr-1" />;
      default:
        return <GitPullRequest className="h-4 w-4 mr-1" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Contributions</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      {contributions.map((contribution) => (
        <Card key={contribution.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center">
                  {getTypeIcon(contribution.type)}
                  <a
                    href={contribution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-start"
                  >
                    {contribution.title}
                    <ExternalLink className="h-4 w-4 ml-1 mt-1 inline-flex" />
                  </a>
                </div>
              </CardTitle>
              {getStatusBadge(contribution.status)}
            </div>
            <CardDescription className="flex items-center mt-1">
              <span>
                in{" "}
                <Link
                  href={contribution.projectUrl}
                  className="font-medium hover:underline"
                >
                  {contribution.projectName}
                </Link>
              </span>
              <span className="mx-2">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{contribution.date}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {contribution.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
