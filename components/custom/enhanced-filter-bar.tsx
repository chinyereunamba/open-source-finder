"use client";

import { useState, useEffect, useMemo } from "react";
import { Filter } from "lucide-react";
import EnhancedSearch from "./enhanced-search";
import FilterChips, { FilterChip } from "./filter-chips";
import AdvancedFilterPanel, { FilterOptions } from "./advanced-filter-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const defaultFilters: FilterOptions = {
  languages: [],
  topics: [],
  difficulty: [],
  status: [],
  sortBy: "stars",
  sortOrder: "desc",
};

export default function EnhancedFilterBar({
  searchValue,
  onSearchChange,
  onSearch,
  filters,
  onFiltersChange,
  className,
}: EnhancedFilterBarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate filter chips from current filters
  const filterChips = useMemo((): FilterChip[] => {
    const chips: FilterChip[] = [];

    // Language chips
    filters.languages.forEach((language) => {
      chips.push({
        id: `language-${language}`,
        label: language,
        value: language,
        type: "language",
      });
    });

    // Topic chips
    filters.topics.forEach((topic) => {
      chips.push({
        id: `topic-${topic}`,
        label: topic,
        value: topic,
        type: "topic",
      });
    });

    // Difficulty chips
    filters.difficulty.forEach((difficulty) => {
      chips.push({
        id: `difficulty-${difficulty}`,
        label: difficulty,
        value: difficulty,
        type: "difficulty",
      });
    });

    // Status chips
    filters.status.forEach((status) => {
      chips.push({
        id: `status-${status}`,
        label: status,
        value: status,
        type: "status",
      });
    });

    return chips;
  }, [filters]);

  // Handle chip removal
  const handleChipRemove = (chipId: string) => {
    const [type, value] = chipId.split("-", 2);

    const newFilters = { ...filters };

    switch (type) {
      case "language":
        newFilters.languages = filters.languages.filter((l) => l !== value);
        break;
      case "topic":
        newFilters.topics = filters.topics.filter((t) => t !== value);
        break;
      case "difficulty":
        newFilters.difficulty = filters.difficulty.filter((d) => d !== value);
        break;
      case "status":
        newFilters.status = filters.status.filter((s) => s !== value);
        break;
    }

    onFiltersChange(newFilters);
  };

  // Handle clearing all filters
  const handleClearAllFilters = () => {
    setIsAnimating(true);
    onFiltersChange(defaultFilters);

    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Handle resetting filters
  const handleResetFilters = () => {
    handleClearAllFilters();
    setIsAdvancedOpen(false);
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.languages.length > 0 ||
      filters.topics.length > 0 ||
      filters.difficulty.length > 0 ||
      filters.status.length > 0
    );
  }, [filters]);

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue.trim()) {
        onSearch(searchValue.trim());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearch]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Advanced Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <EnhancedSearch
            value={searchValue}
            onChange={onSearchChange}
            onSearch={onSearch}
            placeholder="Search projects by name, language, or topic..."
          />
        </div>

        <div className="flex items-center gap-2">
          <AdvancedFilterPanel
            isOpen={isAdvancedOpen}
            onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
            filters={filters}
            onFiltersChange={onFiltersChange}
            onReset={handleResetFilters}
          />
        </div>
      </div>

      {/* Filter Chips */}
      {hasActiveFilters && (
        <div
          className={cn(
            "transition-all duration-300 ease-in-out",
            isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Active filters:</span>
            </div>
            <FilterChips
              chips={filterChips}
              onRemove={handleChipRemove}
              onClear={handleClearAllFilters}
              className="flex-1"
            />
          </div>
        </div>
      )}

      {/* Filter Summary */}
      {(hasActiveFilters || searchValue.trim()) && (
        <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 rounded-lg px-4 py-2">
          <div className="flex items-center gap-4">
            {searchValue.trim() && (
              <span>
                Searching for: <strong>"{searchValue.trim()}"</strong>
              </span>
            )}
            {hasActiveFilters && (
              <span>
                {filterChips.length} filter{filterChips.length !== 1 ? "s" : ""}{" "}
                applied
              </span>
            )}
          </div>

          {(hasActiveFilters || searchValue.trim()) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange("");
                handleClearAllFilters();
              }}
              className="text-xs hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
