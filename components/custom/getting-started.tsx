import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";

export default function GettingStarted({ project }: { project: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting Started</CardTitle>
        <CardDescription>How to contribute to this project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            Find an issue
          </h3>
          <p className="text-sm text-muted-foreground">
            Look for issues labeled "good-first-issue" or "help-wanted" to get
            started.
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
  );
}
