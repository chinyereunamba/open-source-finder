"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Clock, X, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "project" | "language" | "topic" | "user";
  count?: number;
}

interface EnhancedSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

// Mock data for suggestions - in a real app, this would come from an API
const mockSuggestions: SearchSuggestion[] = [
  { id: "1", text: "React", type: "language", count: 1250 },
  { id: "2", text: "TypeScript", type: "language", count: 980 },
  { id: "3", text: "good-first-issue", type: "topic", count: 450 },
  { id: "4", text: "Next.js", type: "project", count: 320 },
  { id: "5", text: "Vue.js", type: "project", count: 280 },
  { id: "6", text: "Python", type: "language", count: 1100 },
  { id: "7", text: "documentation", type: "topic", count: 200 },
  { id: "8", text: "beginner-friendly", type: "topic", count: 180 },
];

const SEARCH_HISTORY_KEY = "oss-finder-search-history";
const MAX_HISTORY_ITEMS = 5;

export default function EnhancedSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Search projects, languages, or topics...",
  className,
}: EnhancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (error) {
        console.error("Failed to parse search history:", error);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((history: string[]) => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    setSearchHistory(history);
  }, []);

  // Add to search history
  const addToHistory = useCallback(
    (query: string) => {
      if (!query.trim()) return;

      const newHistory = [
        query,
        ...searchHistory.filter((item) => item !== query),
      ].slice(0, MAX_HISTORY_ITEMS);

      saveSearchHistory(newHistory);
    },
    [searchHistory, saveSearchHistory]
  );

  // Remove from search history
  const removeFromHistory = useCallback(
    (query: string) => {
      const newHistory = searchHistory.filter((item) => item !== query);
      saveSearchHistory(newHistory);
    },
    [searchHistory, saveSearchHistory]
  );

  // Filter suggestions based on input
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = mockSuggestions.filter((suggestion) =>
      suggestion.text.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 6));
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setHighlightedIndex(-1);

    // Show dropdown when typing
    if (newValue.trim()) {
      setIsOpen(true);
    }
  };

  // Handle search execution
  const handleSearch = (query?: string) => {
    const searchQuery = query || value;
    if (searchQuery.trim()) {
      addToHistory(searchQuery.trim());
      onSearch(searchQuery.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    const totalItems = suggestions.length + searchHistory.length;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < totalItems - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < searchHistory.length) {
            // Select from history
            const selectedHistory = searchHistory[highlightedIndex];
            onChange(selectedHistory);
            handleSearch(selectedHistory);
          } else {
            // Select from suggestions
            const suggestionIndex = highlightedIndex - searchHistory.length;
            const selectedSuggestion = suggestions[suggestionIndex];
            onChange(selectedSuggestion.text);
            handleSearch(selectedSuggestion.text);
          }
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get type icon
  const getTypeIcon = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "language":
        return "🔧";
      case "topic":
        return "🏷️";
      case "project":
        return "📦";
      case "user":
        return "👤";
      default:
        return "🔍";
    }
  };

  // Get type color
  const getTypeColor = (type: SearchSuggestion["type"]) => {
    switch (type) {
      case "language":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "topic":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "project":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "user":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const showDropdown =
    isOpen &&
    (suggestions.length > 0 || searchHistory.length > 0 || value.trim());

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-12 h-11 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-md shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-200"
        >
          <div className="max-h-80 overflow-y-auto p-1">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent searches
                </div>
                {searchHistory.map((historyItem, index) => (
                  <div
                    key={`history-${index}`}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded-sm transition-colors",
                      index === highlightedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                    onClick={() => {
                      onChange(historyItem);
                      handleSearch(historyItem);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{historyItem}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(historyItem);
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                {searchHistory.length > 0 && (
                  <div className="border-t border-border my-1" />
                )}
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => {
                  const actualIndex = searchHistory.length + index;
                  return (
                    <div
                      key={suggestion.id}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded-sm transition-colors",
                        actualIndex === highlightedIndex
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => {
                        onChange(suggestion.text);
                        handleSearch(suggestion.text);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {getTypeIcon(suggestion.type)}
                        </span>
                        <span>{suggestion.text}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getTypeColor(suggestion.type)
                          )}
                        >
                          {suggestion.type}
                        </Badge>
                      </div>
                      {suggestion.count && (
                        <span className="text-xs text-muted-foreground">
                          {suggestion.count.toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* No results */}
            {value.trim() &&
              suggestions.length === 0 &&
              searchHistory.length === 0 && (
                <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                  No suggestions found for "{value}"
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
