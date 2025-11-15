"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  Clock,
  AlertCircle,
  MessageSquare,
  Star,
  Users,
  Zap,
  BookOpen,
  Target,
  Heart,
  Award,
  Timer,
  User,
  CheckCircle2,
} from "lucide-react";
import { fetchProjectIssues, Issue } from "@/lib/github-api";

interface EnhancedIssuesProps {
  projectId: number;
}

export default function EnhancedIssues({ projectId }: EnhancedIssuesProps) {
  const { data: session } = useSession();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const getIssues = async () => {
      try {
        const data = await fetchProjectIssues(projectId);
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };

    getIssues();
  }, [projectId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-12 bg-muted"></CardHeader>
            <CardContent className="h-16 mt-4 space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Enhanced demo issues with new features
  const enhancedDemoIssues: Issue[] = [
    {
      id: 1,
      number: 24680,
      title: "Fix accessibility issues in Button component",
      html_url: "https://github.com/facebook/react/issues/24680",
      created_at: "2023-03-15T10:30:00Z",
      updated_at: "2023-04-01T14:20:00Z",
      labels: [
        { name: "good-first-issue", color: "7057ff" },
        { name: "accessibility", color: "d4c5f9" },
        { name: "bug", color: "d73a4a" },
      ],
      comments: 5,
      body: "The Button component is not properly handling keyboard navigation. We need to ensure it works correctly with keyboard focus and screen readers.",
      difficulty: "beginner",
      isGoodFirstIssue: true,
      isHelpWanted: false,
      estimatedTime: "1-2 hours",
      mentorAvailable: true,
      assignee: null,
    },
    {
      id: 2,
      number: 24681,
      title: "Improve documentation for useEffect hook",
      html_url: "https://github.com/facebook/react/issues/24681",
      created_at: "2023-03-18T09:15:00Z",
      updated_at: "2023-03-30T11:45:00Z",
      labels: [
        { name: "good-first-issue", color: "7057ff" },
        { name: "documentation", color: "0075ca" },
      ],
      comments: 3,
      body: "The documentation for useEffect could use more examples, especially around cleanup functions and dependency arrays.",
      difficulty: "beginner",
      isGoodFirstIssue: true,
      isHelpWanted: true,
      estimatedTime: "2-3 hours",
      mentorAvailable: true,
      assignee: null,
    },
    {
      id: 3,
      number: 24682,
      title: "Add TypeScript types for new API methods",
      html_url: "https://github.com/facebook/react/issues/24682",
      created_at: "2023-03-20T14:45:00Z",
      updated_at: "2023-03-28T16:30:00Z",
      labels: [
        { name: "typescript", color: "3178c6" },
        { name: "help-wanted", color: "008672" },
      ],
      comments: 2,
      body: "We need to add TypeScript type definitions for the new API methods introduced in the latest release.",
      difficulty: "intermediate",
      isGoodFirstIssue: false,
      isHelpWanted: true,
      estimatedTime: "4-6 hours",
      mentorAvailable: true,
      assignee: null,
    },
    {
      id: 4,
      number: 24683,
      title: "Fix memory leak in useCallback hook",
      html_url: "https://github.com/facebook/react/issues/24683",
      created_at: "2023-03-22T11:20:00Z",
      updated_at: "2023-03-25T09:10:00Z",
      labels: [
        { name: "help-wanted", color: "008672" },
        { name: "bug", color: "d73a4a" },
        { name: "performance", color: "fbca04" },
        { name: "advanced", color: "ff6b6b" },
      ],
      comments: 15,
      body: "There appears to be a memory leak when using useCallback with certain dependency patterns. This needs investigation and a fix.",
      difficulty: "advanced",
      isGoodFirstIssue: false,
      isHelpWanted: true,
      estimatedTime: "1-2 days",
      mentorAvailable: false,
      assignee: {
        login: "maintainer-dev",
        avatar_url: "https://github.com/github.png",
      },
    },
    {
      id: 5,
      number: 24684,
      title: "Add example for server components integration",
      html_url: "https://github.com/facebook/react/issues/24684",
      created_at: "2023-03-25T16:40:00Z",
      updated_at: "2023-03-27T13:15:00Z",
      labels: [
        { name: "good-first-issue", color: "7057ff" },
        { name: "documentation", color: "0075ca" },
        { name: "help-wanted", color: "008672" },
      ],
      comments: 4,
      body: "We need more comprehensive examples showing how to integrate React Server Components with existing applications.",
      difficulty: "beginner",
      isGoodFirstIssue: true,
      isHelpWanted: true,
      estimatedTime: "2-4 hours",
      mentorAvailable: true,
      assignee: null,
    },
  ];

  const displayIssues = issues.length > 0 ? issues : enhancedDemoIssues;

  const getFilteredIssues = () => {
    let filtered = displayIssues;

    // Filter by tab
    if (activeTab === "good-first") {
      filtered = filtered.filter((issue) => issue.isGoodFirstIssue);
    } else if (activeTab === "help-wanted") {
      filtered = filtered.filter((issue) => issue.isHelpWanted);
    } else if (activeTab === "mentored") {
      filtered = filtered.filter((issue) => issue.mentorAvailable);
    }

    // Filter by difficulty
    if (filter !== "all") {
      filtered = filtered.filter((issue) => issue.difficulty === filter);
    }

    return filtered;
  };

  const filteredIssues = getFilteredIssues();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return <Star className="h-3 w-3" />;
      case "intermediate":
        return <Target className="h-3 w-3" />;
      case "advanced":
        return <Zap className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold">Issues & Contributions</h3>
          <p className="text-muted-foreground">
            Find the perfect issue to start contributing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issue Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">
              {displayIssues.filter((i) => i.isGoodFirstIssue).length}
            </div>
            <div className="text-xs text-muted-foreground">
              Good First Issues
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">
              {displayIssues.filter((i) => i.isHelpWanted).length}
            </div>
            <div className="text-xs text-muted-foreground">Help Wanted</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">
              {displayIssues.filter((i) => i.mentorAvailable).length}
            </div>
            <div className="text-xs text-muted-foreground">Mentored</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle2 className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">
              {displayIssues.filter((i) => !i.assignee).length}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            All Issues
          </TabsTrigger>
          <TabsTrigger value="good-first" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Good First
          </TabsTrigger>
          <TabsTrigger value="help-wanted" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Help Wanted
          </TabsTrigger>
          <TabsTrigger value="mentored" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Mentored
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No issues found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or check back later for new issues.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("all");
                    setFilter("all");
                  }}
                >
                  View all issues
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <Card
                  key={issue.id}
                  className="hover:shadow-md transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg font-medium leading-tight">
                            <a
                              href={issue.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline flex items-start gap-1 group"
                            >
                              {issue.title}
                              <ExternalLink className="h-4 w-4 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </CardTitle>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Opened {formatDate(issue.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {issue.comments} comments
                          </span>
                          <span className="text-muted-foreground">
                            #{issue.number}
                          </span>
                        </div>
                      </div>

                      {/* Enhanced Badges */}
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={`${getDifficultyColor(
                            issue?.difficulty || "intermediate"
                          )} flex items-center gap-1`}
                        >
                          {getDifficultyIcon(
                            issue?.difficulty || "intermediate"
                          )}
                          {issue.difficulty}
                        </Badge>

                        {issue.assignee && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            Assigned
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {issue.body}
                    </p>

                    {/* Enhanced Issue Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Special Badges */}
                        {issue.isGoodFirstIssue && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                          >
                            <Star className="h-3 w-3" />
                            Good First Issue
                          </Badge>
                        )}

                        {issue.isHelpWanted && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"
                          >
                            <Heart className="h-3 w-3" />
                            Help Wanted
                          </Badge>
                        )}

                        {issue.mentorAvailable && (
                          <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1"
                          >
                            <Users className="h-3 w-3" />
                            Mentor Available
                          </Badge>
                        )}

                        {/* Time Estimate */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          <Timer className="h-3 w-3" />
                          {issue.estimatedTime}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {issue.isGoodFirstIssue && !session && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <BookOpen className="h-3 w-3 mr-1" />
                            Learn More
                          </Button>
                        )}

                        <Button size="sm" asChild>
                          <a
                            href={issue.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Issue
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Original Labels */}
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                      {issue.labels.slice(0, 5).map((label) => (
                        <Badge
                          key={label.name}
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: `#${label.color}`,
                            backgroundColor: `#${label.color}15`,
                          }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                      {issue.labels.length > 5 && (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground"
                        >
                          +{issue.labels.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Contributor Onboarding Section */}
      {activeTab === "good-first" && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              New to Open Source?
            </CardTitle>
            <CardDescription>
              Get started with these beginner-friendly resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Contribution Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Learn how to make your first contribution
                </p>
              </div>
              <div className="text-center p-4">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Find a Mentor</h4>
                <p className="text-sm text-muted-foreground">
                  Get guidance from experienced contributors
                </p>
              </div>
              <div className="text-center p-4">
                <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium mb-1">Join Community</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with other contributors
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View More Button */}
      <div className="flex justify-center mt-6">
        <Button variant="outline" asChild>
          <a
            href={`https://github.com/search?q=repo:facebook/react+is:issue+is:open&type=issues`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View all issues on GitHub
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return "yesterday";
  } else if (diffDays < 30) {
    return `${diffDays} days ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}
