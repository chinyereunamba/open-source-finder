"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GitPullRequest,
  GitCommit,
  Star,
  GitFork,
  MessageSquare,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";

interface ActivityItem {
  id: string;
  type: "pull_request" | "commit" | "star" | "fork" | "issue" | "comment";
  title: string;
  repository: string;
  timestamp: Date;
  url?: string;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
}

const activityIcons = {
  pull_request: GitPullRequest,
  commit: GitCommit,
  star: Star,
  fork: GitFork,
  issue: MessageSquare,
  comment: MessageSquare,
};

const activityColors = {
  pull_request: "text-federal_blue-500",
  commit: "text-olivine-500",
  star: "text-yellow-500",
  fork: "text-purple-500",
  issue: "text-cinnabar-500",
  comment: "text-blue-500",
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-olivine-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity
            </p>
          ) : (
            activities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];

              return (
                <div
                  key={activity.id}
                  className="flex gap-3 pb-4 border-b last:border-b-0 last:pb-0"
                >
                  <div className="flex-shrink-0">
                    <div className={`p-2 rounded-full bg-muted ${colorClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.repository}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(activity.timestamp)}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs h-fit">
                    {activity.type.replace("_", " ")}
                  </Badge>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
