"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Github,
  Check,
  AlertCircle,
  Shield,
  Star,
  GitFork,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface SubmissionResult {
  success: boolean;
  submissionId: string;
  status: "approved" | "pending";
  verificationScore: number;
  message: string;
}

interface GitHubRepoData {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  license: { name: string } | null;
}

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [repoData, setRepoData] = useState<GitHubRepoData | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    repoUrl: "",
    description: "",
    reason: "",
    richDescription: "",
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

    // Auto-verify repository when URL is entered
    if (name === "repoUrl" && value.includes("github.com")) {
      verifyRepository(value);
    }
  };

  const handleRichTextChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      richDescription: value,
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

  const verifyRepository = async (url: string) => {
    const githubUrlRegex =
      /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/;
    const match = url.match(githubUrlRegex);

    if (!match) return;

    setIsVerifying(true);
    try {
      const [, owner, repo] = match;
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo.replace(/\.git$/, "")}`
      );

      if (response.ok) {
        const data = await response.json();
        setRepoData(data);
      } else {
        setRepoData(null);
        toast.error("Repository not found or not accessible");
      }
    } catch (error) {
      console.error("Repository verification error:", error);
      setRepoData(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        screenshots: screenshots.map((file) => file.name), // In real app, upload files first
      };

      const response = await fetch("/api/projects/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmissionResult(result);
        setIsSuccess(true);
        toast.success(result.message);
      } else {
        toast.error(result.error || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting your project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && submissionResult) {
    return (
      <div className="container px-4 py-8 md:px-6 max-w-2xl mx-auto">
        <Card
          className={`border-2 ${
            submissionResult.status === "approved"
              ? "border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
              : "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
          }`}
        >
          <CardHeader>
            <CardTitle
              className={`flex items-center ${
                submissionResult.status === "approved"
                  ? "text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {submissionResult.status === "approved" ? (
                <Check className="mr-2 h-6 w-6" />
              ) : (
                <Shield className="mr-2 h-6 w-6" />
              )}
              {submissionResult.status === "approved"
                ? "Project Approved!"
                : "Submission Received!"}
            </CardTitle>
            <CardDescription>{submissionResult.message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Submission ID</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {submissionResult.submissionId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Verification Score</p>
                <p className="text-sm text-muted-foreground">
                  {submissionResult.verificationScore}/100
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Repository Details</p>
              <p className="text-sm text-muted-foreground">
                {formData.repoUrl}
              </p>
              {repoData && (
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {repoData.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {repoData.forks_count}
                  </span>
                  <span>{repoData.language}</span>
                </div>
              )}
            </div>

            {submissionResult.status === "pending" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Manual Review Required
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Your project will be reviewed by our team within 24-48
                      hours. You'll receive an email notification once it's
                      processed.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/projects">Browse Projects</Link>
              </Button>
            </div>
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

                {/* Repository Verification Status */}
                {isVerifying && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    Verifying repository...
                  </div>
                )}

                {repoData && (
                  <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Repository Verified
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {repoData.full_name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-green-600 dark:text-green-400">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {repoData.stargazers_count} stars
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            {repoData.forks_count} forks
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Updated{" "}
                            {new Date(repoData.updated_at).toLocaleDateString()}
                          </span>
                          {repoData.language && (
                            <span>{repoData.language}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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

              <div className="space-y-2">
                <Label htmlFor="richDescription">
                  Detailed Project Description
                </Label>
                <RichTextEditor
                  value={formData.richDescription}
                  onChange={handleRichTextChange}
                  placeholder="Provide a detailed description of the project, its goals, and how contributors can get involved. You can use rich formatting to make it more engaging."
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  Use rich text formatting to create an engaging project
                  description. This will be displayed on the project page.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Project Screenshots & Media</Label>
                <FileUpload
                  onFilesChange={setScreenshots}
                  accept="image/*"
                  multiple={true}
                  maxFiles={5}
                  maxSize={10}
                />
                <p className="text-xs text-muted-foreground">
                  Upload screenshots, logos, or other visual content to showcase
                  your project. Maximum 5 files, 10MB each.
                </p>
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
