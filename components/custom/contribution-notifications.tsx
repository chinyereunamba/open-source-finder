"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Clock,
  Target,
  TrendingUp,
  X,
  Bell,
  Calendar,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface ContributionNotification {
  id: string;
  type:
    | "streak_reminder"
    | "goal_progress"
    | "streak_milestone"
    | "streak_danger";
  title: string;
  message: string;
  icon: React.ReactNode;
  priority: "low" | "medium" | "high";
  timestamp: Date;
  actionLabel?: string;
  actionUrl?: string;
}

export default function ContributionNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<
    ContributionNotification[]
  >([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) return;

    // Generate notifications based on user's contribution status
    const generateNotifications = (): ContributionNotification[] => {
      const now = new Date();
      const notifications: ContributionNotification[] = [];

      // Mock user data - in real app, this would come from API
      const currentStreak = 15;
      const lastContribution = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday
      const dailyGoal = 1;
      const todayContributions = 0;

      // Streak danger notification (haven't contributed today)
      if (currentStreak > 0 && todayContributions === 0) {
        const hoursLeft = 24 - now.getHours();
        notifications.push({
          id: "streak-danger",
          type: "streak_danger",
          title: "Streak at Risk!",
          message: `Your ${currentStreak}-day streak expires in ${hoursLeft} hours. Make a contribution to keep it alive!`,
          icon: <Flame className="h-4 w-4 text-red-500" />,
          priority: "high",
          timestamp: now,
          actionLabel: "Find Projects",
          actionUrl: "/projects",
        });
      }

      // Daily goal reminder
      if (todayContributions < dailyGoal) {
        notifications.push({
          id: "daily-goal",
          type: "goal_progress",
          title: "Daily Goal Reminder",
          message: `You're ${
            dailyGoal - todayContributions
          } contributions away from your daily goal.`,
          icon: <Target className="h-4 w-4 text-blue-500" />,
          priority: "medium",
          timestamp: now,
          actionLabel: "Contribute Now",
          actionUrl: "/projects",
        });
      }

      // Streak milestone celebration
      if (currentStreak > 0 && [7, 14, 30, 50, 100].includes(currentStreak)) {
        notifications.push({
          id: `milestone-${currentStreak}`,
          type: "streak_milestone",
          title: "Streak Milestone! 🎉",
          message: `Congratulations! You've reached a ${currentStreak}-day contribution streak!`,
          icon: <TrendingUp className="h-4 w-4 text-green-500" />,
          priority: "low",
          timestamp: now,
        });
      }

      // Weekly reminder (if it's Sunday and no contributions this week)
      if (now.getDay() === 0) {
        // Sunday
        notifications.push({
          id: "weekly-reminder",
          type: "streak_reminder",
          title: "Week Ending Soon",
          message:
            "It's Sunday! Make sure to get some contributions in before the week ends.",
          icon: <Calendar className="h-4 w-4 text-purple-500" />,
          priority: "medium",
          timestamp: now,
          actionLabel: "Browse Projects",
          actionUrl: "/projects",
        });
      }

      return notifications.filter((n) => !dismissed.has(n.id));
    };

    setNotifications(generateNotifications());

    // Set up periodic checks for time-sensitive notifications
    const interval = setInterval(() => {
      setNotifications(generateNotifications());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [session, dismissed]);

  const dismissNotification = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950";
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950";
      case "low":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950";
    }
  };

  if (!session || notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Contribution Reminders
        </span>
        <Badge variant="secondary" className="text-xs">
          {notifications.length}
        </Badge>
      </div>

      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Card
              className={`${getPriorityColor(notification.priority)} border`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold">
                          {notification.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        {notification.actionLabel && notification.actionUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() =>
                              (window.location.href = notification.actionUrl!)
                            }
                          >
                            {notification.actionLabel}
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-transparent"
                    onClick={() => dismissNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Motivational message when no urgent notifications */}
      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-6"
        >
          <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            You're all caught up! Keep up the great work.
          </p>
        </motion.div>
      )}
    </div>
  );
}
