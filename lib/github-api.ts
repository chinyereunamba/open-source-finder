import { Octokit } from "@octokit/rest";

export interface Project {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  license?: {
    name: string;
    url: string;
  } | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at?: string;
  html_url: string;
  contributors_url?: string;
  issue_comment_url?: string;
  issues_url?: string;
  topics: string[];
}

interface Issue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  labels: {
    name: string;
    color: string;
  }[];
  comments: number;
  body: string;
}

export interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export async function fetchProjects(page = 1): Promise<Project[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await octokit.search.repos({
    q: "public stars:>500+",
    sort: "stars",
    order: "desc",
    per_page: 20,
    page: page,
  });
  if (!response) {
    throw new Error("Failed to fetch projects");
  }

  return response.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    full_name: item.full_name,
    description: item.description,
    language: item.language,
    stargazers_count: item.stargazers_count,
    forks_count: item.forks_count,
    open_issues_count: item.open_issues_count,
    updated_at: item.updated_at,
    created_at: item.created_at,
    html_url: item.html_url,
    topics: item.topics || [],
    contributors_url: item.contributors_url,
    issue_comment_url: item.issue_comment_url,
    license: item.license,
    issues_url: item.issues_url,
  }));
}

export async function fetchProject(projectId: number): Promise<Project | null> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await octokit.request(
      "GET /repositories/{repository_id}",
      {
        repository_id: projectId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching project issues:", error);
    return null;
  }
}

export async function fetchProjectReadme(projectId: number): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const response = await octokit.request(
      "GET /repositories/{repository_id}/readme",
      {
        repository_id: projectId,
      }
    );
    return response.data.content;
  } catch (error) {
    console.error("Error fetching project readme:", error);
    return "";
  }
}
export async function fetchProjectIssues(projectId: number): Promise<Issue[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const repoResponse = await octokit.request(
      "GET /repositories/{repository_id}",
      {
        repository_id: projectId,
      }
    );

    const [owner, repo] = repoResponse.data.full_name.split("/");

    // Then fetch issues for that repository
    const issuesResponse = await octokit.issues.listForRepo({
      owner,
      repo,
      state: "open",
      per_page: 5,
      sort: "created",
    });

    return issuesResponse.data.map((item: any) => ({
      id: item.id,
      number: item.number,
      title: item.title,
      html_url: item.html_url,
      created_at: item.created_at,
      updated_at: item.updated_at,
      labels: item.labels.map((label: any) => ({
        name: label.name,
        color: label.color,
      })),
      comments: item.comments,
      body: item.body || "",
    }));
  } catch (error) {
    console.error("Error fetching project issues:", error);
    return [];
  }
}

export async function fetchProjectContributors(
  projectId: number
): Promise<Contributor[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // First, get the repository details to extract owner and repo name
    const repoResponse = await octokit.request(
      "GET /repositories/{repository_id}",
      {
        repository_id: projectId,
      }
    );

    const [owner, repo] = repoResponse.data.full_name.split("/");

    // Then fetch contributors for that repository
    const contributorsResponse = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 10,
    });

    return contributorsResponse.data.map((item: any) => ({
      id: item.id,
      login: item.login,
      avatar_url: item.avatar_url,
      html_url: item.html_url,
      contributions: item.contributions,
    }));
  } catch (error) {
    console.error("Error fetching project contributors:", error);
    return [];
  }
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await octokit.search.repos({
    q: "stars:>1000+ topic:good-first-issue",
    sort: "stars",
    order: "desc",
    per_page: 6,
  });
  console.log("Trending:", response);
  if (!response.data) {
    throw new Error("Failed to fetch projects");
  }

  return response.data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    full_name: item.full_name,
    description: item.description,
    language: item.language,
    stargazers_count: item.stargazers_count,
    forks_count: item.forks_count,
    open_issues_count: item.open_issues_count,
    updated_at: item.updated_at,
    created_at: item.created_at,
    html_url: item.html_url,
    topics: item.topics || [],
  }));
}
