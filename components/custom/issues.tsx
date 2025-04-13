"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ExternalLink,
  Clock,
  AlertCircle,
  MessageSquare,
} from "./index";
import { fetchProjectIssues } from "@/lib/github-api";

interface Issue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: {
    name: string;
    color: string;
  }[];
  comments: number;
  body: string;
}

export default function ProjectIssues({ id }: { id: number }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const getIssues = async () => {
      try {
        const data = await fetchProjectIssues(id);
        console.log(data);
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    getIssues();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-12 bg-muted"></CardHeader>
            <CardContent className="h-16 mt-4 space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // For demo purposes, use placeholder data if API fails
  const demoIssues: Issue[] =
    issues.length > 0
      ? issues
      : [
          {
            id: 1,
            number: 24680,
            title: "Fix accessibility issues in Button component",
            html_url: "https://github.com/facebook/react/issues/24680",
            created_at: "2023-03-15T10:30:00Z",
            updated_at: "2023-04-01T14:20:00Z",
            labels: [
              { name: "good-first-issue", color: "7057ff" },
              { name: "accessibility", color: "d4c5f9" },
              { name: "bug", color: "d73a4a" },
            ],
            comments: 5,
            body: "The Button component is not properly handling keyboard navigation. We need to ensure it works correctly with keyboard focus and screen readers.",
          },
          {
            id: 2,
            number: 24681,
            title: "Improve documentation for useEffect hook",
            html_url: "https://github.com/facebook/react/issues/24681",
            created_at: "2023-03-18T09:15:00Z",
            updated_at: "2023-03-30T11:45:00Z",
            labels: [
              { name: "good-first-issue", color: "7057ff" },
              { name: "documentation", color: "0075ca" },
            ],
            comments: 3,
            body: "The documentation for useEffect could use more examples, especially around cleanup functions and dependency arrays.",
          },
          {
            id: 3,
            number: 24682,
            title: "Add TypeScript types for new API methods",
            html_url: "https://github.com/facebook/react/issues/24682",
            created_at: "2023-03-20T14:45:00Z",
            updated_at: "2023-03-28T16:30:00Z",
            labels: [
              { name: "good-first-issue", color: "7057ff" },
              { name: "typescript", color: "3178c6" },
              { name: "help-wanted", color: "008672" },
            ],
            comments: 2,
            body: "We need to add TypeScript type definitions for the new API methods introduced in the latest release.",
          },
          {
            id: 4,
            number: 24683,
            title: "Fix memory leak in useCallback hook",
            html_url: "https://github.com/facebook/react/issues/24683",
            created_at: "2023-03-22T11:20:00Z",
            updated_at: "2023-03-25T09:10:00Z",
            labels: [
              { name: "help-wanted", color: "008672" },
              { name: "bug", color: "d73a4a" },
              { name: "performance", color: "fbca04" },
            ],
            comments: 8,
            body: "There appears to be a memory leak when using useCallback with certain dependency patterns. This needs investigation and a fix.",
          },
          {
            id: 5,
            number: 24684,
            title: "Add example for server components integration",
            html_url: "https://github.com/facebook/react/issues/24684",
            created_at: "2023-03-25T16:40:00Z",
            updated_at: "2023-03-27T13:15:00Z",
            labels: [
              { name: "good-first-issue", color: "7057ff" },
              { name: "documentation", color: "0075ca" },
              { name: "help-wanted", color: "008672" },
            ],
            comments: 4,
            body: "We need more comprehensive examples showing how to integrate React Server Components with existing applications.",
          },
        ];

  const filteredIssues =
    filter === "all"
      ? demoIssues
      : demoIssues.filter((issue) =>
          issue.labels.some((label) => label.name === filter)
        );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Open Issues</h3>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Issues</SelectItem>
            <SelectItem value="good-first-issue">Good First Issues</SelectItem>
            <SelectItem value="help-wanted">Help Wanted</SelectItem>
            <SelectItem value="bug">Bugs</SelectItem>
            <SelectItem value="documentation">Documentation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {issues.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-6">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              No issues found with the selected filter.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setFilter("all")}
            >
              View all issues
            </Button>
          </CardContent>
        </Card>
      ) : (
        issues.map((issue) => (
          <Card key={issue.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">
                  <a
                    href={issue.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-start"
                  >
                    {issue.title}
                    <ExternalLink className="h-4 w-4 ml-1 mt-1 inline-flex" />
                  </a>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  #{issue.number}
                </div>
              </div>
              <CardDescription className="flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Opened {formatDate(issue.created_at)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {issue.body}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mr-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{issue.comments} comments</span>
                </div>
                {issue.labels.map((label) => (
                  <Badge
                    key={label.name}
                    variant="outline"
                    style={{
                      borderColor: `#${label.color}`,
                      backgroundColor: `#${label.color}20`,
                    }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <div className="flex justify-center mt-4">
        <Button variant="outline" asChild>
          <a
            href="https://github.com/facebook/react/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all issues on GitHub
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
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
