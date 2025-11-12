"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  GitFork,
  GitPullRequest,
  GitCommit,
  Award,
  TrendingUp,
} from "lucide-react";

interface ProfileStatsProps {
  stats: {
    totalContributions: number;
    pullRequests: number;
    issuesOpened: number;
    commits: number;
    starsReceived: number;
    forksReceived: number;
    contributionStreak: number;
    longestStreak: number;
  };
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: "Total Contributions",
      value: stats.totalContributions,
      icon: GitCommit,
      color: "text-olivine-500",
    },
    {
      label: "Pull Requests",
      value: stats.pullRequests,
      icon: GitPullRequest,
      color: "text-federal_blue-500",
    },
    {
      label: "Issues Opened",
      value: stats.issuesOpened,
      icon: TrendingUp,
      color: "text-cinnabar-500",
    },
    {
      label: "Stars Received",
      value: stats.starsReceived,
      icon: Star,
      color: "text-yellow-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-olivine-500" />
          Contribution Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <item.icon className={`h-6 w-6 mb-2 ${item.color}`} />
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Current Streak</span>
            <Badge
              variant="secondary"
              className="bg-olivine-500/10 text-olivine-700 dark:text-olivine-400"
            >
              🔥 {stats.contributionStreak} days
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Longest Streak</span>
            <Badge variant="outline">{stats.longestStreak} days</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
