import { Project } from "./github-api";

export interface SimilarityScore {
  projectId: number;
  score: number;
  reasons: SimilarityReason[];
}

export interface SimilarityReason {
  type: "language" | "topics" | "size" | "activity" | "description";
  weight: number;
  explanation: string;
}

export interface ProjectCluster {
  id: string;
  name: string;
  description: string;
  projects: Project[];
  commonTopics: string[];
  averageStars: number;
  primaryLanguage: string;
}

/**
 * Project Similarity Engine for finding related projects
 * Uses multiple similarity metrics to identify related projects
 */
export class ProjectSimilarityEngine {
  private static readonly WEIGHTS = {
    language: 0.25,
    topics: 0.35,
    size: 0.15,
    activity: 0.15,
    description: 0.1,
  };

  /**
   * Find similar projects to a given project
   */
  static findSimilarProjects(
    targetProject: Project,
    candidateProjects: Project[],
    limit: number = 10
  ): SimilarityScore[] {
    return candidateProjects
      .filter((project) => project.id !== targetProject.id)
      .map((project) => this.calculateSimilarity(targetProject, project))
      .filter((score) => score.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * Calculate similarity score between two projects
   */
  private static calculateSimilarity(
    project1: Project,
    project2: Project
  ): SimilarityScore {
    const reasons: SimilarityReason[] = [];
    let totalScore = 0;

    // Language similarity
    const languageScore = this.calculateLanguageSimilarity(project1, project2);
    if (languageScore.weight > 0) {
      totalScore += languageScore.weight * this.WEIGHTS.language;
      reasons.push(languageScore);
    }

    // Topic similarity
    const topicScore = this.calculateTopicSimilarity(project1, project2);
    if (topicScore.weight > 0) {
      totalScore += topicScore.weight * this.WEIGHTS.topics;
      reasons.push(topicScore);
    }

    // Size similarity (stars, forks)
    const sizeScore = this.calculateSizeSimilarity(project1, project2);
    if (sizeScore.weight > 0) {
      totalScore += sizeScore.weight * this.WEIGHTS.size;
      reasons.push(sizeScore);
    }

    // Activity similarity
    const activityScore = this.calculateActivitySimilarity(project1, project2);
    if (activityScore.weight > 0) {
      totalScore += activityScore.weight * this.WEIGHTS.activity;
      reasons.push(activityScore);
    }

    // Description similarity
    const descriptionScore = this.calculateDescriptionSimilarity(
      project1,
      project2
    );
    if (descriptionScore.weight > 0) {
      totalScore += descriptionScore.weight * this.WEIGHTS.description;
      reasons.push(descriptionScore);
    }

    return {
      projectId: project2.id,
      score: Math.min(totalScore, 1),
      reasons: reasons.sort((a, b) => b.weight - a.weight),
    };
  }

  /**
   * Calculate language similarity
   */
  private static calculateLanguageSimilarity(
    project1: Project,
    project2: Project
  ): SimilarityReason {
    const lang1 = project1.language?.toLowerCase();
    const lang2 = project2.language?.toLowerCase();

    if (!lang1 || !lang2) {
      return {
        type: "language",
        weight: 0,
        explanation: "",
      };
    }

    // Exact match
    if (lang1 === lang2) {
      return {
        type: "language",
        weight: 1,
        explanation: `Both written in ${project1.language}`,
      };
    }

    // Related languages
    const relatedLanguages: Record<string, string[]> = {
      javascript: ["typescript", "coffeescript"],
      typescript: ["javascript"],
      python: ["cython"],
      "c++": ["c", "c#"],
      c: ["c++", "c#"],
      java: ["kotlin", "scala"],
      kotlin: ["java"],
      swift: ["objective-c"],
      rust: ["c++", "c"],
      go: ["c", "rust"],
    };

    const related =
      relatedLanguages[lang1]?.includes(lang2) ||
      relatedLanguages[lang2]?.includes(lang1);

    if (related) {
      return {
        type: "language",
        weight: 0.6,
        explanation: `Related languages: ${project1.language} and ${project2.language}`,
      };
    }

    return {
      type: "language",
      weight: 0,
      explanation: "",
    };
  }

  /**
   * Calculate topic similarity using Jaccard similarity
   */
  private static calculateTopicSimilarity(
    project1: Project,
    project2: Project
  ): SimilarityReason {
    const topics1 = new Set(project1.topics || []);
    const topics2 = new Set(project2.topics || []);

    if (topics1.size === 0 && topics2.size === 0) {
      return {
        type: "topics",
        weight: 0,
        explanation: "",
      };
    }

    // Calculate Jaccard similarity
    const intersection = new Set([...topics1].filter((x) => topics2.has(x)));
    const union = new Set([...topics1, ...topics2]);

    const jaccardSimilarity = intersection.size / union.size;

    if (jaccardSimilarity > 0) {
      const commonTopics = Array.from(intersection).slice(0, 3);
      return {
        type: "topics",
        weight: jaccardSimilarity,
        explanation: `Share topics: ${commonTopics.join(", ")}`,
      };
    }

    return {
      type: "topics",
      weight: 0,
      explanation: "",
    };
  }

  /**
   * Calculate size similarity based on stars and forks
   */
  private static calculateSizeSimilarity(
    project1: Project,
    project2: Project
  ): SimilarityReason {
    const stars1 = project1.stargazers_count || 0;
    const stars2 = project2.stargazers_count || 0;
    const forks1 = project1.forks_count || 0;
    const forks2 = project2.forks_count || 0;

    // Normalize to same scale (log scale for large numbers)
    const normalizeSize = (stars: number, forks: number) => {
      return Math.log10(Math.max(stars + forks * 2, 1));
    };

    const size1 = normalizeSize(stars1, forks1);
    const size2 = normalizeSize(stars2, forks2);

    // Calculate similarity (inverse of difference)
    const maxSize = Math.max(size1, size2);
    const minSize = Math.min(size1, size2);

    if (maxSize === 0)
      return {
        type: "size",
        weight: 0,
        explanation: "",
      };

    const similarity = minSize / maxSize;

    if (similarity > 0.5) {
      const category = this.getSizeCategory(Math.max(stars1, stars2));
      return {
        type: "size",
        weight: similarity,
        explanation: `Similar project size (${category})`,
      };
    }

    return {
      type: "size",
      weight: 0,
      explanation: "",
    };
  }

  /**
   * Calculate activity similarity based on recent updates and issues
   */
  private static calculateActivitySimilarity(
    project1: Project,
    project2: Project
  ): SimilarityReason {
    const updated1 = new Date(project1.updated_at);
    const updated2 = new Date(project2.updated_at);
    const issues1 = project1.open_issues_count || 0;
    const issues2 = project2.open_issues_count || 0;

    // Calculate days since last update
    const daysSinceUpdate1 =
      (Date.now() - updated1.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceUpdate2 =
      (Date.now() - updated2.getTime()) / (1000 * 60 * 60 * 24);

    // Both recently active (within 30 days)
    if (daysSinceUpdate1 < 30 && daysSinceUpdate2 < 30) {
      return {
        type: "activity",
        weight: 0.8,
        explanation: "Both actively maintained",
      };
    }

    // Both moderately active (within 90 days)
    if (daysSinceUpdate1 < 90 && daysSinceUpdate2 < 90) {
      return {
        type: "activity",
        weight: 0.6,
        explanation: "Both regularly updated",
      };
    }

    // Similar issue activity
    const issueRatio =
      Math.min(issues1, issues2) / Math.max(issues1, issues2, 1);
    if (issueRatio > 0.5 && Math.max(issues1, issues2) > 10) {
      return {
        type: "activity",
        weight: 0.4,
        explanation: "Similar community engagement",
      };
    }

    return {
      type: "activity",
      weight: 0,
      explanation: "",
    };
  }

  /**
   * Calculate description similarity using simple text analysis
   */
  private static calculateDescriptionSimilarity(
    project1: Project,
    project2: Project
  ): SimilarityReason {
    const desc1 = (project1.description || "").toLowerCase();
    const desc2 = (project2.description || "").toLowerCase();

    if (!desc1 || !desc2) {
      return {
        type: "description",
        weight: 0,
        explanation: "",
      };
    }

    // Extract keywords (remove common words)
    const commonWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
    ]);

    const extractKeywords = (text: string) => {
      return text
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !commonWords.has(word))
        .slice(0, 10);
    };

    const keywords1 = new Set(extractKeywords(desc1));
    const keywords2 = new Set(extractKeywords(desc2));

    if (keywords1.size === 0 || keywords2.size === 0) {
      return {
        type: "description",
        weight: 0,
        explanation: "",
      };
    }

    // Calculate keyword overlap
    const intersection = new Set(
      [...keywords1].filter((x) => keywords2.has(x))
    );
    const union = new Set([...keywords1, ...keywords2]);

    const similarity = intersection.size / union.size;

    if (similarity > 0.2) {
      const commonKeywords = Array.from(intersection).slice(0, 2);
      return {
        type: "description",
        weight: similarity,
        explanation: `Similar purpose: ${commonKeywords.join(", ")}`,
      };
    }

    return {
      type: "description",
      weight: 0,
      explanation: "",
    };
  }

