import React from "react";
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
import ProjectContributors from "../custom/contributors";
import ProjectIssues from "../custom/issues";
import GettingStarted from "./getting-started";
import SimilarProjects from "../custom/similar-projects";
import { Contributor, Project } from "@/lib/github-api";

export default function ProjectDetail({ project }: { project: Project }) {
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
                    {/* {formatNumber(project.contributors_count)} contributors */}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <span>{project.license?.name || ""}</span>
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
                <ProjectIssues issueUrl={project.issues_url} />
              </TabsContent>
              <TabsContent value="contributors" className="mt-4">
                <ProjectContributors url={project.contributors_url} />
              </TabsContent>
              <TabsContent value="readme" className="mt-4 space-y-4">
                <h3 className="text-lg font-medium">ReadMe</h3>

                <Card>
                  <CardContent
                  //   className="pt-6"
                  >
                    {/* <div className="prose max-w-none dark:prose-invert">
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
                    </div> */}
                    <p>Coming soon</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <GettingStarted project={project} />

            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {new Date(project?.created_at || "").toLocaleDateString()}
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
                {/* <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Contributors
                  </span>
                  <span className="text-sm">
                    {formatNumber(project.contributors_count)} 
                  </span>
                </div> */}
              </CardContent>
            </Card>

            <SimilarProjects />
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
