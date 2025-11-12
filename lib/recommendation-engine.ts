import { Project } from "./github-api";

export type RecommendationReasonType =
  | "language_match"
  | "topic_interest"
  | "difficulty_level"
  | "community_activity"
  | "similar_projects"
  | "trending";

export interface RecommendationReason {
  type: RecommendationReasonType;
  confidence: number;
  explanation: string;
}

export interface UserPreferences {
  preferredLanguages: string[];
  interests: string[];
  skillLevel: "beginner" | "intermediate" | "advanced";
  viewedProjects: number[];
  bookmarkedProjects: number[];
  contributedProjects: number[];
}

export interface RecommendedProject extends Project {
  recommendationScore: number;
  reasons: RecommendationReason[];
}

export interface FeedbackData {
  projectId: number;
  userId: string;
  feedbackType: "interested" | "not_interested" | "dismissed";
  timestamp: Date;
}

/**
 * Recommendation Engine for personalized project suggestions
 * Uses a scoring algorithm based on user preferences and behavior
 */
export class RecommendationEngine {
  private static readonly WEIGHTS = {
    language_match: 0.3,
    topic_interest: 0.25,
    difficulty_level: 0.2,
    community_activity: 0.15,
    similar_projects: 0.1,
  };

  /**
   * Generate personalized project recommendations
   */
  static async generateRecommendations(
    projects: Project[],
    userPreferences: UserPreferences,
    limit: number = 10
  ): Promise<RecommendedProject[]> {
    const scoredProjects = projects
      .filter(
        (project) =>
          !userPreferences.viewedProjects.includes(project.id) ||
          userPreferences.bookmarkedProjects.includes(project.id)
      )
      .map((project) => {
        const { score, reasons } = this.calculateRecommendationScore(
          project,
          userPreferences
        );
        return {
          ...project,
          recommendationScore: score,
          reasons,
        };
      })
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);