  /**
   * Get size category for a project
   */
  private static getSizeCategory(stars: number): string {
    if (stars < 100) return "small";
    if (stars < 1000) return "medium";
    if (stars < 10000) return "large";
    return "very large";
  }

  /**
   * Create topic-based clusters of projects
   */
  static createTopicClusters(projects: Project[]): ProjectCluster[] {
    const topicGroups = new Map<string, Project[]>();

    // Group projects by primary topic
    projects.forEach((project) => {
      const topics = project.topics || [];
      if (topics.length > 0) {
        const primaryTopic = topics[0]; // Use first topic as primary
        if (!topicGroups.has(primaryTopic)) {
          topicGroups.set(primaryTopic, []);
        }
        topicGroups.get(primaryTopic)!.push(project);
      }
    });

    // Create clusters from groups with sufficient projects
    const clusters: ProjectCluster[] = [];
    let clusterId = 0;

    topicGroups.forEach((projectList, topic) => {
      if (projectList.length >= 3) {
        // Minimum cluster size
        const commonTopics = this.findCommonTopics(projectList);
        const averageStars =
          projectList.reduce((sum, p) => sum + (p.stargazers_count || 0), 0) /
          projectList.length;
        const primaryLanguage = this.findPrimaryLanguage(projectList);

        clusters.push({
          id: `cluster-${clusterId++}`,
          name: this.formatTopicName(topic),
          description: `Projects focused on ${topic}`,
          projects: projectList.sort(
            (a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)
          ),
          commonTopics,
          averageStars: Math.round(averageStars),
          primaryLanguage,
        });
      }
    });

    return clusters.sort((a, b) => b.averageStars - a.averageStars);
  }

