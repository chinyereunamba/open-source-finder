import { Project } from "./github-api";

export interface SemanticSearchResult {
  project: Project;
  relevanceScore: number;
  matchedTerms: string[];
  semanticMatches: string[];
}

export interface SearchQuery {
  text: string;
  filters?: {
    languages?: string[];
    topics?: string[];
    difficulty?: "beginner" | "intermediate" | "advanced";
    minStars?: number;
    maxStars?: number;
    hasGoodFirstIssues?: boolean;
  };
}

/**
 * Semantic Search Engine for intelligent project discovery
 * Uses text similarity and contextual matching beyond simple keyword search
 */
export class SemanticSearchEngine {
  private static readonly SYNONYMS: Record<string, string[]> = {
    // Programming concepts
    frontend: ["front-end", "ui", "user-interface", "client-side", "web-ui"],
    backend: ["back-end", "server-side", "api", "server", "service"],
    fullstack: ["full-stack", "end-to-end", "complete"],
    mobile: ["android", "ios", "react-native", "flutter", "app"],
    web: ["website", "webapp", "web-app", "browser", "html"],
    api: ["rest", "graphql", "endpoint", "service", "microservice"],
    database: ["db", "sql", "nosql", "storage", "data"],
    ai: ["artificial-intelligence", "machine-learning", "ml", "deep-learning"],
    devops: ["deployment", "ci-cd", "docker", "kubernetes", "infrastructure"],

    // Skill levels
    beginner: ["starter", "newbie", "entry-level", "basic", "simple"],
    intermediate: ["medium", "moderate", "standard"],
    advanced: ["expert", "complex", "sophisticated", "professional"],

    // Project types
    library: ["framework", "package", "module", "component"],
    tool: ["utility", "cli", "command-line", "helper"],
    tutorial: ["guide", "example", "demo", "learning", "educational"],
    game: ["gaming", "entertainment", "fun"],
  };

  private static readonly TOPIC_CLUSTERS: Record<string, string[]> = {
    "web-development": [
      "react",
      "vue",
      "angular",
      "svelte",
      "nextjs",
      "nuxt",
      "gatsby",
      "html",
      "css",
      "javascript",
      "typescript",
      "sass",
      "tailwind",
    ],
    "mobile-development": [
      "react-native",
      "flutter",
      "ionic",
      "cordova",
      "xamarin",
      "android",
      "ios",
      "swift",
      "kotlin",
      "java",
    ],
    "backend-development": [
      "nodejs",
      "express",
      "fastify",
      "nestjs",
      "django",
      "flask",
      "spring",
      "rails",
      "laravel",
      "php",
      "python",
      "java",
      "go",
      "rust",
    ],
    "data-science": [
      "python",
      "jupyter",
      "pandas",
      "numpy",
      "scikit-learn",
      "tensorflow",
      "pytorch",
      "keras",
      "data-analysis",
      "visualization",
      "matplotlib",
    ],
    devops: [
      "docker",
      "kubernetes",
      "terraform",
      "ansible",
      "jenkins",
      "ci-cd",
      "aws",
      "azure",
      "gcp",
      "monitoring",
      "logging",
    ],
    "machine-learning": [
      "tensorflow",
      "pytorch",
      "scikit-learn",
      "keras",
      "opencv",
      "nlp",
      "computer-vision",
      "deep-learning",
      "neural-networks",
    ],
    "game-development": [
      "unity",
      "unreal",
      "godot",
      "phaser",
      "three.js",
      "webgl",
      "c#",
      "c++",
      "lua",
      "game-engine",
    ],
    blockchain: [
      "ethereum",
      "bitcoin",
      "solidity",
      "web3",
      "defi",
      "nft",
      "smart-contracts",
      "cryptocurrency",
      "blockchain",
    ],
  };

  /**
   * Perform semantic search on projects
   */
  static searchProjects(
    projects: Project[],
    query: SearchQuery
  ): SemanticSearchResult[] {
    const searchTerms = this.extractSearchTerms(query.text);
    const expandedTerms = this.expandSearchTerms(searchTerms);

    const results = projects
      .map((project) => this.scoreProject(project, expandedTerms, query))
      .filter((result) => result.relevanceScore > 0.1)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return results;
  }

  /**
   * Extract and normalize search terms from query
   */
  private static extractSearchTerms(query: string): string[] {
    return query
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((term) => term.length > 2)
      .map((term) => term.trim());
  }

  /**
   * Expand search terms with synonyms and related concepts
   */
  private static expandSearchTerms(terms: string[]): string[] {
    const expanded = new Set(terms);

    terms.forEach((term) => {
      // Add synonyms
      Object.entries(this.SYNONYMS).forEach(([key, synonyms]) => {
        if (key === term || synonyms.includes(term)) {
          expanded.add(key);
          synonyms.forEach((synonym) => expanded.add(synonym));
        }
      });

      // Add related terms from topic clusters
      Object.entries(this.TOPIC_CLUSTERS).forEach(([cluster, topics]) => {
        if (topics.includes(term)) {
          topics.forEach((topic) => expanded.add(topic));
        }
      });
    });

    return Array.from(expanded);
  }

