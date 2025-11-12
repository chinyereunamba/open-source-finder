"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  GitFork,
  Clock,
  MessageSquare,
  Bookmark,
  Share2,
  Eye,
  ExternalLink,
  Users,
} from "lucide-react";

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

interface EnhancedProjectCardProps {
  project: Project;
  viewMode?: "grid" | "list";
  isBookmarked?: boolean;
  onBookmark?: (projectId: number) => void;
  onShare?: (project: Project) => void;
  onQuickView?: (project: Project) => void;
}

const languageColors: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Java: "bg-orange-500",
  "C++": "bg-blue-600",
  C: "bg-gray-600",
  Go: "bg-cyan-500",
  Rust: "bg-orange-600",
  PHP: "bg-purple-500",
  Ruby: "bg-red-500",
  Swift: "bg-orange-400",
  Kotlin: "bg-purple-600",
  Dart: "bg-blue-400",
  HTML: "bg-orange-500",
  CSS: "bg-blue-400",
  Shell: "bg-gray-500",
};

// Mock contributor data - in real app this would come from API
const mockContributors = [
  { id: 1, avatar: "https://github.com/octocat.png", login: "octocat" },
  { id: 2, avatar: "https://github.com/defunkt.png", login: "defunkt" },
  { id: 3, avatar: "https://github.com/pjhyett.png", login: "pjhyett" },
];

export default function EnhancedProjectCard({
  project,
  viewMode = "list",
  isBookmarked = false,
  onBookmark,
  onShare,
  onQuickView,
}: EnhancedProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
    onBookmark?.(project.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(project);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(project);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "yesterday";
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  const truncateDescription = (desc: string | null) => {
    const maxLength = viewMode === "grid" ? 80 : 120;
    if (!desc) return "";
    return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
  };

  const cardVariants = {
    initial: { y: 0, scale: 1 },
    hover: {
      y: -4,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const quickActionsVariants = {
    initial: { opacity: 0, x: 20 },
    hover: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const actionButtonVariants = {
    initial: { opacity: 0, x: 10 },
    hover: { opacity: 1, x: 0 },
  };

  if (viewMode === "grid") {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group items-stretch"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          {/* Quick Actions Overlay */}
          <motion.div
            variants={quickActionsVariants}
            className="absolute top-4 right-4 z-10 flex flex-col gap-2"
          >
            <motion.div variants={actionButtonVariants}>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 shadow-sm"
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    bookmarked ? "fill-current text-blue-600" : "text-text"
                  }`}
                />
              </Button>
            </motion.div>
            <motion.div variants={actionButtonVariants}>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 shadow-sm"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div variants={actionButtonVariants}>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 shadow-sm"
                onClick={handleQuickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>

          <CardHeader className="pb-3 w-full">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <Link href={`/projects/${project.id}`} className="group -">
                  <CardTitle className="text-lg font-semibold w-full group-hover:text-blue-600 transition-colors duration-200 line-clamp-1">
                    {project.full_name}
                  </CardTitle>
                </Link>

                {/* Language Indicator */}
                {project.language && (
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        languageColors[project.language] || "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {project.language}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm mb-4 line-clamp-3">
              {truncateDescription(project.description)}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.topics.slice(0, 3).map((topic) => (
                <Badge
                  key={topic}
                  variant="secondary"
                  className="text-xs transition-colors"
                >
                  {topic}
                </Badge>
              ))}
              {project.topics.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100">
                  +{project.topics.length - 3}
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{formatNumber(project.stargazers_count)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-4 w-4" />
                  <span>{formatNumber(project.forks_count)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{formatNumber(project.open_issues_count)}</span>
                </div>
              </div>
            </div>

            {/* Contributors */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {mockContributors.slice(0, 3).map((contributor) => (
                    <Avatar key={contributor.id} className="h-6 w-6 border-2">
                      <AvatarImage
                        src={contributor.avatar}
                        alt={contributor.login}
                      />
                      <AvatarFallback className="text-xs">
                        {contributor.login[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs">
                  <Users className="h-3 w-3 inline mr-1" />
                  {formatNumber(project.forks_count)} contributors
                </span>
              </div>

              <div className="flex items-center text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(project.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex flex-col space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link href={`/projects/${project.id}`} className="group">
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-200">
                      {project.full_name}
                    </h3>
                  </Link>

                  {/* Language Indicator */}
                  {project.language && (
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          languageColors[project.language] || "bg-gray-400"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {project.language}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <motion.div
                  variants={quickActionsVariants}
                  className="flex gap-2 ml-4"
                >
                  <motion.div variants={actionButtonVariants}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={handleBookmark}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          bookmarked
                            ? "fill-current text-blue-600"
                            : "text-text"
                        }`}
                      />
                    </Button>
                  </motion.div>
                  <motion.div variants={actionButtonVariants}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div variants={actionButtonVariants}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={handleQuickView}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>

              <p className="leading-relaxed">
                {truncateDescription(project.description)}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {project.topics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="text-xs transition-colors"
                  >
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Contributors */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {mockContributors.slice(0, 4).map((contributor) => (
                    <Avatar key={contributor.id} className="h-7 w-7 border-2">
                      <AvatarImage
                        src={contributor.avatar}
                        alt={contributor.login}
                      />
                      <AvatarFallback className="text-xs">
                        {contributor.login[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-sm">
                  <Users className="h-4 w-4 inline mr-1" />
                  {formatNumber(project.forks_count)} contributors
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between items-start p-6 border-t md:border-l md:border-t-0 md:max-w-[300px] w-full">
            <div className="flex flex-col space-y-4">
              {/* Stats */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>{formatNumber(project.stargazers_count)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    <span>{formatNumber(project.forks_count)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{formatNumber(project.open_issues_count)}</span>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Updated {formatDate(project.updated_at)}</span>
                </div>
              </div>
            </div>

            <div className="flex max-md:flex-col gap-2 mt-4 md:mt-0">
              <Button
                size="sm"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href={`/projects/${project.id}`}>View Project</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                asChild
                className=""
              >
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
