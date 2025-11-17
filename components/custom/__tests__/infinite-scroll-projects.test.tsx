import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import InfiniteScrollProjects from "../infinite-scroll-projects";
import * as githubApi from "@/lib/github-api";

// Mock the GitHub API
vi.mock("@/lib/github-api", () => ({
  fetchProjects: vi.fn(),
}));

// Mock the hooks
vi.mock("@/hooks/use-optimistic-bookmark", () => ({
  useOptimisticBookmark: () => ({
    bookmarkedProjects: new Set(),
    toggleBookmark: vi.fn(),
  }),
}));

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(private callback: IntersectionObserverCallback) {}
  observe() {
    // Simulate intersection after a short delay
    setTimeout(() => {
      this.callback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        this as any
      );
    }, 100);
  }
  unobserve() {}
  disconnect() {}
}

describe("InfiniteScrollProjects", () => {
  const mockProjects = [
    {
      id: 1,
      name: "test-project-1",
      full_name: "user/test-project-1",
      description: "Test project 1",
      language: "TypeScript",
      stargazers_count: 100,
      forks_count: 10,
      open_issues_count: 5,
      updated_at: "2024-01-01",
      html_url: "https://github.com/user/test-project-1",
      topics: ["test"],
    },
    {
      id: 2,
      name: "test-project-2",
      full_name: "user/test-project-2",
      description: "Test project 2",
      language: "JavaScript",
      stargazers_count: 200,
      forks_count: 20,
      open_issues_count: 10,
      updated_at: "2024-01-02",
      html_url: "https://github.com/user/test-project-2",
      topics: ["test"],
    },
  ];

  beforeEach(() => {
    // Setup IntersectionObserver mock
    global.IntersectionObserver = MockIntersectionObserver as any;

    // Reset mocks
    vi.clearAllMocks();

    // Setup default mock implementation
    vi.mocked(githubApi.fetchProjects).mockResolvedValue(mockProjects);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders loading state initially", () => {
    render(<InfiniteScrollProjects />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("loads and displays initial projects", async () => {
    render(<InfiniteScrollProjects />);

    await waitFor(() => {
      expect(screen.getByText("test-project-1")).toBeInTheDocument();
      expect(screen.getByText("test-project-2")).toBeInTheDocument();
    });

    expect(githubApi.fetchProjects).toHaveBeenCalledWith(1, "", "All", []);
  });

  it("displays project count", async () => {
    render(<InfiniteScrollProjects />);

    await waitFor(() => {
      expect(screen.getByText("2 projects loaded")).toBeInTheDocument();
    });
  });

  it("applies search filter", async () => {
    render(<InfiniteScrollProjects search="react" />);

    await waitFor(() => {
      expect(githubApi.fetchProjects).toHaveBeenCalledWith(
        1,
        "react",
        "All",
        []
      );
    });
  });

  it("applies language filter", async () => {
    render(<InfiniteScrollProjects language="TypeScript" />);

    await waitFor(() => {
      expect(githubApi.fetchProjects).toHaveBeenCalledWith(
        1,
        "",
        "TypeScript",
        []
      );
    });
  });

  it("applies topics filter", async () => {
    render(<InfiniteScrollProjects topics={["react", "typescript"]} />);

    await waitFor(() => {
      expect(githubApi.fetchProjects).toHaveBeenCalledWith(1, "", "All", [
        "react",
        "typescript",
      ]);
    });
  });

  it("shows error state when fetch fails", async () => {
    vi.mocked(githubApi.fetchProjects).mockRejectedValue(
      new Error("API Error")
    );

    render(<InfiniteScrollProjects />);

    await waitFor(() => {
      expect(screen.getByText("Failed to load projects")).toBeInTheDocument();
    });
  });

  it("shows no results message when no projects found", async () => {
    vi.mocked(githubApi.fetchProjects).mockResolvedValue([]);

    render(<InfiniteScrollProjects />);

    await waitFor(() => {
      expect(screen.getByText("No projects found")).toBeInTheDocument();
    });
  });

  it("reloads projects when filters change", async () => {
    const { rerender } = render(<InfiniteScrollProjects search="react" />);

    await waitFor(() => {
      expect(githubApi.fetchProjects).toHaveBeenCalledWith(
        1,
        "react",
        "All",
        []
      );
    });

    rerender(<InfiniteScrollProjects search="vue" />);

    await waitFor(() => {
      expect(githubApi.fetchProjects).toHaveBeenCalledWith(1, "vue", "All", []);
    });
  });
});
