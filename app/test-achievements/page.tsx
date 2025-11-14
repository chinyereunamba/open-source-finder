"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AchievementSystem,
  UserAchievement,
  UserStats,
} from "@/lib/achievement-system";
import { AchievementsGrid } from "@/components/custom/achievements-grid";
import { LevelDisplay } from "@/components/custom/level-display";
import { useAchievementNotifications } from "@/hooks/use-achievement-notifications";

export default function TestAchievementsPage() {
  const { data: session } = useSession();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const { trackContribution, trackBookmark, trackProjectView, trackShare } =
    useAchievementNotifications();

  const userId = session?.user?.id || "demo-user";

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
    setTimeout(refreshData, 100);
  };

  const handleTestBookmark = () => {
    trackBookmark(Math.floor(Math.random() * 1000));
    setTimeout(refreshData, 100);
  };

  const handleTestProjectView = () => {
    trackProjectView(Math.floor(Math.random() * 1000));
    setTimeout(refreshData, 100);
  };

  const handleTestShare = () => {
    trackShare(Math.floor(Math.random() * 1000));
    setTimeout(refreshData, 100);
  };

  const handleAddExperience = (amount: number) => {
    AchievementSystem.addExperience(userId, amount);
    refreshData();
  };

  const handleResetData = () => {
    AchievementSystem.clearUserData(userId);
    refreshData();
  };

  if (!stats) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Achievement System Test
        </h1>
        <p className="text-gray-600">
          Test the achievement system by triggering different actions
        </p>
      </div>

      {/* Level Display */}
      <LevelDisplay stats={stats} />

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Actions</CardTitle>
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

          <div className="grid grid-cols-3 gap-4">
            <Button
              onClick={() => handleAddExperience(100)}
              variant="outline"
              className="w-full"
            >
              +100 XP
            </Button>
            <Button
              onClick={() => handleAddExperience(500)}
              variant="outline"
              className="w-full"
            >
              +500 XP
            </Button>
            <Button
              onClick={() => handleAddExperience(1000)}
              variant="outline"
              className="w-full"
            >
              +1000 XP
            </Button>
          </div>

          <Button
            onClick={handleResetData}
            variant="destructive"
            className="w-full"
          >
            Reset All Data
          </Button>
        </CardContent>
      </Card>

      {/* Current Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {stats.level}
            </div>
            <p className="text-xs text-gray-500">Level</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {stats.experience}
            </div>
            <p className="text-xs text-gray-500">Total XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {stats.unlockedAchievements}
            </div>
            <p className="text-xs text-gray-500">Achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {stats.contributionStreak}
            </div>
            <p className="text-xs text-gray-500">Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Grid */}
      <AchievementsGrid
        achievements={achievements}
        viewMode="grid"
        filterCategory="all"
        showProgress={true}
      />
    </div>
  );
}
