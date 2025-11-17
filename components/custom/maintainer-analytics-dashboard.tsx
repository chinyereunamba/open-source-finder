"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintainerAnalytics } from "@/lib/analytics-engine";
import {
  TrendingUp,
  Users,
  Eye,
  Target,
  MessageSquare,
  GitPullRequest,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

interface MaintainerAnalyticsDashboardProps {
  projectId: number;
  maintainerId: string;
}

export function MaintainerAnalyticsDashboard({
  projectId,
  maintainerId,
}: MaintainerAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<MaintainerAnalytics | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `/api/analytics/maintainer?projectId=${projectId}&maintainerId=${maintainerId}`
        );
        const data = await response.json();

        if (data.success) {
          setAnalytics(data.data.analytics);
          setSummary(data.data.summary);
        }
      } catch (error) {
        console.error("Error fetching maintainer analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [projectId, maintainerId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics || !summary) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analytics data available
      </div>
    );
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 75) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-blue-600 bg-blue-100";
    if (score >= 25) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Performance Overview</span>
            <Badge className={getPerformanceColor(summary.performanceScore)}>
              Score: {summary.performanceScore}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={summary.performanceScore} className="h-2 mb-6" />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{analytics.totalViews}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unique Visitors</p>
                <p className="text-2xl font-bold">{analytics.uniqueVisitors}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {analytics.conversionRate.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Retention</p>
                <p className="text-2xl font-bold">
                  {analytics.contributorRetention}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {summary.insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-600 mt-2" />
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {summary.recommendations.length > 0 ? (
                summary.recommendations.map(
                  (recommendation: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-yellow-600 mt-2" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  )
                )
              ) : (
                <li className="text-sm text-muted-foreground">
                  Great job! No recommendations at this time.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">
                    {analytics.issueMetrics.totalIssues}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {analytics.issueMetrics.openIssues}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Closed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.issueMetrics.closedIssues}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Avg. Time to Close
                  </span>
                  <span className="font-semibold">
                    {analytics.issueMetrics.averageTimeToClose} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Issues with Responses
                  </span>
                  <span className="font-semibold">
                    {analytics.issueMetrics.issuesWithResponses}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Avg. Response Time
                  </span>
                  <span className="font-semibold">
                    {analytics.issueMetrics.averageResponseTime}h
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contributor Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Contributors
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.contributorMetrics.totalContributors}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Contributors
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.contributorMetrics.activeContributors}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    New This Month
                  </span>
                  <Badge variant="outline">
                    {analytics.contributorMetrics.newContributorsThisMonth}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Retention Rate
                  </span>
                  <span className="font-semibold">
                    {analytics.contributorMetrics.contributorRetentionRate}%
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-3">Top Contributors</p>
                <div className="space-y-2">
                  {analytics.contributorMetrics.topContributors.map(
                    (contributor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="text-sm font-medium">
                            {contributor.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {contributor.contributions} contributions
                          </span>
                          <Badge className="bg-purple-100 text-purple-700">
                            Impact: {contributor.impact}
                          </Badge>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg. Session Duration
                  </p>
                  <p className="text-2xl font-bold">
                    {analytics.engagementMetrics.averageSessionDuration.toFixed(
                      1
                    )}
                    m
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bounce Rate</p>
                  <p className="text-2xl font-bold">
                    {analytics.engagementMetrics.bounceRate}%
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Return Visitor Rate
                  </span>
                  <span className="font-semibold">
                    {analytics.engagementMetrics.returnVisitorRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Social Shares
                  </span>
                  <span className="font-semibold">
                    {analytics.engagementMetrics.socialShares}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
