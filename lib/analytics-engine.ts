import { Project } from "./github-api";

/**
 * Analytics Engine for tracking user engagement and project metrics
 */

// User Engagement Types
export interface UserEngagementMetrics {
  userId: string;
  sessionCount: number;
  totalTimeSpent: number; // in minutes
  pagesViewed: number;
  projectsViewed: number;
  projectsBookmarked: number;
  searchesPerformed: number;
  filtersApplied: number;
  contributionsInitiated: number;
  lastActiveDate: Date;
  engagementScore: number; // 0-100
  activityLevel: "low" | "medium" | "high" | "very_high";
}

export interface SessionData {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  pagesViewed: string[];
  actionsPerformed: UserAction[];
}

export interface UserAction {
  type:
    | "view_project"
    | "bookmark"
    | "search"
    | "filter"
    | "share"
    | "rate"
    | "comment"
    | "click_contribute";
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Project Popularity Types
export interface ProjectPopularityMetrics {
  projectId: number;
  viewCount: number;
  uniqueViewers: number;
  bookmarkCount: number;
  shareCount: number;
  clickThroughRate: number; // percentage of views that led to GitHub
  averageTimeOnPage: number; // in seconds
  popularityScore: number; // 0-100
  trendingVelocity: number; // rate of growth
  popularityRank: number;
  categoryRank?: number;
}

// Contribution Impact Types
export interface ContributionImpactMetrics {
  userId: string;
  totalContributions: number;
  projectsContributed: number;
  impactScore: number; // 0-100
  contributionQuality: "beginner" | "intermediate" | "advanced" | "expert";
  averageContributionSize: "small" | "medium" | "large";
  contributionFrequency: number; // contributions per month
  mentorshipProvided: number;
  communityInfluence: number; // 0-100
}

// Community Health Types
export interface CommunityHealthMetrics {
  projectId: number;
  healthScore: number; // 0-100
  activityLevel: "dormant" | "low" | "moderate" | "active" | "very_active";
  maintainerResponsiveness: number; // 0-100
  contributorDiversity: number; // 0-100
  issueResolutionRate: number; // percentage
  averageIssueResolutionTime: number; // in days
  newContributorFriendliness: number; // 0-100
  documentationQuality: number; // 0-100
  communityGrowthRate: number; // percentage
}

// Maintainer Analytics Types
export interface MaintainerAnalytics {
  projectId: number;
  maintainerId: string;
  totalViews: number;
  uniqueVisitors: number;
  conversionRate: number; // visitors to contributors
  topReferralSources: ReferralSource[];
  audienceGrowth: GrowthData[];
  contributorRetention: number; // percentage
  issueMetrics: IssueMetrics;
  contributorMetrics: ContributorMetrics;
  engagementMetrics: EngagementMetrics;
}

export interface ReferralSource {
  source: string;
  visits: number;
  conversions: number;
}

export interface GrowthData {
  date: Date;
  views: number;
  stars: number;
  forks: number;
  contributors: number;
}

export interface IssueMetrics {
  totalIssues: number;
  openIssues: number;
  closedIssues: number;
  averageTimeToClose: number; // in days
  issuesWithResponses: number;
  averageResponseTime: number; // in hours
}

export interface ContributorMetrics {
  totalContributors: number;
  newContributorsThisMonth: number;
  activeContributors: number;
  contributorRetentionRate: number;
  topContributors: Array<{
    username: string;
    contributions: number;
    impact: number;
  }>;
}

export interface EngagementMetrics {
  averageSessionDuration: number;
  bounceRate: number;
  returnVisitorRate: number;
  socialShares: number;
  commentsCount: number;
  ratingsCount: number;
  averageRating: number;
}

/**
 * Analytics Engine Class
 */
export class AnalyticsEngine {
  private static readonly STORAGE_KEY = "analytics_data";
  private static readonly SESSION_KEY = "current_session";

