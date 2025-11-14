"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AchievementSystem,
  UserAchievement,
  UserStats,
} from "@/lib/achievement-system";
import { AchievementsGrid } from "@/components/custom/achievements-grid";
import { LevelDisplay } from "@/components/custom/level-display";
import { AchievementNotificationContainer } from "@/components/custom/achievement-notification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AchievementsPage() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [notifications, setNotifications] = useState<UserAchievement[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const userId = session?.user?.email || "demo-user";

  useEffect(() => {
    // Load user achievements and stats
    const userAchievements = AchievementSystem.getUserAchievements(userId);
    const userStats = AchievementSystem.getUserStats(userId);

    setAchievements(userAchievements);
    setStats(userStats);
  }, [userId]);

  const handleTestAchievement = () => {
    // Simulate unlocking an achievement for demo purposes
    const result = AchievementSystem.trackContribution(userId, 1);
    if (result.length > 0) {
      setNotifications((prev) => [...prev, ...result]);
      // Refresh achievements and stats
      setAchievements(AchievementSystem.getUserAchievements(userId));
      setStats(AchievementSystem.getUserStats(userId));
    }
  };

  const handleTestBookmark = () => {
    const result = AchievementSystem.trackBookmark(userId, 1);
    if (result.length > 0) {
      setNotifications((prev) => [...prev, ...result]);
      setAchievements(AchievementSystem.getUserAchievements(userId));
      setStats(AchievementSystem.getUserStats(userId));
    }
  };

  const handleTestProjectView = () => {
    const result = AchievementSystem.trackProjectView(userId, 1);
    if (result.length > 0) {
      setNotifications((prev) => [...prev, ...result]);
      setAchievements(AchievementSystem.getUserAchievements(userId));
      setStats(AchievementSystem.getUserStats(userId));
    }
  };

  const dismissNotification = (achievementId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== achievementId));
  };

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const inProgressAchievements = achievements.filter(
    (a) => !a.isUnlocked && a.progress > 0
  );
  const lockedAchievements = achievements.filter(
    (a) => !a.isUnlocked && a.progress === 0
  );

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
            <p className="text-gray-600 mt-1">
              Track your progress and unlock badges as you contribute to open
              source
            </p>
          </div>

          {/* Demo Controls */}
          <div className="flex gap-2">
            <Button onClick={handleTestAchievement} variant="outline" size="sm">
              Test Contribution
            </Button>
            <Button onClick={handleTestBookmark} variant="outline" size="sm">
              Test Bookmark
            </Button>
            <Button onClick={handleTestProjectView} variant="outline" size="sm">
              Test View
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Level Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <LevelDisplay stats={stats} />
      </motion.div>

      {/* Achievement Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {unlockedAchievements.length}
            </div>
            <p className="text-xs text-gray-500">
              {Math.round(
                (unlockedAchievements.length / achievements.length) * 100
              )}
              % complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inProgressAchievements.length}
            </div>
            <p className="text-xs text-gray-500">Working towards completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Locked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {lockedAchievements.length}
            </div>
            <p className="text-xs text-gray-500">Ready to unlock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total XP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.experience.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">Experience points earned</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="contribution">Contribution</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="exploration">Exploration</TabsTrigger>
              <TabsTrigger value="milestone">Milestone</TabsTrigger>
            </TabsList>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
            </div>
          </div>

          <TabsContent value="all">
            <AchievementsGrid
              achievements={achievements}
              viewMode={viewMode}
              filterCategory="all"
              showProgress={true}
            />
          </TabsContent>

          <TabsContent value="contribution">
            <AchievementsGrid
              achievements={achievements}
              viewMode={viewMode}
              filterCategory="contribution"
              showProgress={true}
            />
          </TabsContent>

          <TabsContent value="social">
            <AchievementsGrid
              achievements={achievements}
              viewMode={viewMode}
              filterCategory="social"
              showProgress={true}
            />
          </TabsContent>

          <TabsContent value="exploration">
            <AchievementsGrid
              achievements={achievements}
              viewMode={viewMode}
              filterCategory="exploration"
              showProgress={true}
            />
          </TabsContent>

          <TabsContent value="milestone">
            <AchievementsGrid
              achievements={achievements}
              viewMode={viewMode}
              filterCategory="milestone"
              showProgress={true}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Achievement Notifications */}
      <AchievementNotificationContainer
        achievements={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}
