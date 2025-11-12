import { UserPreferences, FeedbackData } from "./recommendation-engine";

/**
 * User Interest Tracking Service
 * Manages user preferences and interaction history
 */
export class UserInterestTracker {
  private static readonly STORAGE_KEY = "user_preferences";
  private static readonly FEEDBACK_KEY = "user_feedback";

  /**
   * Get user preferences from local storage
   */
  static getUserPreferences(userId: string): UserPreferences {
    if (typeof window === "undefined") {
      return this.getDefaultPreferences();
    }

    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading user preferences:", error);
    }

    return this.getDefaultPreferences();
  }

  /**
   * Save user preferences to local storage
   */
  static saveUserPreferences(
    userId: string,
    preferences: UserPreferences
  ): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        `${this.STORAGE_KEY}_${userId}`,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  }

  /**
   * Update user preferences
   */
  static updatePreferences(
    userId: string,
    updates: Partial<UserPreferences>
  ): UserPreferences {
    const current = this.getUserPreferences(userId);
    const updated = { ...current, ...updates };
    this.saveUserPreferences(userId, updated);
    return updated;
  }

  /**
   * Track project view
   */
  static trackProjectView(userId: string, projectId: number): void {
    const preferences = this.getUserPreferences(userId);
    if (!preferences.viewedProjects.includes(projectId)) {
      preferences.viewedProjects.push(projectId);
      // Keep only last 100 viewed projects
      if (preferences.viewedProjects.length > 100) {
        preferences.viewedProjects = preferences.viewedProjects.slice(-100);
      }
      this.saveUserPreferences(userId, preferences);
    }
  }

  /**
   * Track project bookmark
   */
  static trackProjectBookmark(
    userId: string,
    projectId: number,
    isBookmarked: boolean
  ): void {
    const preferences = this.getUserPreferences(userId);
    if (isBookmarked) {
      if (!preferences.bookmarkedProjects.includes(projectId)) {
        preferences.bookmarkedProjects.push(projectId);
      }
    } else {
      preferences.bookmarkedProjects = preferences.bookmarkedProjects.filter(
        (id) => id !== projectId
      );
    }
    this.saveUserPreferences(userId, preferences);
  }

  /**
   * Add language preference
   */
  static addLanguagePreference(userId: string, language: string): void {
    const preferences = this.getUserPreferences(userId);
    if (!preferences.preferredLanguages.includes(language)) {
      preferences.preferredLanguages.push(language);
      this.saveUserPreferences(userId, preferences);
    }
  }

  /**
   * Remove language preference
   */
  static removeLanguagePreference(userId: string, language: string): void {
    const preferences = this.getUserPreferences(userId);
    preferences.preferredLanguages = preferences.preferredLanguages.filter(
      (l) => l !== language
    );
    this.saveUserPreferences(userId, preferences);
  }

  /**
   * Add interest/topic
   */
  static addInterest(userId: string, interest: string): void {
    const preferences = this.getUserPreferences(userId);
    if (!preferences.interests.includes(interest)) {
      preferences.interests.push(interest);
      this.saveUserPreferences(userId, preferences);
    }
  }

  /**
   * Remove interest/topic
   */
  static removeInterest(userId: string, interest: string): void {
    const preferences = this.getUserPreferences(userId);
    preferences.interests = preferences.interests.filter((i) => i !== interest);
    this.saveUserPreferences(userId, preferences);
  }

  /**
   * Update skill level
   */
  static updateSkillLevel(
    userId: string,
    skillLevel: "beginner" | "intermediate" | "advanced"
  ): void {
    this.updatePreferences(userId, { skillLevel });
  }

  /**
   * Record feedback
   */
  static recordFeedback(feedback: FeedbackData): void {
    if (typeof window === "undefined") return;

    try {
      const key = `${this.FEEDBACK_KEY}_${feedback.userId}`;
      const stored = localStorage.getItem(key);
      const feedbackHistory: FeedbackData[] = stored ? JSON.parse(stored) : [];

      feedbackHistory.push(feedback);

      // Keep only last 200 feedback items
      if (feedbackHistory.length > 200) {
        feedbackHistory.splice(0, feedbackHistory.length - 200);
      }

      localStorage.setItem(key, JSON.stringify(feedbackHistory));
    } catch (error) {
      console.error("Error recording feedback:", error);
    }
  }

  /**
   * Get feedback history
   */
  static getFeedbackHistory(userId: string): FeedbackData[] {
    if (typeof window === "undefined") return [];

    try {
      const key = `${this.FEEDBACK_KEY}_${userId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading feedback history:", error);
      return [];
    }
  }

  /**
   * Get default preferences for new users
   */
  private static getDefaultPreferences(): UserPreferences {
    return {
      preferredLanguages: [],
      interests: [],
      skillLevel: "intermediate",
      viewedProjects: [],
      bookmarkedProjects: [],
      contributedProjects: [],
    };
  }

  /**
   * Clear all user data (for privacy/logout)
   */
  static clearUserData(userId: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(`${this.STORAGE_KEY}_${userId}`);
      localStorage.removeItem(`${this.FEEDBACK_KEY}_${userId}`);
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }

  /**
   * Export user data (for GDPR compliance)
   */
  static exportUserData(userId: string): {
    preferences: UserPreferences;
    feedback: FeedbackData[];
  } {
    return {
      preferences: this.getUserPreferences(userId),
      feedback: this.getFeedbackHistory(userId),
    };
  }
}
