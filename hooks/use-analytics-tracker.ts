"use client";

import { useEffect, useCallback } from "react";
import { AnalyticsEngine, UserAction } from "@/lib/analytics-engine";

export function useAnalyticsTracker(userId: string | null) {
  // Start session on mount
  useEffect(() => {
    if (!userId) return;

    AnalyticsEngine.startSession(userId);

    // End session on unmount or page unload
    const handleUnload = () => {
      AnalyticsEngine.endSession(userId);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      AnalyticsEngine.endSession(userId);
    };
  }, [userId]);

  // Track user actions
  const trackAction = useCallback(
    async (action: UserAction) => {
      if (!userId) return;

      try {
        AnalyticsEngine.trackUserEngagement(userId, action);

        // Also send to API for server-side tracking
        await fetch("/api/analytics/engagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, action }),
        });
      } catch (error) {
        console.error("Error tracking action:", error);
      }
    },
    [userId]
  );

  // Track project view
  const trackProjectView = useCallback(
    async (projectId: number, duration?: number) => {
      if (!userId) return;

      try {
        AnalyticsEngine.trackProjectView(projectId, userId, duration);

        await fetch("/api/analytics/popularity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            userId,
            action: "view",
            duration,
          }),
        });

        // Also track as user action
        trackAction({
          type: "view_project",
          timestamp: new Date(),
          metadata: { projectId },
        });
      } catch (error) {
        console.error("Error tracking project view:", error);
      }
    },
    [userId, trackAction]
  );

  // Track project bookmark
  const trackProjectBookmark = useCallback(
    async (projectId: number, isBookmarked: boolean) => {
      if (!userId) return;

      try {
        AnalyticsEngine.trackProjectBookmark(projectId, isBookmarked);

        await fetch("/api/analytics/popularity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            userId,
            action: isBookmarked ? "bookmark" : "unbookmark",
          }),
        });

        // Also track as user action
        trackAction({
          type: "bookmark",
          timestamp: new Date(),
          metadata: { projectId, isBookmarked },
        });
      } catch (error) {
        console.error("Error tracking bookmark:", error);
      }
    },
    [userId, trackAction]
  );

  // Track project share
  const trackProjectShare = useCallback(
    async (projectId: number) => {
      if (!userId) return;

      try {
        AnalyticsEngine.trackProjectShare(projectId);

        await fetch("/api/analytics/popularity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            userId,
            action: "share",
          }),
        });

        // Also track as user action
        trackAction({
          type: "share",
          timestamp: new Date(),
          metadata: { projectId },
        });
      } catch (error) {
        console.error("Error tracking share:", error);
      }
    },
    [userId, trackAction]
  );

  // Track project click through
  const trackProjectClickThrough = useCallback(
    async (projectId: number) => {
      if (!userId) return;

      try {
        AnalyticsEngine.trackProjectClickThrough(projectId);

        await fetch("/api/analytics/popularity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            userId,
            action: "click_through",
          }),
        });

        // Also track as user action
        trackAction({
          type: "click_contribute",
          timestamp: new Date(),
          metadata: { projectId },
        });
      } catch (error) {
        console.error("Error tracking click through:", error);
      }
    },
    [userId, trackAction]
  );

  // Track search
  const trackSearch = useCallback(
    async (query: string) => {
      if (!userId) return;

      try {
        trackAction({
          type: "search",
          timestamp: new Date(),
          metadata: { query },
        });
      } catch (error) {
        console.error("Error tracking search:", error);
      }
    },
    [userId, trackAction]
  );

  // Track filter
  const trackFilter = useCallback(
    async (filterType: string, filterValue: string) => {
      if (!userId) return;

      try {
        trackAction({
          type: "filter",
          timestamp: new Date(),
          metadata: { filterType, filterValue },
        });
      } catch (error) {
        console.error("Error tracking filter:", error);
      }
    },
    [userId, trackAction]
  );

  return {
    trackAction,
    trackProjectView,
    trackProjectBookmark,
    trackProjectShare,
    trackProjectClickThrough,
    trackSearch,
    trackFilter,
  };
}
