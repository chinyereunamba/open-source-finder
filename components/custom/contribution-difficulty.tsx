"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Clock,
  Users,
  BookOpen,
  Star,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Project } from "@/lib/github-api";

interface ContributionDifficultyProps {
  project: Project;
}

export default function ContributionDifficulty({
  project,
}: ContributionDifficultyProps) {
  // Calculate difficulty metrics
  const calculateDifficulty = () => {
    const stars = project.stargazers_count;
    const issues = project.open_issues_count;
    const forks = project.forks_count;

    // Complexity score (0-100)
    let complexityScore = 0;

    // Stars indicate popularity and potentially more complex codebase
    if (stars > 50000) complexityScore += 40;
    else if (stars > 10000) complexityScore += 30;
    else if (stars > 1000) complexityScore += 20;
    else complexityScore += 10;

    // High number of issues might indicate complexity or active development
    if (issues > 500) complexityScore += 30;
    else if (issues > 100) complexityScore += 20;
    else if (issues > 20) complexityScore += 10;
    else complexityScore += 5;

    // Forks indicate community engagement
    if (forks > 10000) complexityScore += 20;
    else if (forks > 1000) complexityScore += 15;
    else if (forks > 100) complexityScore += 10;
    else complexityScore += 5;

    // Language complexity (simplified)
    const complexLanguages = ["C++", "Rust", "Go", "Java", "C#"];
    const mediumLanguages = ["Python", "JavaScript", "TypeScript", "Ruby"];

    if (complexLanguages.includes(project.language)) complexityScore += 10;
    else if (mediumLanguages.includes(project.language)) complexityScore += 5;

    return Math.min(complexityScore, 100);
  };

  const complexityScore = calculateDifficulty();

  const getDifficultyLevel = () => {
    if (complexityScore >= 70)
      return {
        level: "Advanced",
        color: "destructive" as const,
        icon: AlertTriangle,
        description: "Requires significant experience and deep understanding",
      };
    if (complexityScore >= 40)
      return {
        level: "Intermediate",
        color: "default" as const,
        icon: Clock,
        description: "Some experience recommended, moderate complexity",
      };
    return {
      level: "Beginner",
      color: "secondary" as const,
      icon: CheckCircle2,
      description: "Great for newcomers and first-time contributors",
    };
  };

  const difficulty = getDifficultyLevel();
  const Icon = difficulty.icon;

  // Estimate time to contribute
  const getTimeEstimate = () => {
    if (complexityScore >= 70) return "1-2 weeks";
    if (complexityScore >= 40) return "2-5 days";
    return "Few hours";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Contribution Guide
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Difficulty Level */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Difficulty Level</span>
            <Badge
              variant={difficulty.color}
              className="flex items-center gap-1"
            >
              <Icon className="h-3 w-3" />
              {difficulty.level}
            </Badge>
          </div>

          <Progress value={complexityScore} className="h-2" />

          <p className="text-xs text-muted-foreground">
            {difficulty.description}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Clock className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <div className="text-sm font-medium">{getTimeEstimate()}</div>
            <div className="text-xs text-muted-foreground">Est. time</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-muted/30">
            <Users className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <div className="text-sm font-medium">
              {project.forks_count > 100 ? "High" : "Medium"}
            </div>
            <div className="text-xs text-muted-foreground">Community</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recommended Skills</h4>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {project.language}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Git
            </Badge>
            {difficulty.level === "Advanced" && (
              <>
                <Badge variant="outline" className="text-xs">
                  Architecture
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Testing
                </Badge>
              </>
            )}
            {difficulty.level === "Intermediate" && (
              <Badge variant="outline" className="text-xs">
                Debugging
              </Badge>
            )}
          </div>
        </div>

        {/* Good First Issues Indicator */}
        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Good First Issues Available
            </span>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300">
            This project has issues labeled for newcomers. Perfect for getting
            started!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
