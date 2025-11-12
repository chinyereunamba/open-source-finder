"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ExternalLink, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookmarkedProject {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
}

export default function BookmarkedProjects() {
  const [bookmarks, setBookmarks] = useState<BookmarkedProject[]>([
    {
      id: 1,
      name: "facebook/react",
      description: "The library for web and native user interfaces",
      language: "JavaScript",
      stars: 220000,
      forks: 45000,
      url: "/projects/1",
    },
    {
      id: 2,
      name: "vercel/next.js",
      description: "The React Framework for the Web",
      language: "TypeScript",
      stars: 118000,
      forks: 25000,
      url: "/projects/8",
    },
    {
      id: 3,
      name: "microsoft/vscode",
      description: "Visual Studio Code",
      language: "TypeScript",
      stars: 155000,
      forks: 27000,
      url: "/projects/3",
    },
  ]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const removeBookmark = (id: number) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">No bookmarked projects yet</p>
        <Link href="/projects">
          <Button variant="outline" size="sm">
            Browse Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {bookmarks.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="group p-3 border rounded-lg hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Link
                  href={project.url}
                  className="font-medium text-sm hover:underline truncate block"
                >
                  {project.name}
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {project.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {project.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {formatNumber(project.stars)}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3 w-3" />
                    {formatNumber(project.forks)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <Link href={project.url}>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeBookmark(project.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <Link href="/dashboard/bookmarks">
        <Button variant="outline" size="sm" className="w-full">
          View All Bookmarks
        </Button>
      </Link>
    </div>
  );
}
