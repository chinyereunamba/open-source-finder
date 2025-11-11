"use client";

import { useState, useEffect } from "react";
import { fetchProjects } from "@/lib/github-api";
import { useSearchParams } from "next/navigation";
import EnhancedProjectCard from "./enhanced-project-card";
import ViewModeToggle from "./view-mode-toggle";
import PaginationControls from "./pagination-buttons";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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

interface EnhancedProjectListProps {
  search?: string;
  language?: string;
  topics?: string[];
}

export default function EnhancedProjectList({
  search = "",
  language = "All",
  topics = [],
}: EnhancedProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<number>>(
    new Set()
  );

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || "1");

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      try {
        const data = await fetchProjects(page, search, language, topics);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Use demo data as fallback
        setProjects(demoProjects);
      } finally {
        setLoading(false);
      }
    };

    getProjects();
  }, [page, search, language, topics]);

  // Load bookmarked projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedProjects");
    if (saved) {
      setBookmarkedProjects(new Set(JSON.parse(saved)));
    }
  }, []);

  const handleBookmark = (projectId: number) => {
    const newBookmarked = new Set(bookmarkedProjects);
    if (newBookmarked.has(projectId)) {
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
    // For now, just navigate to the project page
    // In a full implementation, this would open a modal
    window.open(`/projects/${project.id}`, "_blank");
  };

  // Demo projects fallback
  const demoProjects: Project[] = [
    {
      id: 1,
      name: "react",
      full_name: "facebook/react",
      description:
        "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
      language: "JavaScript",
      stargazers_count: 198000,
      forks_count: 41000,
      open_issues_count: 1100,
      updated_at: "2023-04-01T12:00:00Z",
      html_url: "https://github.com/facebook/react",
      topics: ["javascript", "ui", "frontend", "good-first-issue"],
    },
    {
      id: 2,
      name: "tensorflow",
      full_name: "tensorflow/tensorflow",
      description: "An Open Source Machine Learning Framework for Everyone",
      language: "C++",
      stargazers_count: 170000,
      forks_count: 87000,
      open_issues_count: 2300,
      updated_at: "2023-04-02T10:30:00Z",
      html_url: "https://github.com/tensorflow/tensorflow",
      topics: ["machine-learning", "ai", "python", "help-wanted"],
    },
    {
      id: 3,
      name: "vscode",
      full_name: "microsoft/vscode",
      description: "Visual Studio Code",
      language: "TypeScript",
      stargazers_count: 142000,
      forks_count: 24000,
      open_issues_count: 7800,
      updated_at: "2023-04-03T09:15:00Z",
      html_url: "https://github.com/microsoft/vscode",
      topics: ["editor", "typescript", "good-first-issue"],
    },
    {
      id: 4,
      name: "flutter",
      full_name: "flutter/flutter",
      description:
        "Flutter makes it easy and fast to build beautiful apps for mobile and beyond",
      language: "Dart",
      stargazers_count: 147000,
      forks_count: 23000,
      open_issues_count: 11000,
      updated_at: "2023-04-01T14:20:00Z",
      html_url: "https://github.com/flutter/flutter",
      topics: ["mobile", "ui", "dart", "help-wanted"],
    },
    {
      id: 5,
      name: "rust",
      full_name: "rust-lang/rust",
      description:
        "Empowering everyone to build reliable and efficient software.",
      language: "Rust",
      stargazers_count: 79000,
      forks_count: 10000,
      open_issues_count: 8700,
      updated_at: "2023-04-02T16:45:00Z",
      html_url: "https://github.com/rust-lang/rust",
      topics: ["systems-programming", "language", "good-first-issue"],
    },
    {
      id: 6,
      name: "kubernetes",
      full_name: "kubernetes/kubernetes",
      description: "Production-Grade Container Scheduling and Management",
      language: "Go",
      stargazers_count: 97000,
      forks_count: 35000,
      open_issues_count: 2200,
      updated_at: "2023-04-03T11:30:00Z",
      html_url: "https://github.com/kubernetes/kubernetes",
      topics: ["container", "orchestration", "cloud", "help-wanted"],
    },
  ];

  const sourceProjects = projects.length > 0 ? projects : demoProjects;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
        <div className="text-sm text-gray-600">
          {sourceProjects.length} projects found
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
          {sourceProjects.map((project) => (
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

      {/* Pagination */}
      <PaginationControls currentPage={page} />
    </div>
  );
}