  /**
   * Find common topics across projects in a cluster
   */
  private static findCommonTopics(projects: Project[]): string[] {
    const topicCounts = new Map<string, number>();

    projects.forEach((project) => {
      (project.topics || []).forEach((topic) => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    // Return topics that appear in at least 50% of projects
    const threshold = Math.ceil(projects.length * 0.5);
    return Array.from(topicCounts.entries())
      .filter(([_, count]) => count >= threshold)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, _]) => topic)
      .slice(0, 5);
  }

  /**
   * Find primary language for a cluster
   */
  private static findPrimaryLanguage(projects: Project[]): string {
    const languageCounts = new Map<string, number>();

    projects.forEach((project) => {
      if (project.language) {
        languageCounts.set(
          project.language,
          (languageCounts.get(project.language) || 0) + 1
        );
      }
    });

    if (languageCounts.size === 0) return "Mixed";

    const [primaryLanguage] = Array.from(languageCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return primaryLanguage;
  }

  /**
   * Format topic name for display
   */
  private static formatTopicName(topic: string): string {
    return topic
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Get projects similar to user's interests
   */
  static getProjectsForInterests(
    projects: Project[],
    userInterests: string[],
    limit: number = 20
  ): Project[] {
    const interestSet = new Set(userInterests.map((i) => i.toLowerCase()));

    return projects
      .filter((project) => {
        const projectTopics = (project.topics || []).map((t) =>
          t.toLowerCase()
        );
        return projectTopics.some((topic) => interestSet.has(topic));
      })
      .sort((a, b) => {
        // Sort by relevance to interests and popularity
        const aRelevance = (a.topics || []).filter((t) =>
          interestSet.has(t.toLowerCase())
        ).length;
        const bRelevance = (b.topics || []).filter((t) =>
          interestSet.has(t.toLowerCase())
        ).length;

        if (aRelevance !== bRelevance) {
          return bRelevance - aRelevance;
        }

        return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      })
      .slice(0, limit);
  }
}
