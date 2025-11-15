"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Bookmark,
  Share2,
  ExternalLink,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";

interface ProjectAnalytics {
  projectId: string;
  views: number;
  uniqueViews: number;
  bookmarks: number;
  shares: number;
  clickThroughs: number;
  dailyViews: Array<{ date: string; views: number }>;
  referrers: Array<{ source: string; count: number }>;
  countries: Array<{ country: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
}

interface ProjectManagementDashboardProps {
  projectId: string;
  projectName: string;
}

export function ProjectManagementDashboard({
  projectId,
  projectName,
}: ProjectManagementDashboardProps) {
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [projectId, timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/projects/analytics?projectId=${projectId}&timeRange=${timeRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Project Analytics</h2>
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                <div className="h-8 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load analytics data.</p>
        <Button onClick={fetchAnalytics} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Analytics</h2>
          <p className="text-muted-foreground">{projectName}</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Views
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.views)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics.uniqueViews} unique visitors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Bookmarks
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.bookmarks)}
                </p>
              </div>
              <Bookmark className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {((analytics.bookmarks / analytics.views) * 100).toFixed(1)}%
              conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Shares
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.shares)}
                </p>
              </div>
              <Share2 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Social engagement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Click-throughs
                </p>
                <p className="text-2xl font-bold">
                  {formatNumber(analytics.clickThroughs)}
                </p>
              </div>
              <ExternalLink className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              To GitHub repository
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Daily Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Daily Views
                </CardTitle>
                <CardDescription>
                  Views over the last{" "}
                  {timeRange === "7d" ? "7" : timeRange === "14d" ? "14" : "30"}{" "}
                  days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.dailyViews.slice(-7).map((day, index) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-muted-foreground">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 bg-blue-500 rounded"
                          style={{
                            width: `${
                              (day.views /
                                Math.max(
                                  ...analytics.dailyViews.map((d) => d.views)
                                )) *
                              100
                            }px`,
                            minWidth: "4px",
                          }}
                        />
                        <span className="text-sm font-medium w-8 text-right">
                          {day.views}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Device Types
                </CardTitle>
                <CardDescription>How users access your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.devices.map((device) => (
                    <div
                      key={device.device}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.device)}
                        <span className="text-sm">{device.device}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 bg-green-500 rounded"
                          style={{
                            width: `${
                              (device.count /
                                analytics.devices.reduce(
                                  (sum, d) => sum + d.count,
                                  0
                                )) *
                              60
                            }px`,
                            minWidth: "4px",
                          }}
                        />
                        <span className="text-sm font-medium">
                          {device.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Traffic Sources
              </CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.referrers.map((referrer) => (
                  <div
                    key={referrer.source}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{referrer.source}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-purple-500 rounded"
                        style={{
                          width: `${
                            (referrer.count /
                              Math.max(
                                ...analytics.referrers.map((r) => r.count)
                              )) *
                            100
                          }px`,
                          minWidth: "4px",
                        }}
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {referrer.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>Top countries by visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.countries.map((country) => (
                  <div
                    key={country.country}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm">{country.country}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-orange-500 rounded"
                        style={{
                          width: `${
                            (country.count /
                              Math.max(
                                ...analytics.countries.map((c) => c.count)
                              )) *
                            100
                          }px`,
                          minWidth: "4px",
                        }}
                      />
                      <span className="text-sm font-medium w-12 text-right">
                        {country.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recommendations
          </CardTitle>
          <CardDescription>
            Ways to improve your project's visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.views < 100 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Increase Visibility
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Share your project on social media and developer communities
                    to increase views.
                  </p>
                </div>
              </div>
            )}

            {analytics.bookmarks / analytics.views < 0.05 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <Bookmark className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Improve Engagement
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Add more detailed project descriptions and screenshots to
                    increase bookmark rates.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Community Building
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Engage with contributors by responding to issues and pull
                  requests promptly.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
