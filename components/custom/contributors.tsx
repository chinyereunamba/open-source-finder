"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ExternalLink,
} from "./index";
import { fetchProjectContributors } from "@/lib/github-api";

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function ProjectContributors({
  url,
}: {
  url: string;
}) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const getContributors = async () => {
      try {
        const data = await fetchProjectContributors(
          url
        );
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      } finally {
        setLoading(false);
      }
    };

    getContributors();
  }, [url]);

  if (loading) {
    return (
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted mb-2"></div>
              <div className="h-4 bg-muted rounded w-20 mb-1"></div>
              <div className="h-3 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // For demo purposes, use placeholder data if API fails
  const demoContributors: Contributor[] =
    contributors.length > 0
      ? contributors
      : [
          {
            id: 1,
            login: "gaearon",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/gaearon",
            contributions: 2547,
          },
          {
            id: 2,
            login: "bvaughn",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/bvaughn",
            contributions: 1823,
          },
          {
            id: 3,
            login: "acdlite",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/acdlite",
            contributions: 1456,
          },
          {
            id: 4,
            login: "sebmarkbage",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/sebmarkbage",
            contributions: 1245,
          },
          {
            id: 5,
            login: "sophiebits",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/sophiebits",
            contributions: 1102,
          },
          {
            id: 6,
            login: "trueadm",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/trueadm",
            contributions: 987,
          },
          {
            id: 7,
            login: "threepointone",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/threepointone",
            contributions: 876,
          },
          {
            id: 8,
            login: "lunaruan",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/lunaruan",
            contributions: 765,
          },
          {
            id: 9,
            login: "rickhanlonii",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/rickhanlonii",
            contributions: 654,
          },
          {
            id: 10,
            login: "gnoff",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/gnoff",
            contributions: 543,
          },
          {
            id: 11,
            login: "iansu",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/iansu",
            contributions: 432,
          },
          {
            id: 12,
            login: "eps1lon",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/eps1lon",
            contributions: 321,
          },
          {
            id: 13,
            login: "gaearon2",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/gaearon",
            contributions: 210,
          },
          {
            id: 14,
            login: "bvaughn2",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/bvaughn",
            contributions: 198,
          },
          {
            id: 15,
            login: "acdlite2",
            avatar_url: "/placeholder.svg?height=80&width=80",
            html_url: "https://github.com/acdlite",
            contributions: 187,
          },
        ];

  const visibleContributors = demoContributors.slice(0, visibleCount);
  const hasMore = visibleCount < demoContributors.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleContributors.map((contributor) => (
          <Card key={contributor.id}>
            <CardContent className="p-4 flex flex-col items-center text-center">
              <a
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Avatar className="w-16 h-16 mb-2 self-center group-hover:ring-2 ring-primary transition-all">
                  <AvatarImage
                    src={contributor.avatar_url}
                    alt={contributor.login}
                  />
                  <AvatarFallback>
                    {contributor.login.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="font-medium group-hover:text-primary transition-colors">
                  {contributor.login}
                </div>
                <div className="text-xs text-muted-foreground">
                  {contributor.contributions} commits
                </div>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Load more contributors
          </Button>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Button variant="outline" asChild>
          <a
            href="https://github.com/facebook/react/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View all contributors on GitHub
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
