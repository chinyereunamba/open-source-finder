// This is a mock API service for demo purposes
// In a real application, you would use the GitHub API

interface Project {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  html_url: string;
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

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

// Mock data - in a real app, this would come from the GitHub API
export async function fetchFeaturedProjects(): Promise<Project[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In a real app, you would fetch from GitHub API
  // Example: const response = await fetch('https://api.github.com/search/repositories?q=topic:good-first-issue&sort=stars&order=desc')

  return []; // Empty array to trigger the demo data in the component
}

export async function fetchProjects(): Promise<Project[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return []; // Empty array to trigger the demo data in the component
}

export async function fetchProjectIssues(projectId: number): Promise<Issue[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return []; // Empty array to trigger the demo data in the component
}

export async function fetchProjectContributors(
  projectId: number
): Promise<Contributor[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return []; // Empty array to trigger the demo data in the component
}

// In a real app, you would implement these functions to call the GitHub API
// Example:
/*
export async function fetchFeaturedProjects(): Promise<Project[]> {
  const response = await fetch(
    'https://api.github.com/search/repositories?q=topic:good-first-issue&sort=stars&order=desc&per_page=6',
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        // Add your GitHub token if needed
        // Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    }
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }
  
  const data = await response.json()
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
    topics: item.topics || []
  }))
}
*/
