"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Clock, TrendingUp } from "lucide-react";

interface MobileSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSearch({
  open,
  onOpenChange,
}: MobileSearchProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const recentSearches = ["React projects", "Python beginner", "TypeScript"];

  const trendingSearches = ["AI/ML projects", "Web3", "DevOps tools"];

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/projects?search=${encodeURIComponent(searchQuery)}`);
      onOpenChange(false);
      setQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-0 translate-y-0 max-w-full h-full sm:h-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Search Projects</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(query);
                }
              }}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-10 w-10"
                onClick={() => setQuery("")}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {!query && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-col gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trending</span>
                </div>
                <div className="flex flex-col gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
