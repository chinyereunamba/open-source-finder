"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Bookmark, Share2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface MobileProjectCardProps {
  project: {
    id: number;
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    topics?: string[];
  };
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onShare?: () => void;
}

export default function MobileProjectCard({
  project,
  isBookmarked = false,
  onBookmark,
  onShare,
}: MobileProjectCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/projects/${project.id}`} className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
                {project.name}
              </h3>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setShowActions(!showActions)}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {project.description}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{project.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>{project.forks.toLocaleString()}</span>
            </div>
            {project.language && (
              <Badge variant="secondary" className="text-xs">
                {project.language}
              </Badge>
            )}
          </div>

          {project.topics && project.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.topics.slice(0, 3).map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {project.topics.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.topics.length - 3}
                </Badge>
              )}
            </div>
          )}

          {showActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 pt-2 border-t"
            >
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onBookmark}
              >
                <Bookmark
                  className={`h-4 w-4 mr-1 ${
                    isBookmarked ? "fill-current" : ""
                  }`}
                />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