  // User Engagement Analytics
  static trackUserEngagement(userId: string, action: UserAction): void {
    if (typeof window === "undefined") return;

    try {
      const metrics = this.getUserEngagementMetrics(userId);
      const session = this.getCurrentSession(userId);

      // Update session
      session.actionsPerformed.push(action);
      if (!session.pagesViewed.includes(window.location.pathname)) {
        session.pagesViewed.push(window.location.pathname);
        metrics.pagesViewed++;
      }

      // Update metrics based on action type
      switch (action.type) {
        case "view_project":
          metrics.projectsViewed++;
          break;
        case "bookmark":
          metrics.projectsBookmarked++;
          break;
        case "search":
          metrics.searchesPerformed++;
          break;
        case "filter":
          metrics.filtersApplied++;
          break;
        case "click_contribute":
          metrics.contributionsInitiated++;
          break;
      }

      metrics.lastActiveDate = new Date();
      metrics.engagementScore = this.calculateEngagementScore(metrics);
      metrics.activityLevel = this.determineActivityLevel(metrics);

      this.saveUserEngagementMetrics(userId, metrics);
      this.saveSession(session);
    } catch (error) {
      console.error("Error tracking user engagement:", error);
    }
  }

  static getUserEngagementMetrics(userId: string): UserEngagementMetrics {
    if (typeof window === "undefined") {
      return this.getDefaultEngagementMetrics(userId);
    }

    try {
      const key = `${this.STORAGE_KEY}_engagement_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const metrics = JSON.parse(stored);
        metrics.lastActiveDate = new Date(metrics.lastActiveDate);
        return metrics;
      }
    } catch (error) {
      console.error("Error loading engagement metrics:", error);
    }

    return this.getDefaultEngagementMetrics(userId);
  }

  private static saveUserEngagementMetrics(
    userId: string,
    metrics: UserEngagementMetrics
  ): void {
    if (typeof window === "undefined") return;

    try {
      const key = `${this.STORAGE_KEY}_engagement_${userId}`;
      localStorage.setItem(key, JSON.stringify(metrics));
    } catch (error) {
      console.error("Error saving engagement metrics:", error);
    }
  }

  private static calculateEngagementScore(
    metrics: UserEngagementMetrics
  ): number {
    const weights = {
      sessions: 0.15,
      timeSpent: 0.2,
      projectsViewed: 0.2,
      bookmarks: 0.15,
      searches: 0.1,
      contributions: 0.2,
    };

    const normalizedSessions = Math.min(metrics.sessionCount / 50, 1);
    const normalizedTime = Math.min(metrics.totalTimeSpent / 500, 1);
    const normalizedViews = Math.min(metrics.projectsViewed / 100, 1);
    const normalizedBookmarks = Math.min(metrics.projectsBookmarked / 20, 1);
    const normalizedSearches = Math.min(metrics.searchesPerformed / 50, 1);
    const normalizedContributions = Math.min(
      metrics.contributionsInitiated / 10,
      1
    );

    const score =
      normalizedSessions * weights.sessions +
      normalizedTime * weights.timeSpent +
      normalizedViews * weights.projectsViewed +
      normalizedBookmarks * weights.bookmarks +
      normalizedSearches * weights.searches +
      normalizedContributions * weights.contributions;

    return Math.round(score * 100);
  }

  private static determineActivityLevel(
    metrics: UserEngagementMetrics
  ): "low" | "medium" | "high" | "very_high" {
    const score = metrics.engagementScore;
    if (score >= 75) return "very_high";
    if (score >= 50) return "high";
    if (score >= 25) return "medium";
    return "low";
  }

  private static getDefaultEngagementMetrics(
    userId: string
  ): UserEngagementMetrics {
    return {
      userId,
      sessionCount: 0,
      totalTimeSpent: 0,
      pagesViewed: 0,
      projectsViewed: 0,
      projectsBookmarked: 0,
      searchesPerformed: 0,
      filtersApplied: 0,
      contributionsInitiated: 0,
      lastActiveDate: new Date(),
      engagementScore: 0,
      activityLevel: "low",
    };
  }

  // Session Management
  static startSession(userId: string): SessionData {
    const session: SessionData = {
      sessionId: `session_${Date.now()}_${Math.random()}`,
      userId,
      startTime: new Date(),
      pagesViewed: [],
      actionsPerformed: [],
    };

    this.saveSession(session);
    return session;
  }

  static endSession(userId: string): void {
    const session = this.getCurrentSession(userId);
    if (session) {
      session.endTime = new Date();
      session.duration =
        (session.endTime.getTime() - session.startTime.getTime()) / 60000;

      // Update total time spent
      const metrics = this.getUserEngagementMetrics(userId);
      metrics.totalTimeSpent += session.duration;
      metrics.sessionCount++;
      this.saveUserEngagementMetrics(userId, metrics);

      // Clear current session
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`${this.SESSION_KEY}_${userId}`);
      }
    }
  }

  private static getCurrentSession(userId: string): SessionData {
    if (typeof window === "undefined") {
      return this.startSession(userId);
    }

    try {
      const stored = sessionStorage.getItem(`${this.SESSION_KEY}_${userId}`);
      if (stored) {
        const session = JSON.parse(stored);
        session.startTime = new Date(session.startTime);
        return session;
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }

    return this.startSession(userId);
  }

  private static saveSession(session: SessionData): void {
    if (typeof window === "undefined") return;

    try {
      sessionStorage.setItem(
        `${this.SESSION_KEY}_${session.userId}`,
        JSON.stringify(session)
      );
    } catch (error) {
      console.error("Error saving session:", error);
    }
  }

  // Project Popularity Tracking
  static trackProjectView(
    projectId: number,
    userId: string,
    duration?: number
  ): void {
    if (typeof window === "undefined") return;

    try {
      const metrics = this.getProjectPopularityMetrics(projectId);
      metrics.viewCount++;

      // Track unique viewers
      const viewersKey = `${this.STORAGE_KEY}_viewers_${projectId}`;
      const viewers = this.getStoredArray(viewersKey);
      if (!viewers.includes(userId)) {
        viewers.push(userId);
        metrics.uniqueViewers++;
        this.saveStoredArray(viewersKey, viewers);
      }

      // Update average time on page
      if (duration) {
        const totalTime =
          metrics.averageTimeOnPage * (metrics.viewCount - 1) + duration;
        metrics.averageTimeOnPage = totalTime / metrics.viewCount;
      }

      metrics.popularityScore = this.calculatePopularityScore(metrics);
      this.saveProjectPopularityMetrics(projectId, metrics);
    } catch (error) {
      console.error("Error tracking project view:", error);
    }
  }

  static trackProjectBookmark(projectId: number, isBookmarked: boolean): void {
    if (typeof window === "undefined") return;

    try {
      const metrics = this.getProjectPopularityMetrics(projectId);
      metrics.bookmarkCount += isBookmarked ? 1 : -1;
      metrics.bookmarkCount = Math.max(0, metrics.bookmarkCount);
      metrics.popularityScore = this.calculatePopularityScore(metrics);
      this.saveProjectPopularityMetrics(projectId, metrics);
    } catch (error) {
      console.error("Error tracking project bookmark:", error);
    }
  }

  static trackProjectShare(projectId: number): void {
    if (typeof window === "undefined") return;

    try {
      const metrics = this.getProjectPopularityMetrics(projectId);
      metrics.shareCount++;
      metrics.popularityScore = this.calculatePopularityScore(metrics);
      this.saveProjectPopularityMetrics(projectId, metrics);
    } catch (error) {
      console.error("Error tracking project share:", error);
    }
  }

  static trackProjectClickThrough(projectId: number): void {
    if (typeof window === "undefined") return;

    try {
      const metrics = this.getProjectPopularityMetrics(projectId);
      const clickThroughKey = `${this.STORAGE_KEY}_clicks_${projectId}`;
      const clicks = this.getStoredNumber(clickThroughKey) + 1;
      this.saveStoredNumber(clickThroughKey, clicks);

      metrics.clickThroughRate =
        metrics.viewCount > 0 ? (clicks / metrics.viewCount) * 100 : 0;
      this.saveProjectPopularityMetrics(projectId, metrics);
    } catch (error) {
      console.error("Error tracking click through:", error);
    }
  }

  static getProjectPopularityMetrics(
    projectId: number
  ): ProjectPopularityMetrics {
    if (typeof window === "undefined") {
      return this.getDefaultPopularityMetrics(projectId);
    }

    try {
      const key = `${this.STORAGE_KEY}_popularity_${projectId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading popularity metrics:", error);
    }

    return this.getDefaultPopularityMetrics(projectId);
  }

  private static saveProjectPopularityMetrics(
    projectId: number,
    metrics: ProjectPopularityMetrics
  ): void {
    if (typeof window === "undefined") return;

    try {
      const key = `${this.STORAGE_KEY}_popularity_${projectId}`;
      localStorage.setItem(key, JSON.stringify(metrics));
    } catch (error) {
      console.error("Error saving popularity metrics:", error);
    }
  }

  private static calculatePopularityScore(
    metrics: ProjectPopularityMetrics
  ): number {
    const weights = {
      views: 0.25,
      uniqueViewers: 0.2,
      bookmarks: 0.25,
      shares: 0.15,
      clickThrough: 0.15,
    };

    const normalizedViews = Math.min(metrics.viewCount / 1000, 1);
    const normalizedViewers = Math.min(metrics.uniqueViewers / 500, 1);
    const normalizedBookmarks = Math.min(metrics.bookmarkCount / 100, 1);
    const normalizedShares = Math.min(metrics.shareCount / 50, 1);
    const normalizedCTR = Math.min(metrics.clickThroughRate / 50, 1);

    const score =
      normalizedViews * weights.views +
      normalizedViewers * weights.uniqueViewers +
      normalizedBookmarks * weights.bookmarks +
      normalizedShares * weights.shares +
      normalizedCTR * weights.clickThrough;

    return Math.round(score * 100);
  }

  private static getDefaultPopularityMetrics(
    projectId: number
  ): ProjectPopularityMetrics {
    return {
      projectId,
      viewCount: 0,
      uniqueViewers: 0,
      bookmarkCount: 0,
      shareCount: 0,
      clickThroughRate: 0,
      averageTimeOnPage: 0,
      popularityScore: 0,
      trendingVelocity: 0,
      popularityRank: 0,
    };
  }

  // Helper methods for storage
  private static getStoredArray(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveStoredArray(key: string, array: string[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(array));
    } catch (error) {
      console.error("Error saving array:", error);
    }
  }

  private static getStoredNumber(key: string): number {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem(key);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  }

  private static saveStoredNumber(key: string, value: number): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value.toString());
    } catch (error) {
      console.error("Error saving number:", error);
    }
  }

  // Get top projects by popularity
  static getTopProjects(projectIds: number[], limit: number = 10): number[] {
    return projectIds
      .map((id) => ({
        id,
        metrics: this.getProjectPopularityMetrics(id),
      }))
      .sort((a, b) => b.metrics.popularityScore - a.metrics.popularityScore)
      .slice(0, limit)
      .map((item) => item.id);
  }
}

