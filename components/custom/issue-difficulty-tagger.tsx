"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Star,
  Target,
  Zap,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Issue } from "@/lib/github-api";

interface DifficultyTag {
  level: "beginner" | "intermediate" | "advanced";
  confidence: number;
  votes: number;
  reasons: string[];
  suggestedBy: string;
  timestamp: Date;
}

interface IssueDifficultyTaggerProps {
  issue: Issue;
  onDifficultyUpdate?: (
    issueId: number,
    difficulty: "beginner" | "intermediate" | "advanced"
  ) => void;
}

export default function IssueDifficultyTagger({
  issue,
  onDifficultyUpdate,
}: IssueDifficultyTaggerProps) {
  const { data: session } = useSession();
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "beginner" | "intermediate" | "advanced"
  >("intermediate");
  const [reasoning, setReasoning] = useState("");
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);

  // Mock difficulty tags data - in a real app, this would come from an API
  const [difficultyTags] = useState<DifficultyTag[]>([
    {
      level: "beginner",
      confidence: 85,
      votes: 12,
      reasons: [
        "Well-documented",
        "Clear requirements",
        "Good first issue label",
      ],
      suggestedBy: "community",
      timestamp: new Date("2023-03-20"),
    },
    {
      level: "intermediate",
      confidence: 60,
      votes: 5,
      reasons: ["Requires some React knowledge", "Multiple files to modify"],
      suggestedBy: "maintainer",
      timestamp: new Date("2023-03-18"),
    },
  ]);

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
        return <Star className="h-4 w-4" />;
      case "intermediate":
        return <Target className="h-4 w-4" />;
      case "advanced":
        return <Zap className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getEstimatedTime = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "1-2 hours";
      case "intermediate":
        return "2-6 hours";
      case "advanced":
        return "1-3 days";
      default:
        return "Unknown";
    }
  };

  const getSkillRequirements = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return [
          "Basic Git knowledge",
          "Familiarity with the language",
          "Willingness to learn",
        ];
      case "intermediate":
        return [
          "Solid programming experience",
          "Understanding of project architecture",
          "Testing knowledge",
        ];
      case "advanced":
        return [
          "Expert-level skills",
          "Deep system knowledge",
          "Complex problem-solving",
        ];
      default:
        return [];
    }
  };

  const handleSubmitDifficulty = () => {
    if (!session || !reasoning.trim()) return;

    // In a real app, this would submit to an API
    console.log("Submitting difficulty tag:", {
      issueId: issue.id,
      difficulty: selectedDifficulty,
      reasoning: reasoning.trim(),
      userId: session.user?.email,
    });

    // Call the callback if provided
    if (onDifficultyUpdate) {
      onDifficultyUpdate(issue.id, selectedDifficulty);
    }

    // Reset form
    setReasoning("");
    setShowTagDialog(false);

    // Show success message (in a real app, use toast)
    alert(
      "Thank you for your difficulty assessment! It helps other contributors."
    );
  };

  const handleVote = (vote: "up" | "down") => {
    if (!session) return;

    setUserVote(userVote === vote ? null : vote);

    // In a real app, this would submit the vote to an API
    console.log("Voting on difficulty:", vote, "for issue:", issue.id);
  };

  // Get the most voted difficulty
  const topDifficulty = difficultyTags.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            Difficulty Assessment
          </div>

          {session && (
            <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Target className="h-4 w-4 mr-1" />
                  Suggest Difficulty
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Suggest Difficulty Level</DialogTitle>
                  <DialogDescription>
                    Help other contributors by assessing this issue's difficulty
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Difficulty Level:
                    </label>
                    <Select
                      value={selectedDifficulty}
                      onValueChange={(value: any) =>
                        setSelectedDifficulty(value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-green-600" />
                            Beginner (1-2 hours)
                          </div>
                        </SelectItem>
                        <SelectItem value="intermediate">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-yellow-600" />
                            Intermediate (2-6 hours)
                          </div>
                        </SelectItem>
                        <SelectItem value="advanced">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-red-600" />
                            Advanced (1-3 days)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Reasoning (required):
                    </label>
                    <textarea
                      className="mt-1 w-full p-2 border rounded-md resize-none"
                      placeholder="Explain why you think this issue has this difficulty level..."
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowTagDialog(false);
                        setReasoning("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitDifficulty}
                      disabled={!reasoning.trim()}
                    >
                      Submit Assessment
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
        <CardDescription>
          Community-driven difficulty assessment to help you choose the right
          issues
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Difficulty Assessment */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Badge
              className={`${getDifficultyColor(
                topDifficulty.level
              )} flex items-center gap-1`}
            >
              {getDifficultyIcon(topDifficulty.level)}
              {topDifficulty.level.charAt(0).toUpperCase() +
                topDifficulty.level.slice(1)}
            </Badge>
            <div className="text-sm">
              <div className="font-medium">
                Estimated Time: {getEstimatedTime(topDifficulty.level)}
              </div>
              <div className="text-muted-foreground">
                {topDifficulty.confidence}% confidence • {topDifficulty.votes}{" "}
                votes
              </div>
            </div>
          </div>

          {session && (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={userVote === "up" ? "default" : "outline"}
                onClick={() => handleVote("up")}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={userVote === "down" ? "default" : "outline"}
                onClick={() => handleVote("down")}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Skill Requirements */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {getSkillRequirements(topDifficulty.level).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Assessment History */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            Community Assessments
          </h4>
          <div className="space-y-2">
            {difficultyTags.map((tag, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-2 bg-muted/30 rounded text-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      className={`${getDifficultyColor(tag.level)} text-xs`}
                    >
                      {getDifficultyIcon(tag.level)}
                      {tag.level}
                    </Badge>
                    <span className="text-muted-foreground">
                      by {tag.suggestedBy} • {tag.votes} votes
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    {tag.reasons.join(", ")}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {tag.timestamp.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Text for Non-authenticated Users */}
        {!session && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Join the Assessment
              </span>
            </div>
            <p className="text-sm text-blue-800">
              Sign in to vote on difficulty assessments and help other
              contributors find issues that match their skill level.
            </p>
          </div>
        )}

        {/* Difficulty Guidelines */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <h5 className="font-medium mb-2 text-sm">Difficulty Guidelines:</h5>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-green-600" />
              <span>
                <strong>Beginner:</strong> Clear requirements, good
                documentation, minimal complexity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-yellow-600" />
              <span>
                <strong>Intermediate:</strong> Some domain knowledge required,
                moderate complexity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-red-600" />
              <span>
                <strong>Advanced:</strong> Deep expertise needed, high
                complexity, architectural changes
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
