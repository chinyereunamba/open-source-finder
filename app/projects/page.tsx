"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import EnhancedProjectList from "@/components/custom/enhanced-project-list";
import EnhancedFilterBar from "@/components/custom/enhanced-filter-bar";
import { FilterOptions } from "@/components/custom/advanced-filter-panel";
import { Suspense, useState } from "react";

const defaultFilters: FilterOptions = {
  languages: [],
  topics: [],
  difficulty: [],
  status: [],
  sortBy: "stars",
  sortOrder: "desc",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Convert new filter format to legacy format for EnhancedProjectList
  const selectedLanguage =
    filters.languages.length > 0 ? filters.languages[0] : "All";
  const selectedTopics = filters.topics;

  return (
    <div className="container px-4 py-8 md:px-6 mx-auto">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Discover open source projects that need contributors
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/submit">Submit a Project</Link>
            </Button>
          </div>
        </div>

        <EnhancedFilterBar
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        <Suspense fallback={<div>Loading projects...</div>}>
          <EnhancedProjectList
            search={search}
            language={selectedLanguage}
            topics={selectedTopics}
          />
        </Suspense>
      </div>
    </div>
  );
}