// Contribution Impact Metrics
export class ContributionAnalytics {
  private static readonly STORAGE_KEY = "contribution_analytics";

  static trackContribution(
    userId: string,
    projectId: number,
    contributionType: "issue" | "pr" | "comment" | "review",
    size: "small" | "medium" | "large" = "medium"
  ): void {
    if (typeof window === "undefined") return;

    try {
      const metrics = this.getContributionImpactMetrics(userId);
      metrics.totalContributions++;

      // Track unique projects
      const projectsKey = `${this.STORAGE_KEY}_projects_${userId}`;
      const projects = this.getStoredArray(projectsKey);
      if (!projects.includes(projectId.toString())) {
        projects.push(projectId.toString());
        metrics.projectsContributed++;
        this.saveStoredArray(projectsKey, projects);
      }

      // Update contribution quality and size
      metrics.averageContributionSize = size;
      metrics.impactScore = this.calculateImpactScore(metrics);
      metrics.contributionQuality = this.determineContributionQuality(metrics);

      this.saveContributionImpactMetrics(userId, metrics);
    } catch (error) {
      console.error("Error tracking contribution:", error);
    }
  }

  static getContributionImpactMetrics(
    userId: string
  ): ContributionImpactMetrics {
    if (typeof window === "undefined") {
      return this.getDefaultImpactMetrics(userId);
    }

    try {
      const key = `${this.STORAGE_KEY}_impact_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading impact metrics:", error);
    }

    return this.getDefaultImpactMetrics(userId);
  }

  private static saveContributionImpactMetrics(
    userId: string,
    metrics: ContributionImpactMetrics
  ): void {
    if (typeof window === "undefined") return;

    try {
      const key = `${this.STORAGE_KEY}_impact_${userId}`;
      localStorage.setItem(key, JSON.stringify(metrics));
    } catch (error) {
      console.error("Error saving impact metrics:", error);
    }
  }

  private static calculateImpactScore(
    metrics: ContributionImpactMetrics
  ): number {
    const weights = {
      totalContributions: 0.3,
      projectsDiversity: 0.25,
      frequency: 0.2,
      mentorship: 0.15,
      influence: 0.1,
    };

    const normalizedContributions = Math.min(
      metrics.totalContributions / 100,
      1
    );
    const normalizedProjects = Math.min(metrics.projectsContributed / 20, 1);
    const normalizedFrequency = Math.min(metrics.contributionFrequency / 10, 1);
    const normalizedMentorship = Math.min(metrics.mentorshipProvided / 10, 1);
    const normalizedInfluence = metrics.communityInfluence / 100;

    const score =
      normalizedContributions * weights.totalContributions +
      normalizedProjects * weights.projectsDiversity +
      normalizedFrequency * weights.frequency +
      normalizedMentorship * weights.mentorship +
      normalizedInfluence * weights.influence;

    return Math.round(score * 100);
  }

  private static determineContributionQuality(
    metrics: ContributionImpactMetrics
  ): "beginner" | "intermediate" | "advanced" | "expert" {
    const score = metrics.impactScore;
    if (score >= 80) return "expert";
    if (score >= 60) return "advanced";
    if (score >= 30) return "intermediate";
    return "beginner";
  }

  private static getDefaultImpactMetrics(
    userId: string
  ): ContributionImpactMetrics {
    return {
      userId,
      totalContributions: 0,
      projectsContributed: 0,
      impactScore: 0,
      contributionQuality: "beginner",
      averageContributionSize: "medium",
      contributionFrequency: 0,
      mentorshipProvided: 0,
      communityInfluence: 0,
    };
  }

  private static getStoredArray(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveStoredArray(key: string, array: string[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(array));
    } catch (error) {
      console.error("Error saving array:", error);
    }
  }
}

// Community Health Indicators
export class CommunityHealthAnalytics {
  static calculateCommunityHealth(project: Project): CommunityHealthMetrics {
    const healthScore = this.calculateHealthScore(project);
    const activityLevel = this.determineActivityLevel(project);
    const maintainerResponsiveness =
      this.estimateMaintainerResponsiveness(project);
    const contributorDiversity = this.estimateContributorDiversity(project);
    const newContributorFriendliness =
      this.assessNewContributorFriendliness(project);

    return {
      projectId: project.id,
      healthScore,
      activityLevel,
      maintainerResponsiveness,
      contributorDiversity,
      issueResolutionRate: 0, // Would need historical data
      averageIssueResolutionTime: 0, // Would need historical data
      newContributorFriendliness,
      documentationQuality: this.assessDocumentationQuality(project),
      communityGrowthRate: 0, // Would need historical data
    };
  }

  private static calculateHealthScore(project: Project): number {
    const weights = {
      activity: 0.25,
      responsiveness: 0.2,
      diversity: 0.15,
      documentation: 0.15,
      newContributorFriendly: 0.15,
      growth: 0.1,
    };

    const activityScore = this.getActivityScore(project);
    const responsivenessScore = this.estimateMaintainerResponsiveness(project);
    const diversityScore = this.estimateContributorDiversity(project);
    const documentationScore = this.assessDocumentationQuality(project);
    const newContributorScore = this.assessNewContributorFriendliness(project);
    const growthScore = this.estimateGrowthScore(project);

    const score =
      activityScore * weights.activity +
      responsivenessScore * weights.responsiveness +
      diversityScore * weights.diversity +
      documentationScore * weights.documentation +
      newContributorScore * weights.newContributorFriendly +
      growthScore * weights.growth;

    return Math.round(score);
  }

  private static getActivityScore(project: Project): number {
    const daysSinceUpdate =
      (Date.now() - new Date(project.updated_at).getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSinceUpdate < 7) return 100;
    if (daysSinceUpdate < 30) return 80;
    if (daysSinceUpdate < 90) return 60;
    if (daysSinceUpdate < 180) return 40;
    return 20;
  }

  private static determineActivityLevel(
    project: Project
  ): "dormant" | "low" | "moderate" | "active" | "very_active" {
    const score = this.getActivityScore(project);
    if (score >= 90) return "very_active";
    if (score >= 70) return "active";
    if (score >= 50) return "moderate";
    if (score >= 30) return "low";
    return "dormant";
  }

  private static estimateMaintainerResponsiveness(project: Project): number {
    // Based on recent activity and issue count
    const hasRecentActivity =
      (Date.now() - new Date(project.updated_at).getTime()) /
        (1000 * 60 * 60 * 24) <
      7;
    const issueRatio =
      project.open_issues_count / Math.max(project.stargazers_count / 100, 1);

    let score = 50;
    if (hasRecentActivity) score += 30;
    if (issueRatio < 0.5) score += 20;

    return Math.min(score, 100);
  }

  private static estimateContributorDiversity(project: Project): number {
    // Estimate based on forks and stars ratio
    const forkRatio =
      project.forks_count / Math.max(project.stargazers_count, 1);
    const diversityScore = Math.min(forkRatio * 200, 100);
    return Math.round(diversityScore);
  }

  private static assessNewContributorFriendliness(project: Project): number {
    let score = 50;

    // Check for beginner-friendly topics
    const beginnerTopics = [
      "good-first-issue",
      "beginner-friendly",
      "hacktoberfest",
      "first-timers-only",
    ];
    const hasBeginnerTopics = (project.topics || []).some((topic) =>
      beginnerTopics.includes(topic.toLowerCase())
    );

    if (hasBeginnerTopics) score += 30;
    if (project.open_issues_count > 5) score += 10;
    if (project.open_issues_count < 50) score += 10;

    return Math.min(score, 100);
  }

  private static assessDocumentationQuality(project: Project): number {
    let score = 50;

    // Projects with descriptions are better documented
    if (project.description && project.description.length > 50) score += 20;
    if (project.topics && project.topics.length > 3) score += 15;
    if (project.license) score += 15;

    return Math.min(score, 100);
  }

  private static estimateGrowthScore(project: Project): number {
    const createdAt = project.created_at
      ? new Date(project.created_at)
      : new Date(project.updated_at);
    const ageInDays = Math.max(
      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24),
      1
    );

    const starsPerDay = project.stargazers_count / ageInDays;
    const growthScore = Math.min(starsPerDay * 10, 100);

    return Math.round(growthScore);
  }

  static getCommunityHealthSummary(projects: Project[]): {
    healthyProjects: number;
    activeProjects: number;
    needsAttention: number;
    averageHealthScore: number;
  } {
    const healthMetrics = projects.map((p) => this.calculateCommunityHealth(p));

    const healthyProjects = healthMetrics.filter(
      (m) => m.healthScore >= 70
    ).length;
    const activeProjects = healthMetrics.filter(
      (m) => m.activityLevel === "active" || m.activityLevel === "very_active"
    ).length;
    const needsAttention = healthMetrics.filter(
      (m) => m.healthScore < 50
    ).length;
    const averageHealthScore =
      healthMetrics.reduce((sum, m) => sum + m.healthScore, 0) /
      healthMetrics.length;

    return {
      healthyProjects,
      activeProjects,
      needsAttention,
      averageHealthScore: Math.round(averageHealthScore),
    };
  }
}

// Maintainer Analytics Dashboard
export class MaintainerAnalyticsDashboard {
  static getMaintainerAnalytics(
    projectId: number,
    maintainerId: string,
    project: Project
  ): MaintainerAnalytics {
    const popularityMetrics =
      AnalyticsEngine.getProjectPopularityMetrics(projectId);
    const communityHealth =
      CommunityHealthAnalytics.calculateCommunityHealth(project);

    return {
      projectId,
      maintainerId,
      totalViews: popularityMetrics.viewCount,
      uniqueVisitors: popularityMetrics.uniqueViewers,
      conversionRate: this.calculateConversionRate(popularityMetrics, project),
      topReferralSources: this.getTopReferralSources(projectId),
      audienceGrowth: this.getAudienceGrowth(projectId, project),
      contributorRetention: this.estimateContributorRetention(project),
      issueMetrics: this.getIssueMetrics(project),
      contributorMetrics: this.getContributorMetrics(project),
      engagementMetrics: this.getEngagementMetrics(
        projectId,
        popularityMetrics
      ),
    };
  }

  private static calculateConversionRate(
    metrics: ProjectPopularityMetrics,
    project: Project
  ): number {
    if (metrics.uniqueViewers === 0) return 0;
    // Estimate contributors as a percentage of unique viewers
    const estimatedContributors = Math.max(project.forks_count / 10, 1);
    return (estimatedContributors / metrics.uniqueViewers) * 100;
  }

  private static getTopReferralSources(projectId: number): ReferralSource[] {
    // Mock data - in real implementation, this would track actual referrals
    return [
      { source: "GitHub Search", visits: 150, conversions: 12 },
      { source: "Direct", visits: 100, conversions: 8 },
      { source: "Social Media", visits: 75, conversions: 5 },
      { source: "Other Projects", visits: 50, conversions: 3 },
    ];
  }

  private static getAudienceGrowth(
    projectId: number,
    project: Project
  ): GrowthData[] {
    // Mock data - in real implementation, this would track historical data
    const now = new Date();
    const growthData: GrowthData[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);

      growthData.push({
        date,
        views: Math.floor(Math.random() * 100) + 50,
        stars: Math.floor(project.stargazers_count * (0.8 + i * 0.03)),
        forks: Math.floor(project.forks_count * (0.8 + i * 0.03)),
        contributors: Math.floor((project.forks_count / 10) * (0.8 + i * 0.03)),
      });
    }

    return growthData;
  }

  private static estimateContributorRetention(project: Project): number {
    // Estimate based on forks vs stars ratio
    const retentionRate =
      (project.forks_count / Math.max(project.stargazers_count / 10, 1)) * 100;
    return Math.min(Math.round(retentionRate), 100);
  }

  private static getIssueMetrics(project: Project): IssueMetrics {
    const totalIssues = project.open_issues_count * 2; // Estimate total
    const openIssues = project.open_issues_count;
    const closedIssues = totalIssues - openIssues;

    return {
      totalIssues,
      openIssues,
      closedIssues,
      averageTimeToClose: 7, // Mock data
      issuesWithResponses: Math.floor(openIssues * 0.7),
      averageResponseTime: 24, // Mock data in hours
    };
  }

  private static getContributorMetrics(project: Project): ContributorMetrics {
    const totalContributors = Math.max(Math.floor(project.forks_count / 10), 1);
    const activeContributors = Math.max(Math.floor(totalContributors * 0.3), 1);

    return {
      totalContributors,
      newContributorsThisMonth: Math.floor(totalContributors * 0.1),
      activeContributors,
      contributorRetentionRate: 65, // Mock data
      topContributors: [
        { username: "contributor1", contributions: 150, impact: 95 },
        { username: "contributor2", contributions: 120, impact: 88 },
        { username: "contributor3", contributions: 95, impact: 82 },
      ],
    };
  }

  private static getEngagementMetrics(
    projectId: number,
    popularityMetrics: ProjectPopularityMetrics
  ): EngagementMetrics {
    return {
      averageSessionDuration: popularityMetrics.averageTimeOnPage / 60,
      bounceRate: 35, // Mock data
      returnVisitorRate: 45, // Mock data
      socialShares: popularityMetrics.shareCount,
      commentsCount: 0, // Would need to track
      ratingsCount: 0, // Would need to track
      averageRating: 0, // Would need to track
    };
  }

  static getAnalyticsSummary(analytics: MaintainerAnalytics): {
    performanceScore: number;
    insights: string[];
    recommendations: string[];
  } {
    const insights: string[] = [];
    const recommendations: string[] = [];

    // Analyze views
    if (analytics.totalViews > 1000) {
      insights.push("High visibility - your project is getting great exposure");
    } else if (analytics.totalViews < 100) {
      insights.push(
        "Low visibility - consider improving project discoverability"
      );
      recommendations.push("Add more descriptive tags and improve README");
    }

    // Analyze conversion
    if (analytics.conversionRate > 5) {
      insights.push(
        "Excellent conversion rate - visitors are becoming contributors"
      );
    } else if (analytics.conversionRate < 1) {
      insights.push("Low conversion rate - visitors aren't contributing");
      recommendations.push(
        "Add clear contribution guidelines and good first issues"
      );
    }

    // Analyze engagement
    if (analytics.engagementMetrics.averageSessionDuration > 5) {
      insights.push(
        "High engagement - users are spending time on your project"
      );
    } else {
      recommendations.push(
        "Improve project documentation to increase engagement"
      );
    }

    // Analyze issues
    if (analytics.issueMetrics.averageResponseTime < 48) {
      insights.push(
        "Great responsiveness - issues are being addressed quickly"
      );
    } else {
      recommendations.push("Try to respond to issues more quickly");
    }

    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(analytics);

    return {
      performanceScore,
      insights,
      recommendations,
    };
  }

  private static calculatePerformanceScore(
    analytics: MaintainerAnalytics
  ): number {
    const weights = {
      views: 0.2,
      conversion: 0.25,
      engagement: 0.2,
      responsiveness: 0.2,
      retention: 0.15,
    };

    const viewsScore = Math.min(analytics.totalViews / 1000, 1) * 100;
    const conversionScore = Math.min(analytics.conversionRate / 10, 1) * 100;
    const engagementScore =
      Math.min(analytics.engagementMetrics.averageSessionDuration / 10, 1) *
      100;
    const responsivenessScore =
      Math.max(0, 1 - analytics.issueMetrics.averageResponseTime / 168) * 100;
    const retentionScore = analytics.contributorRetention;

    const score =
      viewsScore * weights.views +
      conversionScore * weights.conversion +
      engagementScore * weights.engagement +
      responsivenessScore * weights.responsiveness +
      retentionScore * weights.retention;

    return Math.round(score);
  }
}