    return scoredProjects;
  }

  /**
   * Calculate recommendation score for a project
   */
  private static calculateRecommendationScore(
    project: Project,
    preferences: UserPreferences
  ): { score: number; reasons: RecommendationReason[] } {
    const reasons: RecommendationReason[] = [];
    let totalScore = 0;

    // Language match scoring
    const languageScore = this.scoreLanguageMatch(project, preferences);
    if (languageScore.score > 0) {
      totalScore += languageScore.score * this.WEIGHTS.language_match;
      reasons.push(languageScore.reason);
    }

    // Topic interest scoring
    const topicScore = this.scoreTopicInterest(project, preferences);
    if (topicScore.score > 0) {
      totalScore += topicScore.score * this.WEIGHTS.topic_interest;
      reasons.push(topicScore.reason);
    }

    // Difficulty level scoring
    const difficultyScore = this.scoreDifficultyLevel(project, preferences);
    if (difficultyScore.score > 0) {
      totalScore += difficultyScore.score * this.WEIGHTS.difficulty_level;
      reasons.push(difficultyScore.reason);
    }

    // Community activity scoring
    const activityScore = this.scoreCommunityActivity(project);
    if (activityScore.score > 0) {
      totalScore += activityScore.score * this.WEIGHTS.community_activity;
      reasons.push(activityScore.reason);
    }

    // Similar projects scoring
    const similarityScore = this.scoreSimilarProjects(project, preferences);
    if (similarityScore.score > 0) {
      totalScore += similarityScore.score * this.WEIGHTS.similar_projects;
      reasons.push(similarityScore.reason);
    }

    return {
      score: Math.min(totalScore, 1),
      reasons: reasons.sort((a, b) => b.confidence - a.confidence),
    };
  }

  /**
   * Score based on language match
   */
  private static scoreLanguageMatch(
    project: Project,
    preferences: UserPreferences
  ): { score: number; reason: RecommendationReason } {
    const projectLanguage = project.language?.toLowerCase() || "";
    const preferredLanguages = preferences.preferredLanguages.map((l) =>
      l.toLowerCase()
    );

    const isMatch = preferredLanguages.includes(projectLanguage);
    const confidence = isMatch ? 0.9 : 0;

    return {
      score: confidence,
      reason: {
        type: "language_match",
        confidence,
        explanation: isMatch
          ? `Written in ${project.language}, one of your preferred languages`
          : "",
      },
    };
  }

  /**
   * Score based on topic interest
   */
  private static scoreTopicInterest(
    project: Project,
    preferences: UserPreferences
  ): { score: number; reason: RecommendationReason } {
    const projectTopics = project.topics?.map((t) => t.toLowerCase()) || [];
    const userInterests = preferences.interests.map((i) => i.toLowerCase());

    const matchingTopics = projectTopics.filter((topic) =>
      userInterests.some((interest) => topic.includes(interest))
    );

    const confidence =
      matchingTopics.length > 0
        ? Math.min(matchingTopics.length / userInterests.length, 1)
        : 0;

    return {
      score: confidence,
      reason: {
        type: "topic_interest",
        confidence,
        explanation:
          matchingTopics.length > 0
            ? `Matches your interests: ${matchingTopics.slice(0, 2).join(", ")}`
            : "",
      },
    };
  }

  /**
   * Score based on difficulty level
   */
  private static scoreDifficultyLevel(
    project: Project,
    preferences: UserPreferences
  ): { score: number; reason: RecommendationReason } {
    // Estimate difficulty based on project metrics
    const stars = project.stargazers_count || 0;
    const forks = project.forks_count || 0;
    const issues = project.open_issues_count || 0;

    let estimatedDifficulty: "beginner" | "intermediate" | "advanced" =
      "intermediate";

    if (stars < 1000 && issues < 50) {
      estimatedDifficulty = "beginner";
    } else if (stars > 10000 || forks > 5000) {
      estimatedDifficulty = "advanced";
    }

    const isMatch = estimatedDifficulty === preferences.skillLevel;
    const confidence = isMatch ? 0.8 : 0.4;

    return {
      score: confidence,
      reason: {
        type: "difficulty_level",
        confidence,
        explanation: isMatch
          ? `Suitable for ${preferences.skillLevel} developers`
          : `${estimatedDifficulty} level project`,
      },
    };
  }

  /**
   * Score based on community activity
   */
  private static scoreCommunityActivity(project: Project): {
    score: number;
    reason: RecommendationReason;
  } {
    const stars = project.stargazers_count || 0;
    const forks = project.forks_count || 0;
    const issues = project.open_issues_count || 0;

    // Calculate activity score (normalized)
    const activityScore = Math.min(
      (stars / 10000 + forks / 1000 + issues / 100) / 3,
      1
    );

    const confidence = activityScore;
    const isActive = activityScore > 0.5;

    return {
      score: confidence,
      reason: {
        type: "community_activity",
        confidence,
        explanation: isActive
          ? "Active community with regular contributions"
          : "Growing community",
      },
    };
  }

  /**
   * Score based on similar projects
   */
  private static scoreSimilarProjects(
    project: Project,
    preferences: UserPreferences
  ): { score: number; reason: RecommendationReason } {
    // Check if user has bookmarked or contributed to similar projects
    const hasSimilarInteractions =
      preferences.bookmarkedProjects.length > 0 ||
      preferences.contributedProjects.length > 0;

    const confidence = hasSimilarInteractions ? 0.6 : 0;

    return {
      score: confidence,
      reason: {
        type: "similar_projects",
        confidence,
        explanation: hasSimilarInteractions
          ? "Similar to projects you've shown interest in"
          : "",
      },
    };
  }

  /**
   * Explain why a project was recommended
   */
  static explainRecommendation(
    project: RecommendedProject
  ): RecommendationReason[] {
    return project.reasons.filter((reason) => reason.confidence > 0.3);
  }

  /**
   * Update user preferences based on feedback
   */
  static updateUserPreferences(
    preferences: UserPreferences,
    feedback: FeedbackData,
    project: Project
  ): UserPreferences {
    const updated = { ...preferences };

    // Track viewed projects
    if (!updated.viewedProjects.includes(feedback.projectId)) {
      updated.viewedProjects.push(feedback.projectId);
    }

    // Update preferences based on feedback type
    if (feedback.feedbackType === "interested") {
      // Add language to preferences if not already there
      if (
        project.language &&
        !updated.preferredLanguages.includes(project.language)
      ) {
        updated.preferredLanguages.push(project.language);
      }

      // Add topics to interests
      if (project.topics) {
        project.topics.forEach((topic) => {
          if (!updated.interests.includes(topic)) {
            updated.interests.push(topic);
          }
        });
      }
    } else if (feedback.feedbackType === "not_interested") {
      // Reduce weight of this language/topics in future recommendations
      // This is a simplified approach - in production, you'd want more sophisticated tracking
    }

    return updated;
  }

  /**
   * Get trending projects for cold start recommendations
   */
  static getTrendingRecommendations(projects: Project[]): RecommendedProject[] {
    return projects
      .sort((a, b) => {
        const scoreA = (a.stargazers_count || 0) + (a.forks_count || 0) * 2;
        const scoreB = (b.stargazers_count || 0) + (b.forks_count || 0) * 2;
        return scoreB - scoreA;
      })
      .slice(0, 10)
      .map((project) => ({
        ...project,
        recommendationScore: 0.7,
        reasons: [
          {
            type: "trending" as RecommendationReasonType,
            confidence: 0.7,
            explanation: "Trending in the open source community",
          },
        ],
      }));
  }
}
