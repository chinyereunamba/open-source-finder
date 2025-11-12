"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export default function ContributionStreak() {
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
  const currentStreak = 15;
  const longestStreak = 28;
  const totalContributions = contributionData.reduce(
    (sum, day) => sum + day.count,
    0
  );

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

  return (
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
                <span className="font-bold">{currentStreak}</span> day streak
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                <span className="font-bold">{longestStreak}</span> longest
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                <span className="font-bold">{totalContributions}</span> total
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
          {currentStreak >= 7 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800"
            >
              <Flame className="h-5 w-5 text-orange-500" />
              <p className="text-sm">
                <span className="font-semibold">Great job!</span> You're on a{" "}
                {currentStreak}-day streak. Keep it going!
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
