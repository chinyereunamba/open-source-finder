"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/ui/page-transition";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star,
  GitFork,
  ExternalLink,
  Trash2,
  Search,
  BookMarked,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookmarkedProject {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  url: string;
  bookmarkedAt: string;
}

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarks, setBookmarks] = useState<BookmarkedProject[]>([
    {
      id: 1,
      name: "facebook/react",
      description: "The library for web and native user interfaces",
      language: "JavaScript",
      stars: 220000,
      forks: 45000,
      topics: ["javascript", "react", "frontend"],
      url: "/projects/1",
      bookmarkedAt: "2024-01-15",
    },
    {
      id: 2,
      name: "vercel/next.js",
      description: "The React Framework for the Web",
      language: "TypeScript",
      stars: 118000,
      forks: 25000,
      topics: ["react", "nextjs", "framework"],
      url: "/projects/8",
      bookmarkedAt: "2024-01-20",
    },
    {
      id: 3,
      name: "microsoft/vscode",
      description: "Visual Studio Code",
      language: "TypeScript",
      stars: 155000,
      forks: 27000,
      topics: ["editor", "typescript", "electron"],
      url: "/projects/3",
      bookmarkedAt: "2024-02-01",
    },
    {
      id: 4,
      name: "flutter/flutter",
      description: "Flutter makes it easy to build beautiful apps",
      language: "Dart",
      stars: 160000,
      forks: 26000,
      topics: ["flutter", "dart", "mobile"],
      url: "/projects/4",
      bookmarkedAt: "2024-02-10",
    },
  ]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">
          You must be signed in to view your bookmarks.
        </h2>
        <Link href="/auth/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const removeBookmark = (id: number) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const filteredBookmarks = bookmarks.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <PageTransition>
      <div className="container px-4 py-8 md:px-6 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <BookMarked className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Bookmarked Projects</h1>
          </div>
          <p className="text-muted-foreground">
            {bookmarks.length} project{bookmarks.length !== 1 ? "s" : ""} saved
            for later
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bookmarked projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Bookmarks Grid */}
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No bookmarks match your search"
                : "No bookmarked projects yet"}
            </p>
            {!searchQuery && (
              <Link href="/projects">
                <Button>Browse Projects</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredBookmarks.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Card className="group hover:border-primary transition-colors h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Link
                          href={project.url}
                          className="font-semibold text-lg hover:underline"
                        >
                          {project.name}
                        </Link>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            asChild
                          >
                            <Link href={project.url}>
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => removeBookmark(project.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            {project.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {formatNumber(project.stars)}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitFork className="h-4 w-4" />
                            {formatNumber(project.forks)}
                          </span>
                        </div>
                        <span className="text-xs">
                          Saved{" "}
                          {new Date(project.bookmarkedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
