"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  TrendingUp,
  Sparkles,
  Grid3X3,
  List,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { Project } from "@/lib/github-api";
import {
  SemanticSearchEngine,
  SearchQuery,
  SemanticSearchResult,
} from "@/lib/semantic-search";
import {
  ProjectSimilarityEngine,
  ProjectCluster,
} from "@/lib/project-similarity";
import {
  TrendingProjectsEngine,
  TrendingProject,
  TrendingCategory,
} from "@/lib/trending-projects";
import EnhancedProjectCard from "./enhanced-project-card";
import { useOptimisticBookmark } from "@/hooks/use-optimistic-bookmark";

interface AdvancedSearchDiscoveryProps {
  projects: Project[];
  onProjectSelect?: (project: Project) => void;
  className?: string;
}

export default function AdvancedSearchDiscovery({
  projects,
  onProjectSelect,
  className,
}: AdvancedSearchDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);

  // Search filters
  const [filters, setFilters] = useState<SearchQuery["filters"]>({
    languages: [],
    topics: [],
    minStars: undefined,
    maxStars: undefined,
    hasGoodFirstIssues: false,
  });

  // Results
  const [searchResults, setSearchResults] = useState<SemanticSearchResult[]>(
    []
  );
  const [clusters, setClusters] = useState<ProjectCluster[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<
    TrendingCategory[]
  >([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const { bookmarkedProjects, toggleBookmark } = useOptimisticBookmark();

  // Available filter options
  const availableLanguages = useMemo(() => {
    const languages = new Set(
      projects.map((p) => p.language).filter(Boolean) as string[]
    );
    return Array.from(languages).sort();
  }, [projects]);

  const availableTopics = useMemo(() => {
    const topics = new Set(projects.flatMap((p) => p.topics || []));
    return Array.from(topics).sort();
  }, [projects]);

  // Perform semantic search
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      const query: SearchQuery = {
        text: searchQuery,
        filters,
      };

      try {
        const results = SemanticSearchEngine.searchProjects(projects, query);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Search failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, filters, projects]);

  // Generate clusters
  useEffect(() => {
    if (activeTab === "clusters") {
      setIsLoading(true);
      try {
        const projectClusters =
          ProjectSimilarityEngine.createTopicClusters(projects);
        setClusters(projectClusters);
      } catch (error) {
        console.error("Clustering error:", error);
        toast.error("Failed to generate clusters.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [activeTab, projects]);

  // Generate trending projects
  useEffect(() => {
    if (activeTab === "trending") {
      setIsLoading(true);
      try {
        const trending = TrendingProjectsEngine.getTrendingByCategory(projects);
        setTrendingCategories(trending);
      } catch (error) {
        console.error("Trending analysis error:", error);
        toast.error("Failed to analyze trending projects.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [activeTab, projects]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFilters((prev) => ({
      ...prev,
      languages: prev?.languages?.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...(prev?.languages || []), language],
    }));
  };

  const handleTopicToggle = (topic: string) => {
    setFilters((prev) => ({
      ...prev,
      topics: prev?.topics?.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...(prev?.topics || []), topic],
    }));
  };

  const clearFilters = () => {
    setFilters({
      languages: [],
      topics: [],
      minStars: undefined,
      maxStars: undefined,
      hasGoodFirstIssues: false,
    });
  };

  const handleProjectAction = (
    project: Project,
    action: "bookmark" | "share" | "view"
  ) => {
    switch (action) {
      case "bookmark":
        toggleBookmark(project.id);
        break;
      case "share":
        if (navigator.share) {
          navigator.share({
            title: project.full_name,
            text: project.description,
            url: `${window.location.origin}/projects/${project.id}`,
          });
        } else {
          navigator.clipboard.writeText(
            `${window.location.origin}/projects/${project.id}`
          );
          toast.success("Project link copied to clipboard");
        }
        break;
      case "view":
        if (onProjectSelect) {
          onProjectSelect(project);
        } else {
          window.open(`/projects/${project.id}`, "_blank");
        }
        break;
    }
  };

  const renderProjectGrid = (projectList: Project[], title?: string) => (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {projectList.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EnhancedProjectCard
              project={project}
              viewMode={viewMode}
              isBookmarked={bookmarkedProjects.has(project.id)}
              onBookmark={() => handleProjectAction(project, "bookmark")}
              onShare={() => handleProjectAction(project, "share")}
              onQuickView={() => handleProjectAction(project, "view")}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Project Discovery</h2>
          <p className="text-muted-foreground">
            Discover projects with semantic search, clustering, and trending
            analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Semantic Search
          </TabsTrigger>
          <TabsTrigger value="clusters" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Topic Clusters
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
        </TabsList>

        {/* Semantic Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Intelligent Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for projects, technologies, or concepts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {availableLanguages.slice(0, 10).map((language) => (
                      <Badge
                        key={language}
                        variant={
                          filters?.languages?.includes(language)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer text-xs"
                        onClick={() => handleLanguageToggle(language)}
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Topics
                  </label>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {availableTopics.slice(0, 10).map((topic) => (
                      <Badge
                        key={topic}
                        variant={
                          filters?.topics?.includes(topic)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer text-xs"
                        onClick={() => handleTopicToggle(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Stars Range
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters?.minStars || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "minStars",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      className="text-xs"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters?.maxStars || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "maxStars",
                          parseInt(e.target.value) || undefined
                        )
                      }
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Options
                  </label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="good-first-issues"
                      checked={filters?.hasGoodFirstIssues || false}
                      onCheckedChange={(checked) =>
                        handleFilterChange("hasGoodFirstIssues", checked)
                      }
                    />
                    <label htmlFor="good-first-issues" className="text-xs">
                      Good First Issues
                    </label>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(filters?.languages?.length ||
                filters?.topics?.length ||
                filters?.minStars ||
                filters?.maxStars ||
                filters?.hasGoodFirstIssues) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Search Results */}
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Searching projects...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Search Results ({searchResults.length})
                </h3>
                <Badge variant="outline">Relevance Score</Badge>
              </div>
              {renderProjectGrid(searchResults.map((r) => r.project))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No projects found for "{searchQuery}"
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : null}
        </TabsContent>

        {/* Topic Clusters Tab */}
        <TabsContent value="clusters" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Analyzing project clusters...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cluster Overview */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clusters.map((cluster) => (
                  <Card
                    key={cluster.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedCluster === cluster.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCluster(
                        selectedCluster === cluster.id ? null : cluster.id
                      )
                    }
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {cluster.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {cluster.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Projects:</span>
                          <Badge variant="secondary">
                            {cluster.projects.length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Avg Stars:</span>
                          <span className="font-medium">
                            {cluster.averageStars.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Language:</span>
                          <Badge variant="outline">
                            {cluster.primaryLanguage}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {cluster.commonTopics.slice(0, 3).map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Cluster Projects */}
              {selectedCluster && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Separator />
                    {(() => {
                      const cluster = clusters.find(
                        (c) => c.id === selectedCluster
                      );
                      return cluster
                        ? renderProjectGrid(
                            cluster.projects,
                            `${cluster.name} Projects`
                          )
                        : null;
                    })()}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </TabsContent>

        {/* Trending Tab */}
        <TabsContent value="trending" className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Analyzing trending projects...
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {trendingCategories.map((category) => (
                <div key={category.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {category.timeframe}
                    </Badge>
                  </div>

                  {category.projects.length > 0 ? (
                    renderProjectGrid(category.projects)
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        No trending projects in this category
                      </p>
                    </div>
                  )}

                  {category.id !==
                    trendingCategories[trendingCategories.length - 1].id && (
                    <Separator />
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
