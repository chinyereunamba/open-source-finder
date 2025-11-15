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
  Star,
  BookOpen,
  Users,
  Clock,
  Award,
  ExternalLink,
  Heart,
  Zap,
  CheckCircle2,
  MessageSquare,
  Target,
  Lightbulb,
} from "lucide-react";
import { Issue, fetchGoodFirstIssues } from "@/lib/github-api";

interface GoodFirstIssueHighlighterProps {
  projectId: number;
  maxIssues?: number;
}

export default function GoodFirstIssueHighlighter({
  projectId,
  maxIssues = 3,
}: GoodFirstIssueHighlighterProps) {
  const { data: session } = useSession();
  const [goodFirstIssues, setGoodFirstIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // In a real app, this would fetch actual good first issues
        const demoGoodFirstIssues: Issue[] = [
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
            body: "The Button component is not properly handling keyboard navigation. We need to ensure it works correctly with keyboard focus and screen readers. This is a great issue for someone new to accessibility!",
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
            body: "The documentation for useEffect could use more examples, especially around cleanup functions and dependency arrays. Perfect for someone who wants to contribute to documentation!",
            difficulty: "beginner",
            isGoodFirstIssue: true,
            isHelpWanted: true,
            estimatedTime: "2-3 hours",
            mentorAvailable: true,
            assignee: null,
          },
          {
            id: 3,
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
            body: "We need more comprehensive examples showing how to integrate React Server Components with existing applications. Great for learning about the latest React features!",
            difficulty: "beginner",
            isGoodFirstIssue: true,
            isHelpWanted: true,
            estimatedTime: "2-4 hours",
            mentorAvailable: true,
            assignee: null,
          },
        ];

        setGoodFirstIssues(demoGoodFirstIssues.slice(0, maxIssues));
      } catch (error) {
        console.error("Error fetching good first issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [projectId, maxIssues]);

  if (loading) {
    return (
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-green-600 animate-pulse" />
            Loading Good First Issues...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goodFirstIssues.length === 0) {
    return (
      <Card className="border-l-4 border-l-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gray-500" />
            Good First Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground mb-4">
              No good first issues available right now.
            </p>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-1" />
              View All Issues
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-green-600" />
          Perfect for Beginners!
        </CardTitle>
        <CardDescription>
          These issues are specially curated for first-time contributors
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Beginner Benefits Banner */}
        <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-900">Why Start Here?</h4>
          </div>
          <div className="grid md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Clear documentation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Mentor support available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span>Beginner-friendly scope</span>
            </div>
          </div>
        </div>

        {/* Good First Issues List */}
        <div className="space-y-3">
          {goodFirstIssues.map((issue, index) => (
            <Card
              key={issue.id}
              className="hover:shadow-md transition-shadow border-green-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Good First Issue
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        #{issue.number}
                      </Badge>
                      {issue.mentorAvailable && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Mentor Available
                        </Badge>
                      )}
                    </div>

                    <h4 className="font-medium mb-2 leading-tight">
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-blue-700 hover:text-blue-900"
                      >
                        {issue.title}
                      </a>
                    </h4>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {issue.body}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {issue.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {issue.comments} comments
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {issue.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" asChild>
                      <a
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Issue
                      </a>
                    </Button>

                    {!session && (
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Learn More
                      </Button>
                    )}
                  </div>
                </div>

                {/* Issue Labels */}
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
                  {issue.labels
                    .filter((l) => l.name !== "good-first-issue")
                    .slice(0, 3)
                    .map((label) => (
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Star className="h-4 w-4 mr-2" />
            View All Good First Issues
          </Button>

          {!session && (
            <Button variant="outline" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Sign In to Get Started
            </Button>
          )}
        </div>

        {/* Encouragement Message */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              New to Open Source?
            </span>
          </div>
          <p className="text-sm text-blue-800">
            Don't worry! Everyone starts somewhere. These issues are designed to
            be approachable and the community is here to help you succeed. Take
            your time and don't hesitate to ask questions!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
