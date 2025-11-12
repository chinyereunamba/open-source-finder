"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchProjects } from "@/lib/github-api";
import EnhancedProjectCard from "./enhanced-project-card";
import ViewModeToggle from "./view-mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ProjectListSkeleton } from "../ui/loading-states";
import { InlineErrorState } from "../ui/error-state";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useOptimisticBookmark } from "@/hooks/use-optimistic-bookmark";

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

interface InfiniteScrollProjectsProps {
  search?: string;
  language?: string;
  topics?: string[];
}

export default function InfiniteScrollProjects({
  search = "",
  language = "All",
  topics = [],
}: InfiniteScrollProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [error, setError] = useState<string | null>(null);
  const { bookmarkedProjects, toggleBookmark } = useOptimisticBookmark();

  const observerTarget = useRef<HTMLDivElement>(null);

  // Load initial projects
  const loadInitialProjects = async () => {
    setLoading(true);
    setError(null);
    setPage(1);
    setProjects([]);
    setHasMore(true);

    console.log("🔍 InfiniteScroll - Fetching with params:", {
      page: 1,
      search,
      language,
      topics,
    });

    try {
      const data = await fetchProjects(1, search, language, topics);
      console.log("✅ InfiniteScroll - Received projects:", data.length);
      setProjects(data);
      setHasMore(data.length === 20); // Assuming 20 per page
    } catch (error) {
      console.error("❌ InfiniteScroll - Error fetching projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialProjects();
  }, [search, language, topics]);

  // Load more projects
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchProjects(nextPage, search, language, topics);

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setProjects((prev) => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === 20);
      }
    } catch (error) {
      console.error("Error loading more projects:", error);
      toast.error("Failed to load more projects");
    } finally {
      setLoadingMore(false);
    }
  }, [page, search, language, topics, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, loadingMore]);

  const handleBookmark = (projectId: number) => {
    toggleBookmark(projectId);
  };

  const handleShare = (project: Project) => {
    if (navigator.share) {
      navigator.share({
        title: project.full_name,
        text: project.description,
        url: window.location.origin + `/projects/${project.id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/projects/${project.id}`
      );
      toast.success("Project link copied to clipboard");
    }
  };

  const handleQuickView = (project: Project) => {
    window.open(`/projects/${project.id}`, "_blank");
  };

  if (loading) {
    return <ProjectListSkeleton viewMode={viewMode} count={9} />;
  }

  if (error && projects.length === 0) {
    return <InlineErrorState message={error} onRetry={loadInitialProjects} />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header with view mode toggle */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {projects.length} projects loaded
        </div>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Projects Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <EnhancedProjectCard
                project={project}
                viewMode={viewMode}
                isBookmarked={bookmarkedProjects.has(project.id)}
                onBookmark={handleBookmark}
                onShare={handleShare}
                onQuickView={handleQuickView}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" text="Loading more projects..." />
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />

      {/* End of results message */}
      {!hasMore && projects.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No more projects to load
        </div>
      )}

      {/* No results message */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      )}
    </div>
  );
}
