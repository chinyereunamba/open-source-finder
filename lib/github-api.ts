// This is a mock API service for demo purposes
// In a real application, you would use the GitHub API

export interface Project {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  license: {
    name: string;
    url: string;
  } | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  html_url: string;
  contributors_url: string;
  issue_comment_url: string;
  issues_url: string;
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

export async function fetchProjects(): Promise<Project[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await fetch(
    "https://api.github.com/search/repositories?q=stars:>100+is:public&order=desc&per_page=20",
    {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.github.v3+json, application/vnd.github.mercy-preview+json",
        Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
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

export async function fetchProjectIssues(issueUrl: string): Promise<Issue[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const issues = await fetch(`${issueUrl}`, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  });
  if (!issues.ok) {
    throw new Error("Failed to fetch issues");
  }
  const data = await issues.json();
  return data.items.map((item: any) => ({
    id: item.id,
    number: item.number,
    title: item.title,
    html_url: item.html_url,
    created_at: item.created_at,
    updated_at: item.updated_at,
    labels: item.labels,
    comments: item.comments,
    body: item.body,
  }));
}

export async function fetchProjectContributors(
  url: string
): Promise<Contributor[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const contributorsRes = await fetch(`${url}`, {
    headers: {
      Accept:
        "application/vnd.github.v3+json, application/vnd.github.mercy-preview+json",
      Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
  });
  if (!contributorsRes.ok) {
    throw new Error("Failed to fetch contributors");
  }
  const data = await contributorsRes.json();
  return data.map((item: any) => ({
    id: item.id,
    login: item.login,
    avatar_url: item.avatar_url,
    html_url: item.html_url,
    contributions: item.contributions,
  }));
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
  const response = await fetch(
    "https://api.github.com/search/repositories?q=stars:>100+is:public&order=desc&per_page=6",
    {
      method: "GET",
      headers: {
        Accept:
          "application/vnd.github.v3+json, application/vnd.github.mercy-preview+json",
        Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    full_name: item.full_name,
    description: item.description,
    language: item.language,
    stargazers_count: item.stargazers_count,
    forks_count: item.forks_count,
    open_issues_count: item.open_issues_count,
    updated_at: item.updated_at,
    html_url: item.html_url,
    topics: item.topics || [],
  }));
}
