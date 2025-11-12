"use client";

import { useState, useEffect, useOptimistic, useTransition } from "react";
import { toast } from "sonner";

export function useOptimisticBookmark() {
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<number>>(
    new Set()
  );
  const [optimisticBookmarks, addOptimisticBookmark] = useOptimistic(
    bookmarkedProjects,
    (state, projectId: number) => {
      const newSet = new Set(state);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    }
  );
  const [isPending, startTransition] = useTransition();

  // Load bookmarked projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedProjects");
    if (saved) {
      setBookmarkedProjects(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleBookmark = (projectId: number) => {
    startTransition(async () => {
      // Optimistically update UI
      addOptimisticBookmark(projectId);

      // Simulate async operation (in real app, this would be an API call)
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Update actual state
      const newBookmarked = new Set(bookmarkedProjects);
      const wasBookmarked = newBookmarked.has(projectId);

      if (wasBookmarked) {
        newBookmarked.delete(projectId);
        toast.success("Project removed from bookmarks");
      } else {
        newBookmarked.add(projectId);
        toast.success("Project bookmarked");
      }

      setBookmarkedProjects(newBookmarked);
      localStorage.setItem(
        "bookmarkedProjects",
        JSON.stringify(Array.from(newBookmarked))
      );
    });
  };

  return {
    bookmarkedProjects: optimisticBookmarks,
    toggleBookmark,
    isPending,
  };
}
