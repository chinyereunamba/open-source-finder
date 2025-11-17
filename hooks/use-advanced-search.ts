import { useState, useCallback } from "react";
import { Project } from "@/lib/github-api";
import { SemanticSearchResult } from "@/lib/semantic-search";
import { SimilarityScore, ProjectCluster } from "@/lib/project-similarity";
import { TrendingProject, TrendingCategory } from "@/lib/trending-projects";

export interface AdvancedSearchFilters {
  languages?: string[];
  topics?: string[];
  minStars?: number;
  maxStars?: number;
  hasGoodFirstIssues?: boolean;
}

export interface SearchOptions {
  query?: string;
  type:
    | "semantic"
    | "similar"
    | "clusters"
    | "trending"
    | "trending-categories"
    | "trending-summary";
  filters?: AdvancedSearchFilters;
  limit?: number;
  page?: number;
  projectId?: number; // For similarity search
  timeframe?: "daily" | "weekly" | "monthly"; // For trending
}

export interface SearchResults {
  type: string;
  results: any[];
  total?: number;
  page?: number;
  limit?: number;
  targetProject?: Project;
  timeframe?: string;
}

export function useAdvancedSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResults | null>(null);

  const search = useCallback(async (options: SearchOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/search/advanced", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data = await response.json();
      setResults(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSemantic = useCallback(
    async (
      query: string,
      filters?: AdvancedSearchFilters,
      options?: { limit?: number; page?: number }
    ) => {
      return search({
        type: "semantic",
        query,
        filters,
        ...options,
      });
    },
    [search]
  );

  const findSimilar = useCallback(
    async (projectId: number, limit: number = 10) => {
      return search({
        type: "similar",
        projectId,
        limit,
      });
    },
    [search]
  );

  const getClusters = useCallback(async () => {
    return search({
      type: "clusters",
    });
  }, [search]);

  const getTrending = useCallback(
    async (
      timeframe: "daily" | "weekly" | "monthly" = "weekly",
      limit: number = 20
    ) => {
      return search({
        type: "trending",
        timeframe,
        limit,
      });
    },
    [search]
  );

  const getTrendingCategories = useCallback(async () => {
    return search({
      type: "trending-categories",
    });
  }, [search]);

  const getTrendingSummary = useCallback(async () => {
    return search({
      type: "trending-summary",
    });
  }, [search]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    search,
    searchSemantic,
    findSimilar,
    getClusters,
    getTrending,
    getTrendingCategories,
    getTrendingSummary,
    clearResults,
  };
}

// Typed hooks for specific search types
export function useSemanticSearch() {
  const { searchSemantic, loading, error, results } = useAdvancedSearch();

  return {
    search: searchSemantic,
    loading,
    error,
    results:
      results?.type === "semantic"
        ? (results.results as SemanticSearchResult[])
        : [],
    total: results?.total || 0,
    page: results?.page || 1,
    limit: results?.limit || 20,
  };
}

export function useSimilaritySearch() {
  const { findSimilar, loading, error, results } = useAdvancedSearch();

  return {
    findSimilar,
    loading,
    error,
    results:
      results?.type === "similar" ? (results.results as SimilarityScore[]) : [],
    targetProject: results?.targetProject,
  };
}

export function useProjectClusters() {
  const { getClusters, loading, error, results } = useAdvancedSearch();

  return {
    getClusters,
    loading,
    error,
    clusters:
      results?.type === "clusters" ? (results.results as ProjectCluster[]) : [],
  };
}

export function useTrendingProjects() {
  const {
    getTrending,
    getTrendingCategories,
    getTrendingSummary,
    loading,
    error,
    results,
  } = useAdvancedSearch();

  return {
    getTrending,
    getTrendingCategories,
    getTrendingSummary,
    loading,
    error,
    trendingProjects:
      results?.type === "trending"
        ? (results.results as TrendingProject[])
        : [],
    trendingCategories:
      results?.type === "trending-categories"
        ? (results.results as TrendingCategory[])
        : [],
    trendingSummary:
      results?.type === "trending-summary" ? results.results : null,
    timeframe: results?.timeframe,
  };
}
