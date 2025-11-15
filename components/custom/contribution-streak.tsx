"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Flame,
  TrendingUp,
  Calendar,
  Target,
  Settings,
  Trophy,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGoal {
  type: "daily" | "weekly" | "monthly";
  target: number;
  current: number;
}

interface ContributionStats {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  averagePerDay: number;
  averagePerWeek: number;
  bestDay: { date: string; count: number };
  bestWeek: { start: string; count: number };
  contributionDays: number;
  goals: ContributionGoal[];
}

export default function ContributionStreak() {
  const { data: session } = useSession();
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: "daily" as const, target: 1 });
  const [stats, setStats] = useState<ContributionStats | null>(null);

  // Generate mock contribution data for the last 12 weeks
  const generateContributionData = (): ContributionDay[] => {
    const data: ContributionDay[] = [];
    const today = new Date();

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const count = Math.floor(Math.random() * 10);
      const level =
        count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

      data.push({
        date: date.toISOString().split("T")[0],
        count,
        level: level as 0 | 1 | 2 | 3 | 4,
      });
    }

    return data;
  };

  const contributionData = generateContributionData();

  // Calculate comprehensive stats
  const calculateStats = (): ContributionStats => {
    const totalContributions = contributionData.reduce(
      (sum, day) => sum + day.count,
      0
    );
    const contributionDays = contributionData.filter(
      (day) => day.count > 0
    ).length;
    const averagePerDay = totalContributions / contributionData.length;
    const averagePerWeek = averagePerDay * 7;

    // Find best day
    const bestDay = contributionData.reduce(
      (best, day) => (day.count > best.count ? day : best),
      contributionData[0]
    );

    // Calculate current streak
    let currentStreak = 0;
    for (let i = contributionData.length - 1; i >= 0; i--) {
      if (contributionData[i].count > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    for (const day of contributionData) {
      if (day.count > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Calculate best week
    let bestWeek = { start: contributionData[0].date, count: 0 };
    for (let i = 0; i <= contributionData.length - 7; i++) {
      const weekCount = contributionData
        .slice(i, i + 7)
        .reduce((sum, day) => sum + day.count, 0);
      if (weekCount > bestWeek.count) {
        bestWeek = { start: contributionData[i].date, count: weekCount };
      }
    }

    // Mock goals - in real app, these would be loaded from user preferences
    const goals: ContributionGoal[] = [
      {
        type: "daily",
        target: 1,
        current: contributionData[contributionData.length - 1]?.count || 0,
      },
      {
        type: "weekly",
        target: 5,
        current: contributionData
          .slice(-7)
          .reduce((sum, day) => sum + day.count, 0),
      },
      {
        type: "monthly",
        target: 20,
        current: contributionData
          .slice(-30)
          .reduce((sum, day) => sum + day.count, 0),
      },
    ];

    return {
      currentStreak,
      longestStreak,
      totalContributions,
      averagePerDay,
      averagePerWeek,
      bestDay,
      bestWeek,
      contributionDays,
      goals,
    };
  };

  useEffect(() => {
    setStats(calculateStats());
  }, []);

  if (!stats) return null;

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-muted";
      case 1:
        return "bg-green-200 dark:bg-green-900";
      case 2:
        return "bg-green-400 dark:bg-green-700";
      case 3:
        return "bg-green-600 dark:bg-green-500";
      case 4:
        return "bg-green-800 dark:bg-green-300";
      default:
        return "bg-muted";
    }
  };

  // Group by weeks
  const weeks: ContributionDay[][] = [];
  for (let i = 0; i < contributionData.length; i += 7) {
    weeks.push(contributionData.slice(i, i + 7));
  }

  const addGoal = () => {
    // In real app, this would save to backend/localStorage
    console.log("Adding goal:", newGoal);
    setShowGoalDialog(false);
    setNewGoal({ type: "daily", target: 1 });
  };

  return (
    <div className="space-y-6">
      {/* Main Contribution Calendar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Contribution Activity
            </CardTitle>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-sm">
                  <span className="font-bold">{stats.currentStreak}</span> day
                  streak
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">
                  <span className="font-bold">{stats.longestStreak}</span>{" "}
                  longest
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  <span className="font-bold">{stats.totalContributions}</span>{" "}
                  total
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Contribution Calendar */}
            <div className="overflow-x-auto">
              <div className="inline-flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <motion.div
                        key={day.date}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.2,
                          delay: (weekIndex * 7 + dayIndex) * 0.01,
                        }}
                        className={`w-3 h-3 rounded-sm ${getLevelColor(
                          day.level
                        )} hover:ring-2 hover:ring-primary cursor-pointer transition-all`}
                        title={`${day.date}: ${day.count} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-muted"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500"></div>
                <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-300"></div>
              </div>
              <span>More</span>
            </div>

            {/* Streak Motivation */}
            <AnimatePresence>
              {stats.currentStreak >= 7 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800"
                >
                  <Flame className="h-5 w-5 text-orange-500" />
                  <p className="text-sm">
                    <span className="font-semibold">Great job!</span> You're on
                    a {stats.currentStreak}-day streak. Keep it going!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Streak Maintenance Notification */}
            <AnimatePresence>
              {stats.currentStreak > 0 && stats.currentStreak < 7 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <Zap className="h-5 w-5 text-blue-500" />
                  <p className="text-sm">
                    <span className="font-semibold">Keep it up!</span> You're{" "}
                    {7 - stats.currentStreak} days away from a week streak!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Active Days</span>
            </div>
            <div className="text-2xl font-bold">{stats.contributionDays}</div>
            <div className="text-xs text-muted-foreground">
              {(
                (stats.contributionDays / contributionData.length) *
                100
              ).toFixed(1)}
              % of days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Daily Average</span>
            </div>
            <div className="text-2xl font-bold">
              {stats.averagePerDay.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.averagePerWeek.toFixed(1)} per week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Best Day</span>
            </div>
            <div className="text-2xl font-bold">{stats.bestDay.count}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(stats.bestDay.date).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Best Week</span>
            </div>
            <div className="text-2xl font-bold">{stats.bestWeek.count}</div>
            <div className="text-xs text-muted-foreground">
              Week of {new Date(stats.bestWeek.start).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Contribution Goals
            </CardTitle>
            <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Set Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Contribution Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-type">Goal Type</Label>
                    <select
                      id="goal-type"
                      className="w-full p-2 border rounded-md"
                      value={newGoal.type}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, type: e.target.value as any })
                      }
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="goal-target">Target Contributions</Label>
                    <Input
                      id="goal-target"
                      type="number"
                      min="1"
                      value={newGoal.target}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          target: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <Button onClick={addGoal} className="w-full">
                    Set Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.goals.map((goal, index) => (
              <motion.div
                key={`${goal.type}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {goal.type} Goal
                  </span>
                  <Badge
                    variant={
                      goal.current >= goal.target ? "default" : "secondary"
                    }
                  >
                    {goal.current}/{goal.target}
                  </Badge>
                </div>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="h-2"
                />
                {goal.current >= goal.target && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-green-600 dark:text-green-400"
                  >
                    <Trophy className="h-3 w-3" />
                    <span className="text-xs">Goal achieved!</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
