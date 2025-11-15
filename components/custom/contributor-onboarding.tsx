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
import { Progress } from "@/components/ui/progress";
import { useState as useCollapsibleState } from "react";
import {
  CheckCircle2,
  Circle,
  BookOpen,
  GitFork,
  Code,
  GitPullRequest,
  Star,
  Users,
  Zap,
  ExternalLink,
  Play,
  FileText,
  Terminal,
  Award,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { Project } from "@/lib/github-api";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  optional: boolean;
  estimatedTime: string;
  resources: {
    title: string;
    url: string;
    type: "guide" | "video" | "documentation" | "tool";
  }[];
  checklist: string[];
}

interface ContributorOnboardingProps {
  project: Project;
  isGoodFirstIssue?: boolean;
}

export default function ContributorOnboarding({
  project,
  isGoodFirstIssue = false,
}: ContributorOnboardingProps) {
  const { data: session } = useSession();
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Initialize onboarding steps based on project and user experience
    const initializeSteps = () => {
      const baseSteps: OnboardingStep[] = [
        {
          id: "understand-project",
          title: "Understand the Project",
          description:
            "Get familiar with the project's purpose, architecture, and contribution guidelines",
          icon: <BookOpen className="h-5 w-5" />,
          completed: false,
          optional: false,
          estimatedTime: "15-30 min",
          resources: [
            {
              title: "Project README",
              url: `${project.html_url}#readme`,
              type: "documentation",
            },
            {
              title: "Contributing Guidelines",
              url: `${project.html_url}/blob/main/CONTRIBUTING.md`,
              type: "guide",
            },
            {
              title: "Code of Conduct",
              url: `${project.html_url}/blob/main/CODE_OF_CONDUCT.md`,
              type: "guide",
            },
          ],
          checklist: [
            "Read the project README thoroughly",
            "Understand the project's main purpose and goals",
            "Review the contributing guidelines",
            "Familiarize yourself with the code of conduct",
            "Check the project's license",
          ],
        },
        {
          id: "setup-environment",
          title: "Set Up Development Environment",
          description:
            "Fork the repository and set up your local development environment",
          icon: <Terminal className="h-5 w-5" />,
          completed: false,
          optional: false,
          estimatedTime: "20-45 min",
          resources: [
            {
              title: "Git Basics Tutorial",
              url: "https://git-scm.com/docs/gittutorial",
              type: "guide",
            },
            {
              title: "GitHub Fork Guide",
              url: "https://docs.github.com/en/get-started/quickstart/fork-a-repo",
              type: "guide",
            },
            {
              title: "Project Setup Instructions",
              url: `${project.html_url}#installation`,
              type: "documentation",
            },
          ],
          checklist: [
            "Fork the repository to your GitHub account",
            "Clone your fork to your local machine",
            "Install required dependencies",
            "Run the project locally to ensure it works",
            "Create a new branch for your contribution",
          ],
        },
        {
          id: "find-issue",
          title: "Find an Issue to Work On",
          description:
            "Choose an appropriate issue that matches your skill level and interests",
          icon: <Star className="h-5 w-5" />,
          completed: false,
          optional: false,
          estimatedTime: "10-20 min",
          resources: [
            {
              title: "Good First Issues",
              url: `${project.html_url}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
              type: "tool",
            },
            {
              title: "Help Wanted Issues",
              url: `${project.html_url}/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22`,
              type: "tool",
            },
          ],
          checklist: [
            "Browse available issues",
            "Look for 'good first issue' or 'help wanted' labels",
            "Read issue descriptions carefully",
            "Check if the issue is already assigned",
            "Comment on the issue to express interest",
          ],
        },
        {
          id: "make-changes",
          title: "Make Your Changes",
          description:
            "Implement your solution following the project's coding standards",
          icon: <Code className="h-5 w-5" />,
          completed: false,
          optional: false,
          estimatedTime: "1-4 hours",
          resources: [
            {
              title: "Coding Style Guide",
              url: `${project.html_url}/blob/main/STYLE_GUIDE.md`,
              type: "guide",
            },
            {
              title: "Testing Guidelines",
              url: `${project.html_url}/blob/main/TESTING.md`,
              type: "guide",
            },
          ],
          checklist: [
            "Follow the project's coding style and conventions",
            "Write clean, readable code with proper comments",
            "Add or update tests if necessary",
            "Test your changes thoroughly",
            "Commit your changes with descriptive messages",
          ],
        },
        {
          id: "submit-pr",
          title: "Submit Pull Request",
          description:
            "Create a pull request with your changes and engage with reviewers",
          icon: <GitPullRequest className="h-5 w-5" />,
          completed: false,
          optional: false,
          estimatedTime: "15-30 min",
          resources: [
            {
              title: "Creating a Pull Request",
              url: "https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request",
              type: "guide",
            },
            {
              title: "PR Template",
              url: `${project.html_url}/blob/main/.github/pull_request_template.md`,
              type: "documentation",
            },
          ],
          checklist: [
            "Push your changes to your fork",
            "Create a pull request with a clear title and description",
            "Link the related issue in your PR description",
            "Respond to reviewer feedback promptly",
            "Make requested changes if needed",
          ],
        },
        {
          id: "engage-community",
          title: "Engage with the Community",
          description:
            "Connect with other contributors and continue your open source journey",
          icon: <Users className="h-5 w-5" />,
          completed: false,
          optional: true,
          estimatedTime: "Ongoing",
          resources: [
            {
              title: "Project Discussions",
              url: `${project.html_url}/discussions`,
              type: "tool",
            },
            {
              title: "Community Chat",
              url: "#",
              type: "tool",
            },
          ],
          checklist: [
            "Join project discussions and community channels",
            "Help other newcomers with their questions",
            "Share your contribution experience",
            "Look for more issues to work on",
            "Consider becoming a regular contributor",
          ],
        },
      ];

      setSteps(baseSteps);

      // Load completed steps from localStorage
      const saved = localStorage.getItem(`onboarding-${project.id}`);
      if (saved) {
        setCompletedSteps(new Set(JSON.parse(saved)));
      }
    };

    initializeSteps();
  }, [project]);

  const toggleStepCompletion = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);

    // Save to localStorage
    localStorage.setItem(
      `onboarding-${project.id}`,
      JSON.stringify([...newCompleted])
    );
  };

  const getProgress = () => {
    const requiredSteps = steps.filter((step) => !step.optional);
    const completedRequired = requiredSteps.filter((step) =>
      completedSteps.has(step.id)
    );
    return (completedRequired.length / requiredSteps.length) * 100;
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "guide":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Play className="h-4 w-4" />;
      case "documentation":
        return <FileText className="h-4 w-4" />;
      case "tool":
        return <Zap className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          Contributor Onboarding
          {isGoodFirstIssue && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Beginner Friendly
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Step-by-step guide to making your first contribution to {project.name}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(getProgress())}% complete
            </span>
          </div>
          <Progress value={getProgress()} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedSteps.size} of {steps.filter((s) => !s.optional).length}{" "}
            required steps completed
          </p>
        </div>

        {/* Quick Start for Good First Issues */}
        {isGoodFirstIssue && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-900">
                New to Open Source?
              </h4>
            </div>
            <p className="text-sm text-green-800 mb-3">
              This issue is perfect for beginners! Follow our step-by-step guide
              below to make your first contribution.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-1" />
                Start Tutorial
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                Get Help
              </Button>
            </div>
          </div>
        )}

        {/* Onboarding Steps */}
        <Accordion type="single" collapsible className="w-full">
          {steps.map((step, index) => (
            <AccordionItem key={step.id} value={step.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompletion(step.id);
                    }}
                  >
                    {completedSteps.has(step.id) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>

                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className="font-medium">
                      {index + 1}. {step.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {step.optional && (
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {step.estimatedTime}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-4">
                <div className="space-y-4 ml-8">
                  <p className="text-muted-foreground">{step.description}</p>

                  {/* Checklist */}
                  <div>
                    <h5 className="font-medium mb-2">Checklist:</h5>
                    <ul className="space-y-1">
                      {step.checklist.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Circle className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  {step.resources.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Helpful Resources:</h5>
                      <div className="space-y-2">
                        {step.resources.map((resource, idx) => (
                          <a
                            key={idx}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {getResourceIcon(resource.type)}
                            {resource.title}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    size="sm"
                    variant={
                      completedSteps.has(step.id) ? "outline" : "default"
                    }
                    onClick={() => toggleStepCompletion(step.id)}
                  >
                    {completedSteps.has(step.id) ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 mr-1" />
                        Mark as Complete
                      </>
                    )}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Completion Celebration */}
        {getProgress() === 100 && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg text-center">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-green-900 mb-1">
              Congratulations! 🎉
            </h4>
            <p className="text-sm text-green-800 mb-3">
              You've completed the onboarding process. You're ready to make
              meaningful contributions!
            </p>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Star className="h-4 w-4 mr-1" />
              Find More Issues
            </Button>
          </div>
        )}

        {/* Need Help Section */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Need Help?
          </h4>
          <p className="text-sm text-muted-foreground mb-3">
            Don't hesitate to ask questions! The community is here to help you
            succeed.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4 mr-1" />
              Find a Mentor
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4 mr-1" />
              Ask in Discussions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
