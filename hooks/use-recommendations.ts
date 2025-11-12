import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  RecommendedProject,
  UserPreferences,
  FeedbackData,
  RecommendationEngine,
} from "@/lib/recommendation-engine";
import { UserInterestTracker } from "@/lib/user-interests";
import { Project } from "@/lib/github-api";

interface UseRecommendationsOptions {
  limit?: number;
  autoFetch?: boolean;
}

interface UseRecommendationsReturn {
  recommendations: RecommendedProject[];
  loading: boolean;
  error: string | null;
  preferences: UserPreferences;
  fetchRecommendations: () => Promise<void>;
  provideFeedback: (
    projectId: number,
    feedbackType: "interested" | "not_interested" | "dismissed",
    project: Project
  ) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  refreshRecommendations: () => Promise<void>;
}

export function useRecommendations(
  options: UseRecommendationsOptions = {}
): UseRecommendationsReturn {
  const { limit = 10, autoFetch = true } = options;
  const { data: session } = useSession();
  const userId = session?.user?.email || "";

  const [recommendations, setRecommendations] = useState<RecommendedProject[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(
    UserInterestTracker.getUserPreferences(userId)
  );

  const fetchRecommendations = useCallback(async () => {
    if (!userId) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentPreferences = UserInterestTracker.getUserPreferences(userId);
      setPreferences(currentPreferences);

      // Check if user has any preferences set
      const hasPreferences =
        currentPreferences.preferredLanguages.length > 0 ||
        currentPreferences.interests.length > 0 ||
        currentPreferences.viewedProjects.length > 0;

      let response;

      if (hasPreferences) {
        // Fetch personalized recommendations
        response = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preferences: currentPreferences,
            limit,
          }),
        });
      } else {
        // Fetch trending recommendations for new users
        response = await fetch(`/api/recommendations?limit=${limit}`);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch recommendations"
      );
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  const provideFeedback = useCallback(
    async (
      projectId: number,
      feedbackType: "interested" | "not_interested" | "dismissed",
      project: Project
    ) => {
      if (!userId) return;

      try {
        // Record feedback locally
        const feedback: FeedbackData = {
          projectId,
          userId,
          feedbackType,
          timestamp: new Date(),
        };
        UserInterestTracker.recordFeedback(feedback);

        // Update preferences based on feedback
        const currentPreferences =
          UserInterestTracker.getUserPreferences(userId);
        const updatedPreferences = RecommendationEngine.updateUserPreferences(
          currentPreferences,
          feedback,
          project
        );
        UserInterestTracker.saveUserPreferences(userId, updatedPreferences);
        setPreferences(updatedPreferences);

        // Send feedback to server
        await fetch("/api/recommendations/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            feedbackType,
          }),
        });

        // Remove the project from current recommendations if dismissed
        if (feedbackType === "dismissed" || feedbackType === "not_interested") {
          setRecommendations((prev) =>
            prev.filter((rec) => rec.id !== projectId)
          );
        }
      } catch (err) {
        console.error("Error providing feedback:", err);
      }
    },
    [userId]
  );

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      if (!userId) return;

      const updated = UserInterestTracker.updatePreferences(userId, updates);
      setPreferences(updated);
    },
    [userId]
  );

  const refreshRecommendations = useCallback(async () => {
    await fetchRecommendations();
  }, [fetchRecommendations]);

  useEffect(() => {
    if (autoFetch && userId) {
      fetchRecommendations();
    }
  }, [autoFetch, userId, fetchRecommendations]);

  return {
    recommendations,
    loading,
    error,
    preferences,
    fetchRecommendations,
    provideFeedback,
    updatePreferences,
    refreshRecommendations,
  };
}
