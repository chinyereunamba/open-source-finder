"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  GitCommit,
  GitPullRequest,
  Star,
  Users,
  Award,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface ContributionMetrics {
  commits: number;
  pullRequests: number;
  issues: number;
  reviews: number;
  stars: number;
  forks: number;
}

interface TimeSeriesData {
  date: string;
  contributions: number;
  type: "commit" | "pr" | "issue" | "review";
}

interface LanguageStats {
  language: string;
  contributions: number;
  percentage: number;
  color: string;
}

interface ProjectContribution {
  projectName: string;
  contributions: number;
  lastContribution: Date;
  type: "owner" | "contributor";
}

export default function ContributionAnalytics() {
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );
  const [metrics, setMetrics] = useState<ContributionMetrics | null>(null);
  const [languageStats, setLanguageStats] = useState<LanguageStats[]>([]);
  const [projectContributions, setProjectContributions] = useState<
    ProjectContribution[]
  >([]);

  useEffect(() => {
    if (!session) return;

    // Generate mock analytics data
    const generateMetrics = (): ContributionMetrics => ({
      commits: Math.floor(Math.random() * 100) + 50,
      pullRequests: Math.floor(Math.random() * 30) + 10,
      issues: Math.floor(Math.random() * 20) + 5,
      reviews: Math.floor(Math.random() * 25) + 8,
      stars: Math.floor(Math.random() * 200) + 50,
      forks: Math.floor(Math.random() * 50) + 10,
    });

    const generateLanguageStats = (): LanguageStats[] => {
      const languages = [
        { name: "TypeScript", color: "#3178c6" },
        { name: "JavaScript", color: "#f7df1e" },
        { name: "Python", color: "#3776ab" },
        { name: "React", color: "#61dafb" },
        { name: "Go", color: "#00add8" },
      ];

      return languages
        .map((lang) => ({
          language: lang.name,
          contributions: Math.floor(Math.random() * 50) + 10,
          percentage: Math.floor(Math.random() * 30) + 10,
          color: lang.color,
        }))
        .sort((a, b) => b.contributions - a.contributions);
    };

    const generateProjectContributions = (): ProjectContribution[] => {
      const projects = [
        "awesome-project",
        "open-source-tool",
        "community-app",
        "dev-utilities",
        "web-framework",
      ];

      return projects
        .map((project) => ({
          projectName: project,
          contributions: Math.floor(Math.random() * 20) + 5,
          lastContribution: new Date(
            Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
          ),
          type: (Math.random() > 0.7 ? "owner" : "contributor") as
            | "owner"
            | "contributor",
        }))
        .sort((a, b) => b.contributions - a.contributions);
    };

    setMetrics(generateMetrics());
    setLanguageStats(generateLanguageStats());
    setProjectContributions(generateProjectContributions());
  }, [session, timeRange]);

  if (!session || !metrics) {
    return null;
  }

  const totalContributions =
    metrics.commits + metrics.pullRequests + metrics.issues + metrics.reviews;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitCommit className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium">Commits</span>
              </div>
              <div className="text-xl font-bold">{metrics.commits}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitPullRequest className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-medium">Pull Requests</span>
              </div>
              <div className="text-xl font-bold">{metrics.pullRequests}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-xs font-medium">Issues</span>
              </div>
              <div className="text-xl font-bold">{metrics.issues}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-medium">Reviews</span>
              </div>
              <div className="text-xl font-bold">{metrics.reviews}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium">Stars</span>
              </div>
              <div className="text-xl font-bold">{metrics.stars}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-medium">Total</span>
              </div>
              <div className="text-xl font-bold">{totalContributions}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs
        value={timeRange}
        onValueChange={(value) => setTimeRange(value as any)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detailed Analytics</h3>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Language Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Language Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languageStats.map((lang, index) => (
                  <motion.div
                    key={lang.language}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-sm font-medium">
                          {lang.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {lang.contributions}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {lang.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={lang.percentage} className="h-2" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectContributions.map((project, index) => (
                  <motion.div
                    key={project.projectName}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {project.projectName}
                        </span>
                        <Badge
                          variant={
                            project.type === "owner" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {project.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last: {project.lastContribution.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {project.contributions}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        contributions
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>

      {/* Contribution Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Contribution Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Commits",
                value: metrics.commits,
                total: totalContributions,
                color: "bg-green-500",
              },
              {
                label: "Pull Requests",
                value: metrics.pullRequests,
                total: totalContributions,
                color: "bg-blue-500",
              },
              {
                label: "Issues",
                value: metrics.issues,
                total: totalContributions,
                color: "bg-orange-500",
              },
              {
                label: "Reviews",
                value: metrics.reviews,
                total: totalContributions,
                color: "bg-purple-500",
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-2"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <svg
                    className="w-16 h-16 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200 dark:text-gray-700"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={item.color.replace("bg-", "text-")}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${
                        (item.value / item.total) * 100
                      }, 100`}
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {Math.round((item.value / item.total) * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