  /**
   * Score a project against search terms
   */
  private static scoreProject(
    project: Project,
    searchTerms: string[],
    query: SearchQuery
  ): SemanticSearchResult {
    let score = 0;
    const matchedTerms: string[] = [];
    const semanticMatches: string[] = [];

    // Create searchable text from project
    const searchableText = [
      project.name,
      project.full_name,
      project.description || "",
      project.language || "",
      ...(project.topics || []),
    ]
      .join(" ")
      .toLowerCase();

    // Direct term matching (highest weight)
    searchTerms.forEach((term) => {
      if (searchableText.includes(term)) {
        const weight = this.getTermWeight(term, project);
        score += weight;

        if (this.isDirectMatch(term, project)) {
          matchedTerms.push(term);
        } else {
          semanticMatches.push(term);
        }
      }
    });

    // Apply filters
    if (query.filters) {
      score *= this.applyFilters(project, query.filters);
    }

    // Boost popular projects slightly
    const popularityBoost = Math.min(
      (project.stargazers_count || 0) / 10000,
      0.2
    );
    score += popularityBoost;

    // Boost recently updated projects
    const updatedAt = new Date(project.updated_at);
    const daysSinceUpdate =
      (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    const freshnessBoost = Math.max(0, ((365 - daysSinceUpdate) / 365) * 0.1);
    score += freshnessBoost;

    return {
      project,
      relevanceScore: Math.min(score, 1),
      matchedTerms,
      semanticMatches,
    };
  }

  /**
   * Get weight for a search term based on where it matches
   */
  private static getTermWeight(term: string, project: Project): number {
    const name = project.name.toLowerCase();
    const fullName = project.full_name.toLowerCase();
    const description = (project.description || "").toLowerCase();
    const language = (project.language || "").toLowerCase();
    const topics = (project.topics || []).map((t) => t.toLowerCase());

    // Exact name match gets highest weight
    if (name === term || fullName.includes(`/${term}`)) return 0.8;

    // Name contains term
    if (name.includes(term)) return 0.6;

    // Language match
    if (language === term) return 0.5;

    // Topic match
    if (topics.includes(term)) return 0.4;

    // Description match
    if (description.includes(term)) return 0.3;

    return 0.1;
  }

  /**
   * Check if term is a direct match (not semantic)
   */
  private static isDirectMatch(term: string, project: Project): boolean {
    const searchableText = [
      project.name,
      project.full_name,
      project.language || "",
      ...(project.topics || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.split(/\s+/).includes(term);
  }

  /**
   * Apply search filters to project score
   */
  private static applyFilters(
    project: Project,
    filters: NonNullable<SearchQuery["filters"]>
  ): number {
    let multiplier = 1;

    // Language filter
    if (filters.languages && filters.languages.length > 0) {
      const hasLanguage = filters.languages.some(
        (lang) => lang.toLowerCase() === (project.language || "").toLowerCase()
      );
      if (!hasLanguage) multiplier *= 0.1;
    }

    // Topic filter
    if (filters.topics && filters.topics.length > 0) {
      const hasTopics = filters.topics.some((topic) =>
        (project.topics || []).includes(topic)
      );
      if (!hasTopics) multiplier *= 0.3;
    }

    // Stars filter
    const stars = project.stargazers_count || 0;
    if (filters.minStars && stars < filters.minStars) multiplier *= 0.2;
    if (filters.maxStars && stars > filters.maxStars) multiplier *= 0.5;

    // Good first issues filter
    if (filters.hasGoodFirstIssues) {
      const hasGoodFirstIssues = (project.topics || []).some((topic) =>
        ["good-first-issue", "beginner-friendly", "help-wanted"].includes(topic)
      );
      if (!hasGoodFirstIssues) multiplier *= 0.3;
    }

    return multiplier;
  }

  /**
   * Get search suggestions based on partial query
   */
  static getSearchSuggestions(
    partialQuery: string,
    projects: Project[]
  ): string[] {
    const query = partialQuery.toLowerCase();
    const suggestions = new Set<string>();

    // Add matching project names
    projects.forEach((project) => {
      if (project.name.toLowerCase().includes(query)) {
        suggestions.add(project.name);
      }
      if (project.full_name.toLowerCase().includes(query)) {
        suggestions.add(project.full_name);
      }
    });

    // Add matching languages
    const languages = new Set(
      projects.map((p) => p.language).filter(Boolean) as string[]
    );
    languages.forEach((lang) => {
      if (lang.toLowerCase().includes(query)) {
        suggestions.add(lang);
      }
    });

    // Add matching topics
    const topics = new Set(projects.flatMap((p) => p.topics || []));
    topics.forEach((topic) => {
      if (topic.toLowerCase().includes(query)) {
        suggestions.add(topic);
      }
    });

    // Add synonym matches
    Object.entries(this.SYNONYMS).forEach(([key, synonyms]) => {
      if (key.includes(query)) {
        suggestions.add(key);
      }
      synonyms.forEach((synonym) => {
        if (synonym.includes(query)) {
          suggestions.add(synonym);
        }
      });
    });

    return Array.from(suggestions).slice(0, 10);
  }

  /**
   * Get topic cluster for a given topic
   */
  static getTopicCluster(topic: string): string | null {
    const normalizedTopic = topic.toLowerCase();

    for (const [cluster, topics] of Object.entries(this.TOPIC_CLUSTERS)) {
      if (topics.includes(normalizedTopic)) {
        return cluster;
      }
    }

    return null;
  }

  /**
   * Get related topics for a given topic
   */
  static getRelatedTopics(topic: string): string[] {
    const cluster = this.getTopicCluster(topic);
    if (!cluster) return [];

    return this.TOPIC_CLUSTERS[cluster].filter(
      (t) => t !== topic.toLowerCase()
    );
  }
}
