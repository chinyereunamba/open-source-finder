"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  AchievementSystem,
  UserAchievement,
  UserStats,
} from "@/lib/achievement-system";
import { useAchievementNotifications } from "@/hooks/use-achievement-notifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LevelDisplay } from "@/components/custom/level-display";
import { AchievementsPreview } from "@/components/custom/achievements-grid";
import { Badge } from "@/components/ui/badge";

export default function TestAchievementsPage() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const { trackContribution, trackBookmark, trackProjectView, trackShare } =
    useAchievementNotifications();

  const userId = session?.user?.email || "demo-user";

  const refreshData = () => {
    const userAchievements = AchievementSystem.getUserAchievements(userId);
    const userStats = AchievementSystem.getUserStats(userId);
    setAchievements(userAchievements);
    setStats(userStats);
  };

  useEffect(() => {
    refreshData();
  }, [userId]);

  const handleTestContribution = () => {
    trackContribution(Math.floor(Math.random() * 1000));
    // Refresh data after a short delay to see changes
    setTimeout(refreshData, 100);
  };

  const handleTestBookmark = () => {
    trackBookmark(Math.floor(Math.random() * 1000));
    // Refresh data after a short delay to see changes
    setTimeout(refreshData, 100);
  };

  const handleTestProjectView = () => {
    trackProjectView(Math.floor(Math.random() * 1000));
    // Refresh data after a short delay to see changes
    setTimeout(refreshData, 100);
  };

  const handleTestShare = () => {
    trackShare(Math.floor(Math.random() * 1000));
    // Refresh data after a short delay to see changes
    setTimeout(refreshData, 100);
  };

  const handleClearData = () => {
    AchievementSystem.clearUserData(userId);
    refreshData();
  };

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const inProgressCount = achievements.filter(
    (a) => !a.isUnlocked && a.progress > 0
  ).length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-text">
            Achievement System Test
          </h1>
          <p className="text-muted-foreground">
            Test the achievement system by simulating user actions
          </p>
        </div>
      </motion.div>

      {/* Level Display */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <LevelDisplay stats={stats} />
        </motion.div>
      )}

      {/* Test Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Test Achievement Triggers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button onClick={handleTestContribution} className="w-full">
                Test Contribution
              </Button>
              <Button onClick={handleTestBookmark} className="w-full">
                Test Bookmark
              </Button>
              <Button onClick={handleTestProjectView} className="w-full">
                Test Project View
              </Button>
              <Button onClick={handleTestShare} className="w-full">
                Test Share
              </Button>
            </div>
            <div className="flex justify-center pt-4">
              <Button onClick={handleClearData} variant="destructive" size="sm">
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{achievements.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {unlockedCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((unlockedCount / achievements.length) * 100)}%
                complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.experience.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">XP earned</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <AchievementsPreview achievements={achievements} maxDisplay={12} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["contribution", "social", "exploration", "milestone"].map(
            (category) => {
              const categoryAchievements = achievements.filter(
                (a) => a.category === category
              );
              const unlockedInCategory = categoryAchievements.filter(
                (a) => a.isUnlocked
              ).length;

              return (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {unlockedInCategory} / {categoryAchievements.length}
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (unlockedInCategory / categoryAchievements.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-1">Contribution Achievements</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Test Contribution" to simulate contributing to projects
                  and unlock contribution-based achievements.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-1">Social Achievements</h4>
                <p className="text-sm text-muted-foreground">
                  Use "Test Bookmark" and "Test Share" to unlock social
                  achievements.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-1">Exploration Achievements</h4>
                <p className="text-sm text-muted-foreground">
                  Click "Test Project View" to simulate viewing projects and
                  unlock exploration achievements.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <h4 className="font-medium mb-1">Level System</h4>
                <p className="text-sm text-muted-foreground">
                  Watch your level and experience points increase as you unlock
                  achievements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
