"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GitPullRequest,
  GitMerge,
  MessageSquare,
  Star,
  GitFork,
  Clock,
} from "lucide-react";

interface Activity {
  id: number;
  type: "pull-request" | "issue" | "comment" | "star" | "fork";
  action: string;
  projectName: string;
  projectUrl: string;
  date: string;
  url: string;
}

export default function UserActivity() {
  const [activities] = useState<Activity[]>([
    {
      id: 1,
      type: "pull-request",
      action: "opened a pull request",
      projectName: "facebook/react",
      projectUrl: "/projects/1",
      date: "2023-04-15",
      url: "https://github.com/facebook/react/pull/12345",
    },
    {
      id: 2,
      type: "issue",
      action: "opened an issue",
      projectName: "vercel/next.js",
      projectUrl: "/projects/8",
      date: "2023-04-12",
      url: "https://github.com/vercel/next.js/issues/5678",
    },
    {
      id: 3,
      type: "comment",
      action: "commented on an issue",
      projectName: "facebook/react",
      projectUrl: "/projects/1",
      date: "2023-04-10",
      url: "https://github.com/facebook/react/issues/12346#issuecomment-1234567",
    },
    {
      id: 4,
      type: "star",
      action: "starred",
      projectName: "microsoft/vscode",
      projectUrl: "/projects/3",
      date: "2023-04-08",
      url: "https://github.com/microsoft/vscode",
    },
    {
      id: 5,
      type: "fork",
      action: "forked",
      projectName: "flutter/flutter",
      projectUrl: "/projects/4",
      date: "2023-04-05",
      url: "https://github.com/sarahjohnson/flutter",
    },
    {
      id: 6,
      type: "pull-request",
      action: "opened a pull request",
      projectName: "vercel/next.js",
      projectUrl: "/projects/8",
      date: "2023-04-03",
      url: "https://github.com/vercel/next.js/pull/7890",
    },
    {
      id: 7,
      type: "comment",
      action: "commented on a pull request",
      projectName: "django/django",
      projectUrl: "/projects/7",
      date: "2023-04-01",
      url: "https://github.com/django/django/pull/9876#issuecomment-9876543",
    },
    {
      id: 8,
      type: "issue",
      action: "closed an issue",
      projectName: "facebook/react",
      projectUrl: "/projects/1",
      date: "2023-03-28",
      url: "https://github.com/facebook/react/issues/24683",
    },
    {
      id: 9,
      type: "star",
      action: "starred",
      projectName: "rust-lang/rust",
      projectUrl: "/projects/5",
      date: "2023-03-25",
      url: "https://github.com/rust-lang/rust",
    },
    {
      id: 10,
      type: "pull-request",
      action: "merged a pull request",
      projectName: "vercel/next.js",
      projectUrl: "/projects/8",
      date: "2023-03-22",
      url: "https://github.com/vercel/next.js/pull/7891",
    },
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "pull-request":
        return <GitPullRequest className="h-5 w-5" />;
      case "issue":
        return <GitMerge className="h-5 w-5" />;
      case "comment":
        return <MessageSquare className="h-5 w-5" />;
      case "star":
        return <Star className="h-5 w-5" />;
      case "fork":
        return <GitFork className="h-5 w-5" />;
      default:
        return <GitPullRequest className="h-5 w-5" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "pull-request":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300";
      case "issue":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300";
      case "comment":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300";
      case "star":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300";
      case "fork":
        return "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-0.5 h-full bg-border mx-auto"></div>
        </div>
        <div className="relative space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="relative">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <Card className="flex-1">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">You</span>{" "}
                          {activity.action}{" "}
                          <Link
                            href={activity.projectUrl}
                            className="font-medium hover:underline"
                          >
                            {activity.projectName}
                          </Link>
                        </p>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{activity.date}</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="self-start sm:self-center"
                      >
                        <a
                          href={activity.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          View
                        </a>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
