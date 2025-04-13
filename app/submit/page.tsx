"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Github, Check } from "lucide-react";
import { toast } from "sonner";

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    repoUrl: "",
    description: "",
    reason: "",
    tags: {
      goodFirstIssue: false,
      helpWanted: false,
      documentation: false,
      bugFixes: false,
      features: false,
      uiImprovements: false,
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tags: {
        ...prev.tags,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast(
        // title: "Project submitted successfully!",
        // description: "Thank you for contributing to the open source community.",
        "Thank you for contributing to the open source community."
      );
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="container px-4 py-8 md:px-6 max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600 dark:text-green-400">
              <Check className="mr-2 h-6 w-6" />
              Submission Successful!
            </CardTitle>
            <CardDescription>
              Thank you for contributing to the open source community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your project has been submitted for review. Our team will review
              it and add it to the platform if it meets our criteria.
            </p>
            <p className="text-sm text-muted-foreground">
              Repository URL: {formData.repoUrl}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/projects">Browse Projects</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:px-6 max-w-2xl mx-auto">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Submit a Project
          </h1>
          <p className="text-muted-foreground mt-2">
            Know a great open source project that needs contributors? Submit it
            to our platform.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                Please provide information about the open source project you
                want to submit.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="repoUrl">
                  GitHub Repository URL <span className="text-red-500">*</span>
                </Label>
                <div className="flex">
                  <div className="flex items-center px-3 border rounded-l-md bg-muted">
                    <Github className="h-4 w-4" />
                  </div>
                  <Input
                    id="repoUrl"
                    name="repoUrl"
                    placeholder="https://github.com/username/repository"
                    className="rounded-l-none"
                    value={formData.repoUrl}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the full URL to the GitHub repository
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Project Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="A brief description of what the project does and its purpose"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Why is this project good for contributors?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Explain why this project is good for new or experienced contributors"
                  rows={3}
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Project Tags</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="goodFirstIssue"
                      checked={formData.tags.goodFirstIssue}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "goodFirstIssue",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="goodFirstIssue"
                      className="text-sm font-normal"
                    >
                      Good First Issues
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="helpWanted"
                      checked={formData.tags.helpWanted}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("helpWanted", checked as boolean)
                      }
                    />
                    <Label htmlFor="helpWanted" className="text-sm font-normal">
                      Help Wanted
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="documentation"
                      checked={formData.tags.documentation}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "documentation",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="documentation"
                      className="text-sm font-normal"
                    >
                      Documentation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bugFixes"
                      checked={formData.tags.bugFixes}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("bugFixes", checked as boolean)
                      }
                    />
                    <Label htmlFor="bugFixes" className="text-sm font-normal">
                      Bug Fixes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="features"
                      checked={formData.tags.features}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", checked as boolean)
                      }
                    />
                    <Label htmlFor="features" className="text-sm font-normal">
                      New Features
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="uiImprovements"
                      checked={formData.tags.uiImprovements}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "uiImprovements",
                          checked as boolean
                        )
                      }
                    />
                    <Label
                      htmlFor="uiImprovements"
                      className="text-sm font-normal"
                    >
                      UI Improvements
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" asChild>
                <Link href="/projects">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
