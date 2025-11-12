"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Filter, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface FilterOptions {
  languages: string[];
  topics: string[];
  difficulty: string[];
  status: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface AdvancedFilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
  className?: string;
}

const availableLanguages = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "PHP",
  "Ruby",
  "C#",
  "Swift",
  "Kotlin",
  "Dart",
  "Scala",
];

const availableTopics = [
  "good-first-issue",
  "help-wanted",
  "beginner-friendly",
  "documentation",
  "bug",
  "enhancement",
  "frontend",
  "backend",
  "mobile",
  "web",
  "api",
  "cli",
  "library",
  "framework",
  "testing",
  "security",
];

const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

const statusOptions = [
  "Active",
  "Inactive",
  "Archived",
  "New",
  "Popular",
  "Trending",
];

const sortOptions = [
  { value: "name", label: "Name" },
  { value: "stars", label: "Stars" },
  { value: "updated", label: "Last Updated" },
  { value: "created", label: "Created Date" },
  { value: "contributors", label: "Contributors" },
  { value: "issues", label: "Open Issues" },
];

export default function AdvancedFilterPanel({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  onReset,
  className,
}: AdvancedFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["languages", "topics"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter((l) => l !== language)
      : [...filters.languages, language];

    onFiltersChange({ ...filters, languages: newLanguages });
  };

  const handleTopicToggle = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter((t) => t !== topic)
      : [...filters.topics, topic];

    onFiltersChange({ ...filters, topics: newTopics });
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulty = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter((d) => d !== difficulty)
      : [...filters.difficulty, difficulty];

    onFiltersChange({ ...filters, difficulty: newDifficulty });
  };

  const handleStatusToggle = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];

    onFiltersChange({ ...filters, status: newStatus });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.languages.length +
      filters.topics.length +
      filters.difficulty.length +
      filters.status.length
    );
  };

  const FilterSection = ({
    title,
    sectionKey,
    items,
    selectedItems,
    onToggle,
    maxVisible = 8,
  }: {
    title: string;
    sectionKey: string;
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    maxVisible?: number;
  }) => {
    const [showAll, setShowAll] = useState(false);
    const isExpanded = expandedSections.has(sectionKey);
    const visibleItems = showAll ? items : items.slice(0, maxVisible);
    const hasMore = items.length > maxVisible;

    return (
      <div className="border-b border-border last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{title}</span>
            {selectedItems.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedItems.length}
              </Badge>
            )}
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 gap-2">
              {visibleItems.map((item) => (
                <label
                  key={item}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-accent/30 rounded p-1 transition-colors"
                >
                  <Checkbox
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => onToggle(item)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm">{item}</span>
                </label>
              ))}
            </div>

            {hasMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="mt-2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showAll
                  ? "Show less"
                  : `Show ${items.length - maxVisible} more`}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      {/* Toggle Button */}
      <Button
        variant="outline"
        onClick={onToggle}
        className={cn(
          "flex items-center gap-2 transition-all h-11 duration-200",
          isOpen && "bg-accent"
        )}
      >
        <Filter className="h-4 w-4" />
        Advanced Filters
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary" className="text-xs">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg animate-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Advanced Filters</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filter Sections */}
          <div className="max-h-96 overflow-y-auto">
            <FilterSection
              title="Languages"
              sectionKey="languages"
              items={availableLanguages}
              selectedItems={filters.languages}
              onToggle={handleLanguageToggle}
            />

            <FilterSection
              title="Topics"
              sectionKey="topics"
              items={availableTopics}
              selectedItems={filters.topics}
              onToggle={handleTopicToggle}
            />

            <FilterSection
              title="Difficulty"
              sectionKey="difficulty"
              items={difficultyLevels}
              selectedItems={filters.difficulty}
              onToggle={handleDifficultyToggle}
              maxVisible={4}
            />

            <FilterSection
              title="Status"
              sectionKey="status"
              items={statusOptions}
              selectedItems={filters.status}
              onToggle={handleStatusToggle}
              maxVisible={6}
            />

            {/* Sort Options */}
            <div className="border-b border-border last:border-b-0">
              <button
                onClick={() => toggleSection("sort")}
                className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors"
              >
                <span className="font-medium">Sort By</span>
                {expandedSections.has("sort") ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {expandedSections.has("sort") && (
                <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sort by
                    </label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        onFiltersChange({ ...filters, sortBy: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Order
                    </label>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value: "asc" | "desc") =>
                        onFiltersChange({ ...filters, sortOrder: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">Descending</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {getActiveFiltersCount()} filter
                {getActiveFiltersCount() !== 1 ? "s" : ""} applied
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={onToggle}
                className="text-xs"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
