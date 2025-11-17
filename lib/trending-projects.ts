import { Project } from "./github-api";

export interface TrendingProject extends Project {
  trendingScore: number;
  trendingReason: TrendingReason;
  growthMetrics: GrowthMetrics;
}

export interface TrendingReason {
  type:
    | "rapid_growth"
    | "consistent_activity"
    | "community_buzz"
    | "recent_release"
    | "seasonal_trend";
  explanation: string;
  confidence: number;
}

export interface GrowthMetrics {
  starsGrowthRate: number; // Estimated daily growth
  forksGrowthRate: number;
  issuesActivity: number;
  recentActivity: boolean;
  communityEngagement: number;
}

export interface TrendingCategory {
  id: string;
  name: string;
  description: string;
  projects: TrendingProject[];
  timeframe: "daily" | "weekly" | "monthly";
}

/**
 * Trending Projects Engine for discovering popular and growing projects
 * Analyzes various metrics to identify trending projects across different timeframes
 */
export class TrendingProjectsEngine {
  private static readonly TRENDING_WEIGHTS = {
    stars_growth: 0.3,
    forks_growth: 0.2,
    recent_activity: 0.25,
    community_engagement: 0.15,
    freshness: 0.1,
  };

  /**
   * Get trending projects across different categories
   */
  static getTrendingProjects(
    projects: Project[],
    timeframe: "daily" | "weekly" | "monthly" = "weekly",
    limit: number = 50
  ): TrendingProject[] {
    return projects
      .map((project) => this.calculateTrendingScore(project, timeframe))
      .filter((project) => project.trendingScore > 0.3)
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  /**
   * Get trending projects by category
   */
  static getTrendingByCategory(projects: Project[]): TrendingCategory[] {
    const categories: TrendingCategory[] = [
      {
        id: "hot",
        name: "Hot Right Now",
        description: "Projects with rapid recent growth",
        projects: [],
        timeframe: "daily",
      },
      {
        id: "rising",
        name: "Rising Stars",
        description: "Consistently growing projects",
        projects: [],
        timeframe: "weekly",
      },
      {
        id: "established",
        name: "Trending Established",
        description: "Popular projects with renewed interest",
        projects: [],
        timeframe: "monthly",
      },
    ];

    // Get trending projects for each timeframe
    const dailyTrending = this.getTrendingProjects(projects, "daily", 15);
    const weeklyTrending = this.getTrendingProjects(projects, "weekly", 15);
    const monthlyTrending = this.getTrendingProjects(projects, "monthly", 15);

    categories[0].projects = dailyTrending;
    categories[1].projects = weeklyTrending;
    categories[2].projects = monthlyTrending;

    return categories;
  }

  /**
   * Calculate trending score for a project
   */
  private static calculateTrendingScore(
    project: Project,
    timeframe: "daily" | "weekly" | "monthly"
  ): TrendingProject {
    const growthMetrics = this.estimateGrowthMetrics(project, timeframe);
    const { score, reason } = this.calculateScore(
      project,
      growthMetrics,
      timeframe
    );

    return {
      ...project,
      trendingScore: score,
      trendingReason: reason,
      growthMetrics,
    };
  }

  /**
   * Estimate growth metrics based on available data
   */
  private static estimateGrowthMetrics(
    project: Project,
    timeframe: "daily" | "weekly" | "monthly"
  ): GrowthMetrics {
    const stars = project.stargazers_count || 0;
    const forks = project.forks_count || 0;
    const issues = project.open_issues_count || 0;
    const updatedAt = new Date(project.updated_at);
    const createdAt = project.created_at
      ? new Date(project.created_at)
      : updatedAt;

    // Calculate project age in days
    const ageInDays = Math.max(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      1
    );

    // Calculate days since last update
    const daysSinceUpdate =
      (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

    // Estimate growth rates (simplified calculation)
    const starsGrowthRate = stars / ageInDays;
    const forksGrowthRate = forks / ageInDays;

    // Recent activity indicator
    const recentActivity = daysSinceUpdate < this.getTimeframeDays(timeframe);

    // Community engagement score
    const communityEngagement = this.calculateCommunityEngagement(project);

    // Issues activity (normalized)
    const issuesActivity = Math.min(issues / 100, 1);

    return {
      starsGrowthRate,
      forksGrowthRate,
      issuesActivity,
      recentActivity,
      communityEngagement,
    };
  }

  /**
   * Calculate overall trending score
   */
  private static calculateScore(
    project: Project,
    metrics: GrowthMetrics,
    timeframe: "daily" | "weekly" | "monthly"
  ): { score: number; reason: TrendingReason } {
    let score = 0;
    let primaryReason: TrendingReason["type"] = "consistent_activity";
    let explanation = "";
    let confidence = 0;

    // Stars growth component
    const starsComponent =
      Math.min(metrics.starsGrowthRate * 10, 1) *
      this.TRENDING_WEIGHTS.stars_growth;
    score += starsComponent;

    // Forks growth component
    const forksComponent =
      Math.min(metrics.forksGrowthRate * 20, 1) *
      this.TRENDING_WEIGHTS.forks_growth;
    score += forksComponent;

    // Recent activity component
    const activityComponent = metrics.recentActivity ? 1 : 0.3;
    score += activityComponent * this.TRENDING_WEIGHTS.recent_activity;

    // Community engagement component
    score +=
      metrics.communityEngagement * this.TRENDING_WEIGHTS.community_engagement;

    // Freshness component (newer projects get slight boost)
    const createdAt = project.created_at
      ? new Date(project.created_at)
      : new Date(project.updated_at);
    const ageInDays =
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const freshnessBoost =
      Math.max(0, (365 - ageInDays) / 365) * this.TRENDING_WEIGHTS.freshness;
    score += freshnessBoost;

    // Determine primary reason and explanation
    if (metrics.starsGrowthRate > 5) {
      primaryReason = "rapid_growth";
      explanation = `Gaining ${Math.round(
        metrics.starsGrowthRate
      )} stars per day`;
      confidence = 0.9;
    } else if (metrics.recentActivity && metrics.communityEngagement > 0.7) {
      primaryReason = "community_buzz";
      explanation = "High community engagement and recent activity";
      confidence = 0.8;
    } else if (ageInDays < 90 && project.stargazers_count > 100) {
      primaryReason = "recent_release";
      explanation = "New project gaining traction quickly";
      confidence = 0.7;
    } else if (metrics.recentActivity) {
      primaryReason = "consistent_activity";
      explanation = "Consistently maintained with regular updates";
      confidence = 0.6;
    } else {
      primaryReason = "seasonal_trend";
      explanation = "Showing renewed interest";
      confidence = 0.5;
    }

    // Apply timeframe-specific adjustments
    score *= this.getTimeframeMultiplier(timeframe, metrics);

    return {
      score: Math.min(score, 1),
      reason: {
        type: primaryReason,
        explanation,
        confidence,
      },
    };
  }

  /**
   * Calculate community engagement score
   */
  private static calculateCommunityEngagement(project: Project): number {
    const stars = project.stargazers_count || 0;
    const forks = project.forks_count || 0;
    const issues = project.open_issues_count || 0;

    // Normalize metrics
    const normalizedStars = Math.min(stars / 1000, 1);
    const normalizedForks = Math.min(forks / 200, 1);
    const normalizedIssues = Math.min(issues / 50, 1);

    // Calculate engagement ratio (forks and issues relative to stars)
    const forkRatio = stars > 0 ? Math.min(forks / stars, 0.5) : 0;
    const issueRatio = stars > 0 ? Math.min(issues / stars, 0.3) : 0;

    // Combine metrics
    return (
      normalizedStars * 0.4 +
      normalizedForks * 0.3 +
      normalizedIssues * 0.2 +
      forkRatio * 0.1
    );
  }

  /**
   * Get timeframe multiplier for scoring
   */
  private static getTimeframeMultiplier(
    timeframe: "daily" | "weekly" | "monthly",
    metrics: GrowthMetrics
  ): number {
    switch (timeframe) {
      case "daily":
        // Favor very recent activity and rapid growth
        return metrics.recentActivity ? 1.2 : 0.5;
      case "weekly":
        // Balanced approach
        return 1.0;
      case "monthly":
        // Favor established projects with sustained growth
        return metrics.communityEngagement > 0.5 ? 1.1 : 0.8;
      default:
        return 1.0;
    }
  }

  /**
   * Get number of days for timeframe
   */
  private static getTimeframeDays(
    timeframe: "daily" | "weekly" | "monthly"
  ): number {
    switch (timeframe) {
      case "daily":
        return 1;
      case "weekly":
        return 7;
      case "monthly":
        return 30;
      default:
        return 7;
    }
  }

  /**
   * Get trending projects by language
   */
  static getTrendingByLanguage(
    projects: Project[],
    language: string,
    limit: number = 10
  ): TrendingProject[] {
    return projects
      .filter(
        (project) => project.language?.toLowerCase() === language.toLowerCase()
      )
      .map((project) => this.calculateTrendingScore(project, "weekly"))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  /**
   * Get trending projects by topic
   */
  static getTrendingByTopic(
    projects: Project[],
    topic: string,
    limit: number = 10
  ): TrendingProject[] {
    return projects
      .filter((project) =>
        (project.topics || []).some((t) =>
          t.toLowerCase().includes(topic.toLowerCase())
        )
      )
      .map((project) => this.calculateTrendingScore(project, "weekly"))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  /**
   * Get projects trending for beginners
   */
  static getTrendingForBeginners(
    projects: Project[],
    limit: number = 15
  ): TrendingProject[] {
    const beginnerFriendlyTopics = [
      "good-first-issue",
      "beginner-friendly",
      "help-wanted",
      "hacktoberfest",
      "first-timers-only",
    ];

    return projects
      .filter((project) => {
        const hasBeginnerTopics = (project.topics || []).some((topic) =>
          beginnerFriendlyTopics.includes(topic.toLowerCase())
        );
        const reasonableSize = (project.stargazers_count || 0) < 10000;
        const hasIssues = (project.open_issues_count || 0) > 5;

        return hasBeginnerTopics || (reasonableSize && hasIssues);
      })
      .map((project) => this.calculateTrendingScore(project, "weekly"))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit);
  }

  /**
   * Get seasonal trending projects (e.g., holiday themes, academic calendar)
   */
  static getSeasonalTrending(projects: Project[]): TrendingProject[] {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12

    let seasonalTopics: string[] = [];

    // Define seasonal topics
    if (month >= 9 && month <= 11) {
      // Fall: Back to school, Hacktoberfest
      seasonalTopics = ["education", "learning", "tutorial", "hacktoberfest"];
    } else if (month >= 12 || month <= 2) {
      // Winter: Year-end projects, planning tools
      seasonalTopics = ["planning", "productivity", "year-in-review", "goals"];
    } else if (month >= 3 && month <= 5) {
      // Spring: New projects, fresh starts
      seasonalTopics = ["startup", "new", "fresh", "innovation"];
    } else {
      // Summer: Fun projects, games, experiments
      seasonalTopics = ["game", "fun", "experiment", "creative"];
    }

    return projects
      .filter((project) => {
        const projectTopics = (project.topics || []).map((t) =>
          t.toLowerCase()
        );
        const description = (project.description || "").toLowerCase();

        return seasonalTopics.some(
          (topic) =>
            projectTopics.includes(topic) || description.includes(topic)
        );
      })
      .map((project) => this.calculateTrendingScore(project, "monthly"))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 20);
  }

  /**
   * Get trending projects summary for dashboard
   */
  static getTrendingSummary(projects: Project[]): {
    hotProjects: TrendingProject[];
    risingStars: TrendingProject[];
    topLanguages: { language: string; count: number; growth: number }[];
    topTopics: { topic: string; count: number; projects: number }[];
  } {
    const trending = this.getTrendingProjects(projects, "weekly", 100);

    // Hot projects (top 5)
    const hotProjects = trending.slice(0, 5);

    // Rising stars (newer projects with good growth)
    const risingStars = trending
      .filter((project) => {
        const createdAt = project.created_at
          ? new Date(project.created_at)
          : new Date();
        const ageInDays =
          (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        return ageInDays < 365 && project.trendingScore > 0.5;
      })
      .slice(0, 5);

    // Top languages
    const languageStats = new Map<
      string,
      { count: number; totalScore: number }
    >();
    trending.forEach((project) => {
      if (project.language) {
        const current = languageStats.get(project.language) || {
          count: 0,
          totalScore: 0,
        };
        languageStats.set(project.language, {
          count: current.count + 1,
          totalScore: current.totalScore + project.trendingScore,
        });
      }
    });

    const topLanguages = Array.from(languageStats.entries())
      .map(([language, stats]) => ({
        language,
        count: stats.count,
        growth: stats.totalScore / stats.count,
      }))
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 10);

    // Top topics
    const topicStats = new Map<string, number>();
    trending.forEach((project) => {
      (project.topics || []).forEach((topic) => {
        topicStats.set(topic, (topicStats.get(topic) || 0) + 1);
      });
    });

    const topTopics = Array.from(topicStats.entries())
      .map(([topic, count]) => ({
        topic,
        count,
        projects: count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return {
      hotProjects,
      risingStars,
      topLanguages,
      topTopics,
    };
  }
}
