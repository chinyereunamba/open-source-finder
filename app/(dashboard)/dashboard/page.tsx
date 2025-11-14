"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  GitFork,
  GitPullRequest,
  TrendingUp,
  Flame,
  Award,
  BookMarked,
  Settings,
  Calendar,
} from "lucide-react";
import RecommendedProjects from "@/components/custom/recommended-projects";
import UserActivity from "@/components/custom/user-activity";
import UserContributions from "@/components/custom/user-contributions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookmarkedProjects from "@/components/custom/bookmarked-projects";
import ContributionStreak from "@/components/custom/contribution-streak";
import DashboardStats from "@/components/custom/dashboard-stats";
import { AchievementsPreview } from "@/components/custom/achievements-grid";
import { LevelDisplay } from "@/components/custom/level-display";
import { AchievementSystem } from "@/lib/achievement-system";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);

  const userId = session?.user?.email || "demo-user";

  useEffect(() => {
    if (session) {
      const userAchievements = AchievementSystem.getUserAchievements(userId);
      const userStats = AchievementSystem.getUserStats(userId);
      setAchievements(userAchievements);
      setStats(userStats);
    }
  }, [session, userId]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">
          You must be signed in to view your dashboard.
        </h2>
        <Link href="/auth/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const user = session.user as any;
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:px-6 mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                <AvatarFallback>
                  {user?.name?.substring(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  {greeting}, {user?.name?.split(" ")[0] || "Developer"}!
                </h1>
                <p className="text-muted-foreground">
                  Welcome back to your dashboard
                </p>
              </div>
            </div>
            <Link href="/profile/edit">
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <DashboardStats />

        {/* Level and Achievements Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Level Display */}
          <div>{stats && <LevelDisplay stats={stats} />}</div>

          {/* Achievements Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <Link href="/dashboard/achievements">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <AchievementsPreview
                achievements={achievements}
                maxDisplay={6}
                onViewAll={() =>
                  (window.location.href = "/dashboard/achievements")
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Contribution Streak */}
        <div className="mb-8">
          <ContributionStreak />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recommendations and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personalized Recommendations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recommended for You
                  </CardTitle>
                  <Badge variant="secondary">Personalized</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <RecommendedProjects />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserActivity />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Bookmarks and Contributions */}
          <div className="space-y-8">
            {/* Bookmarked Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5" />
                  Bookmarked Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BookmarkedProjects />
              </CardContent>
            </Card>

            {/* Recent Contributions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  Your Contributions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserContributions />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
