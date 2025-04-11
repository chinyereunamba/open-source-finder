import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  GitFork,
  Clock,
  ExternalLink,
  MessageSquare,
  Users,
  Tag,
  CheckCircle2,
} from "lucide-react";
import ProjectIssues from "@/components/custom/issues";
import ProjectContributors from "@/components/custom/contributors";

export default function ProjectPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the project data based on the ID
  // For demo purposes, we'll use placeholder data
  const project = {
    id: Number.parseInt(params.id),
    name: "react",
    full_name: "facebook/react",
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    language: "JavaScript",
    stargazers_count: 198000,
    forks_count: 41000,
    open_issues_count: 1100,
    updated_at: "2023-04-01T12:00:00Z",
    html_url: "https://github.com/facebook/react",
    topics: [
      "javascript",
      "ui",
      "frontend",
      "good-first-issue",
      "help-wanted",
      "beginner-friendly",
      "documentation",
    ],
    readme:
      "# React\n\nReact is a JavaScript library for building user interfaces.\n\n* **Declarative:** React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable, simpler to understand, and easier to debug.\n* **Component-Based:** Build encapsulated components that manage their own state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM.\n* **Learn Once, Write Anywhere:** We don't make assumptions about the rest of your technology stack, so you can develop new features in React without rewriting existing code. React can also render on the server using Node and power mobile apps using React Native.",
    contributors_count: 1500,
    license: "MIT",
    created_at: "2013-05-24T16:15:54Z",
  };

  return (
    <div className="container px-4 py-8 md:px-6 mx-auto">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to projects
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {project.full_name}
              </h1>
              <p className="text-muted-foreground mt-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                {project.topics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center gap-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span>{project.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{formatNumber(project.stargazers_count)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{formatNumber(project.forks_count)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{formatNumber(project.open_issues_count)} issues</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {formatNumber(project.contributors_count)} contributors
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{project.license}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {formatDate(project.updated_at)}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button asChild>
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline">Save Project</Button>
              </div>
            </div>

            <Tabs defaultValue="issues">
              <TabsList>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="contributors">Contributors</TabsTrigger>
                <TabsTrigger value="readme">README</TabsTrigger>
              </TabsList>
              <TabsContent value="issues" className="mt-4">
                <ProjectIssues projectId={project.id} />
              </TabsContent>
              <TabsContent value="contributors" className="mt-4">
                <ProjectContributors projectId={project.id} />
              </TabsContent>
              <TabsContent value="readme" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none dark:prose-invert">
                      {project.readme.split("\n").map((line, index) => {
                        if (line.startsWith("# ")) {
                          return (
                            <h1 key={index} className="text-2xl font-bold mt-4">
                              {line.substring(2)}
                            </h1>
                          );
                        } else if (line.startsWith("## ")) {
                          return (
                            <h2 key={index} className="text-xl font-bold mt-4">
                              {line.substring(3)}
                            </h2>
                          );
                        } else if (line.startsWith("* ")) {
                          return (
                            <li key={index} className="ml-6 mt-2">
                              {line.substring(2)}
                            </li>
                          );
                        } else if (line === "") {
                          return <br key={index} />;
                        } else {
                          return (
                            <p key={index} className="mt-2">
                              {line}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  How to contribute to this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Find an issue
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Look for issues labeled "good-first-issue" or "help-wanted"
                    to get started.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Fork the repository
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create your own fork of the project to work on.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Make your changes
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Implement your fix or feature in your forked repository.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Submit a pull request
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Open a PR to the main repository with your changes.
                  </p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={`${project.html_url}/blob/main/CONTRIBUTING.md`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Contributing Guidelines
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="text-sm">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Open Issues
                  </span>
                  <span className="text-sm">
                    {formatNumber(project.open_issues_count)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stars</span>
                  <span className="text-sm">
                    {formatNumber(project.stargazers_count)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Forks</span>
                  <span className="text-sm">
                    {formatNumber(project.forks_count)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Contributors
                  </span>
                  <span className="text-sm">
                    {formatNumber(project.contributors_count)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Similar Projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Link
                    href="/projects/3"
                    className="font-medium hover:underline"
                  >
                    microsoft/vscode
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Visual Studio Code
                  </p>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/projects/8"
                    className="font-medium hover:underline"
                  >
                    vercel/next.js
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    The React Framework for Production
                  </p>
                </div>
                <div className="space-y-2">
                  <Link
                    href="/projects/4"
                    className="font-medium hover:underline"
                  >
                    flutter/flutter
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Flutter makes it easy and fast to build beautiful apps for
                    mobile and beyond
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
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
