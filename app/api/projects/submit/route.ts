import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

interface ProjectSubmission {
  repoUrl: string;
  description: string;
  reason: string;
  tags: Record<string, boolean>;
  richDescription?: string;
  screenshots?: string[];
  submitterEmail?: string;
}

interface GitHubRepoData {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  open_issues_count: number;
  license: {
    name: string;
    spdx_id: string;
  } | null;
  default_branch: string;
  has_issues: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  archived: boolean;
  disabled: boolean;
  private: boolean;
}

// Simulate a database for now
const submittedProjects: Array<
  ProjectSubmission & {
    id: string;
    status: "pending" | "approved" | "rejected";
    submittedAt: string;
    githubData?: GitHubRepoData;
    verificationScore?: number;
  }
> = [];

export async function POST(request: NextRequest) {
  try {
    const body: ProjectSubmission = await request.json();

    // Validate required fields
    if (!body.repoUrl || !body.description || !body.reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    const githubUrlRegex =
      /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/;
    const match = body.repoUrl.match(githubUrlRegex);

    if (!match) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    // Verify repository exists and get data
    let githubData: GitHubRepoData | null = null;
    let verificationScore = 0;

    try {
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
      });

      const { data } = await octokit.rest.repos.get({
        owner,
        repo: repo.replace(/\.git$/, ""), // Remove .git suffix if present
      });

      githubData = data as GitHubRepoData;

      // Calculate verification score based on repository health
      verificationScore = calculateVerificationScore(githubData);
    } catch (error) {
      console.error("GitHub API error:", error);
      return NextResponse.json(
        { error: "Repository not found or not accessible" },
        { status: 404 }
      );
    }

    // Create submission record
    const submission = {
      ...body,
      id: Math.random().toString(36).substr(2, 9),
      status: (verificationScore >= 60 ? "approved" : "pending") as
        | "approved"
        | "pending"
        | "rejected",
      submittedAt: new Date().toISOString(),
      githubData,
      verificationScore,
    };

    submittedProjects.push(submission);

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      status: submission.status,
      verificationScore,
      message:
        submission.status === "approved"
          ? "Project approved and added to the platform!"
          : "Project submitted for review. Our team will review it shortly.",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get("id");

  if (submissionId) {
    const submission = submittedProjects.find((p) => p.id === submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(submission);
  }

  // Return all submissions (in a real app, this would be paginated and filtered by user)
  return NextResponse.json({
    submissions: submittedProjects,
    total: submittedProjects.length,
  });
}

function calculateVerificationScore(repoData: GitHubRepoData): number {
  let score = 0;

  // Basic repository health checks
  if (repoData.description && repoData.description.length > 10) score += 15;
  if (repoData.license) score += 15;
  if (repoData.stargazers_count > 0) score += 10;
  if (repoData.stargazers_count > 10) score += 10;
  if (repoData.stargazers_count > 100) score += 10;

  // Activity indicators
  const lastUpdate = new Date(repoData.pushed_at);
  const daysSinceUpdate =
    (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 15;
  else if (daysSinceUpdate < 90) score += 10;
  else if (daysSinceUpdate < 365) score += 5;

  // Community features
  if (repoData.has_issues) score += 5;
  if (repoData.has_wiki) score += 5;
  if (repoData.topics && repoData.topics.length > 0) score += 5;

  // Negative indicators
  if (repoData.archived) score -= 20;
  if (repoData.disabled) score -= 30;
  if (repoData.private) score -= 50;

  return Math.max(0, Math.min(100, score));
}
