/**
 * Achievement System
 * Manages badges, achievements, user levels, and experience points
 */

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";
export type AchievementCategory =
  | "contribution"
  | "social"
  | "exploration"
  | "milestone";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  maxProgress: number;
  experienceReward: number;
}

export interface UserAchievement extends Achievement {
  progress: number;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

export interface UserStats {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalAchievements: number;
  unlockedAchievements: number;
  contributionStreak: number;
  totalContributions: number;
  lastContributionDate?: Date;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: AchievementRarity;
  earnedAt: Date;
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Contribution Achievements
  {
    id: "first-contribution",
    title: "First Steps",
    description: "Make your first contribution to an open source project",
    icon: "🌱",
    category: "contribution",
    rarity: "common",
    maxProgress: 1,
    experienceReward: 100,
  },
  {
    id: "contributor-5",
    title: "Getting Started",
    description: "Contribute to 5 different projects",
    icon: "🚀",
    category: "contribution",
    rarity: "common",
    maxProgress: 5,
    experienceReward: 250,
  },
  {
    id: "contributor-10",
    title: "Active Contributor",
    description: "Contribute to 10 different projects",
    icon: "⭐",
    category: "contribution",
    rarity: "rare",
    maxProgress: 10,
    experienceReward: 500,
  },
  {
    id: "contributor-25",
    title: "Open Source Champion",
    description: "Contribute to 25 different projects",
    icon: "🏆",
    category: "contribution",
    rarity: "epic",
    maxProgress: 25,
    experienceReward: 1000,
  },
  {
    id: "contributor-50",
    title: "Open Source Legend",
    description: "Contribute to 50 different projects",
    icon: "👑",
    category: "contribution",
    rarity: "legendary",
    maxProgress: 50,
    experienceReward: 2500,
  },

  // Streak Achievements
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day contribution streak",
    icon: "🔥",
    category: "contribution",
    rarity: "common",
    maxProgress: 7,
    experienceReward: 200,
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Maintain a 30-day contribution streak",
    icon: "💪",
    category: "contribution",
    rarity: "rare",
    maxProgress: 30,
    experienceReward: 750,
  },
  {
    id: "streak-100",
    title: "Centurion",
    description: "Maintain a 100-day contribution streak",
    icon: "🎯",
    category: "contribution",
    rarity: "epic",
    maxProgress: 100,
    experienceReward: 2000,
  },

  // Social Achievements
  {
    id: "first-bookmark",
    title: "Bookworm",
    description: "Bookmark your first project",
    icon: "📚",
    category: "social",
    rarity: "common",
    maxProgress: 1,
    experienceReward: 50,
  },
  {
    id: "bookmarks-10",
    title: "Curator",
    description: "Bookmark 10 projects",
    icon: "📖",
    category: "social",
    rarity: "rare",
    maxProgress: 10,
    experienceReward: 300,
  },
  {
    id: "share-5",
    title: "Community Builder",
    description: "Share 5 projects with others",
    icon: "🤝",
    category: "social",
    rarity: "rare",
    maxProgress: 5,
    experienceReward: 400,
  },

  // Exploration Achievements
  {
    id: "explorer-10",
    title: "Explorer",
    description: "View 10 different projects",
    icon: "🔍",
    category: "exploration",
    rarity: "common",
    maxProgress: 10,
    experienceReward: 100,
  },
  {
    id: "explorer-50",
    title: "Adventurer",
    description: "View 50 different projects",
    icon: "🗺️",
    category: "exploration",
    rarity: "rare",
    maxProgress: 50,
    experienceReward: 400,
  },
  {
    id: "explorer-100",
    title: "Pathfinder",
    description: "View 100 different projects",
    icon: "🧭",
    category: "exploration",
    rarity: "epic",
    maxProgress: 100,
    experienceReward: 800,
  },
  {
    id: "language-diversity",
    title: "Polyglot",
    description: "Explore projects in 5 different programming languages",
    icon: "🌐",
    category: "exploration",
    rarity: "rare",
    maxProgress: 5,
    experienceReward: 500,
  },

  // Milestone Achievements
  {
    id: "profile-complete",
    title: "Profile Pro",
    description: "Complete your profile with preferences and interests",
    icon: "✨",
    category: "milestone",
    rarity: "common",
    maxProgress: 1,
    experienceReward: 150,
  },
  {
    id: "level-5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "🌟",
    category: "milestone",
    rarity: "rare",
    maxProgress: 1,
    experienceReward: 500,
  },
  {
    id: "level-10",
    title: "Veteran",
    description: "Reach level 10",
    icon: "💎",
    category: "milestone",
    rarity: "epic",
    maxProgress: 1,
    experienceReward: 1000,
  },
  {
    id: "level-25",
    title: "Master",
    description: "Reach level 25",
    icon: "🏅",
    category: "milestone",
    rarity: "legendary",
    maxProgress: 1,
    experienceReward: 2500,
  },
];

/**
 * Achievement System Service
 */
export class AchievementSystem {
  private static readonly STORAGE_KEY = "user_achievements";
  private static readonly STATS_KEY = "user_stats";

  /**
   * Calculate experience required for a level
   */
  static getExperienceForLevel(level: number): number {
    // Exponential curve: 100 * level^1.5
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  /**
   * Calculate level from total experience
   */
  static getLevelFromExperience(experience: number): number {
    let level = 1;
    let totalExpNeeded = 0;

    while (totalExpNeeded <= experience) {
      level++;
      totalExpNeeded += this.getExperienceForLevel(level);
    }

    return level - 1;
  }

  /**
   * Get user stats
   */
  static getUserStats(userId: string): UserStats {
    if (typeof window === "undefined") {
      return this.getDefaultStats();
    }

    try {
      const stored = localStorage.getItem(`${this.STATS_KEY}_${userId}`);
      if (stored) {
        const stats = JSON.parse(stored);
        // Convert date strings back to Date objects
        if (stats.lastContributionDate) {
          stats.lastContributionDate = new Date(stats.lastContributionDate);
        }
        return stats;
      }
    } catch (error) {
      console.error("Error loading user stats:", error);
    }

    return this.getDefaultStats();
  }

  /**
   * Save user stats
   */
  private static saveUserStats(userId: string, stats: UserStats): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        `${this.STATS_KEY}_${userId}`,
        JSON.stringify(stats)
      );
    } catch (error) {
      console.error("Error saving user stats:", error);
    }
  }

  /**
   * Get user achievements
   */
  static getUserAchievements(userId: string): UserAchievement[] {
    if (typeof window === "undefined") {
      return this.initializeAchievements();
    }

    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      if (stored) {
        const achievements = JSON.parse(stored);
        // Convert date strings back to Date objects
        return achievements.map((a: UserAchievement) => ({
          ...a,
          unlockedAt: a.unlockedAt ? new Date(a.unlockedAt) : undefined,
        }));
      }
    } catch (error) {
      console.error("Error loading user achievements:", error);
    }

    return this.initializeAchievements();
  }

  /**
   * Save user achievements
   */
  private static saveUserAchievements(
    userId: string,
    achievements: UserAchievement[]
  ): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(
        `${this.STORAGE_KEY}_${userId}`,
        JSON.stringify(achievements)
      );
    } catch (error) {
      console.error("Error saving user achievements:", error);
    }
  }

  /**
   * Initialize achievements for new user
   */
  private static initializeAchievements(): UserAchievement[] {
    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      progress: 0,
      isUnlocked: false,
    }));
  }

  /**
   * Get default stats for new user
   */
  private static getDefaultStats(): UserStats {
    return {
      level: 1,
      experience: 0,
      experienceToNextLevel: this.getExperienceForLevel(2),
      totalAchievements: ACHIEVEMENTS.length,
      unlockedAchievements: 0,
      contributionStreak: 0,
      totalContributions: 0,
    };
  }

  /**
   * Add experience and check for level up
   */
  static addExperience(
    userId: string,
    amount: number
  ): { leveledUp: boolean; newLevel?: number; stats: UserStats } {
    const stats = this.getUserStats(userId);
    const oldLevel = stats.level;

    stats.experience += amount;
    stats.level = this.getLevelFromExperience(stats.experience);

    const expForCurrentLevel = this.getTotalExperienceForLevel(stats.level);
    const expForNextLevel = this.getTotalExperienceForLevel(stats.level + 1);
    stats.experienceToNextLevel = expForNextLevel - stats.experience;

    this.saveUserStats(userId, stats);

    const leveledUp = stats.level > oldLevel;
    return {
      leveledUp,
      newLevel: leveledUp ? stats.level : undefined,
      stats,
    };
  }

  /**
   * Get total experience needed to reach a level
   */
  private static getTotalExperienceForLevel(level: number): number {
    let total = 0;
    for (let i = 2; i <= level; i++) {
      total += this.getExperienceForLevel(i);
    }
    return total;
  }

  /**
   * Update achievement progress
   */
  static updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
  ): { unlocked: boolean; achievement?: UserAchievement } {
    const achievements = this.getUserAchievements(userId);
    const achievement = achievements.find((a) => a.id === achievementId);

    if (!achievement || achievement.isUnlocked) {
      return { unlocked: false };
    }

    achievement.progress = Math.min(progress, achievement.maxProgress);

    if (achievement.progress >= achievement.maxProgress) {
      achievement.isUnlocked = true;
      achievement.unlockedAt = new Date();

      // Award experience
      this.addExperience(userId, achievement.experienceReward);

      // Update stats
      const stats = this.getUserStats(userId);
      stats.unlockedAchievements++;
      this.saveUserStats(userId, stats);

      this.saveUserAchievements(userId, achievements);

      return { unlocked: true, achievement };
    }

    this.saveUserAchievements(userId, achievements);
    return { unlocked: false };
  }

  /**
   * Track contribution and update related achievements
   */
  static trackContribution(
    userId: string,
    projectId: number
  ): UserAchievement[] {
    const stats = this.getUserStats(userId);
    const now = new Date();
    const unlockedAchievements: UserAchievement[] = [];

    // Update contribution count
    stats.totalContributions++;

    // Update streak
    if (stats.lastContributionDate) {
      const daysSinceLastContribution = Math.floor(
        (now.getTime() - stats.lastContributionDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastContribution === 1) {
        stats.contributionStreak++;
      } else if (daysSinceLastContribution > 1) {
        stats.contributionStreak = 1;
      }
    } else {
      stats.contributionStreak = 1;
    }

    stats.lastContributionDate = now;
    this.saveUserStats(userId, stats);

    // Check contribution count achievements
    const contributionAchievements = [
      { id: "first-contribution", count: 1 },
      { id: "contributor-5", count: 5 },
      { id: "contributor-10", count: 10 },
      { id: "contributor-25", count: 25 },
      { id: "contributor-50", count: 50 },
    ];

    for (const { id, count } of contributionAchievements) {
      const result = this.updateAchievementProgress(
        userId,
        id,
        stats.totalContributions
      );
      if (result.unlocked && result.achievement) {
        unlockedAchievements.push(result.achievement);
      }
    }

    // Check streak achievements
    const streakAchievements = [
      { id: "streak-7", days: 7 },
      { id: "streak-30", days: 30 },
      { id: "streak-100", days: 100 },
    ];

    for (const { id, days } of streakAchievements) {
      const result = this.updateAchievementProgress(
        userId,
        id,
        stats.contributionStreak
      );
      if (result.unlocked && result.achievement) {
        unlockedAchievements.push(result.achievement);
      }
    }

    return unlockedAchievements;
  }

  /**
   * Track project view and update exploration achievements
   */
  static trackProjectView(
    userId: string,
    projectId: number
  ): UserAchievement[] {
    const unlockedAchievements: UserAchievement[] = [];

    // This would typically track unique views
    // For now, we'll use a simple counter
    const viewCount = this.getViewCount(userId);
    const newViewCount = viewCount + 1;
    this.saveViewCount(userId, newViewCount);

    const explorationAchievements = [
      { id: "explorer-10", count: 10 },
      { id: "explorer-50", count: 50 },
      { id: "explorer-100", count: 100 },
    ];

    for (const { id, count } of explorationAchievements) {
      const result = this.updateAchievementProgress(userId, id, newViewCount);
      if (result.unlocked && result.achievement) {
        unlockedAchievements.push(result.achievement);
      }
    }

    return unlockedAchievements;
  }

  /**
   * Track bookmark and update social achievements
   */
  static trackBookmark(userId: string, projectId: number): UserAchievement[] {
    const unlockedAchievements: UserAchievement[] = [];

    const bookmarkCount = this.getBookmarkCount(userId);
    const newBookmarkCount = bookmarkCount + 1;
    this.saveBookmarkCount(userId, newBookmarkCount);

    const bookmarkAchievements = [
      { id: "first-bookmark", count: 1 },
      { id: "bookmarks-10", count: 10 },
    ];

    for (const { id, count } of bookmarkAchievements) {
      const result = this.updateAchievementProgress(
        userId,
        id,
        newBookmarkCount
      );
      if (result.unlocked && result.achievement) {
        unlockedAchievements.push(result.achievement);
      }
    }

    return unlockedAchievements;
  }

  /**
   * Helper methods for counters
   */
  private static getViewCount(userId: string): number {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(`view_count_${userId}`);
    return stored ? parseInt(stored, 10) : 0;
  }

  private static saveViewCount(userId: string, count: number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`view_count_${userId}`, count.toString());
  }

  private static getBookmarkCount(userId: string): number {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(`bookmark_count_${userId}`);
    return stored ? parseInt(stored, 10) : 0;
  }

  private static saveBookmarkCount(userId: string, count: number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`bookmark_count_${userId}`, count.toString());
  }

  static getShareCount(userId: string): number {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(`share_count_${userId}`);
    return stored ? parseInt(stored, 10) : 0;
  }

  static saveShareCount(userId: string, count: number): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`share_count_${userId}`, count.toString());
  }

  /**
   * Get achievements by category
   */
  static getAchievementsByCategory(
    userId: string,
    category: AchievementCategory
  ): UserAchievement[] {
    return this.getUserAchievements(userId).filter(
      (a) => a.category === category
    );
  }

  /**
   * Get unlocked achievements
   */
  static getUnlockedAchievements(userId: string): UserAchievement[] {
    return this.getUserAchievements(userId).filter((a) => a.isUnlocked);
  }

  /**
   * Get achievements in progress
   */
  static getAchievementsInProgress(userId: string): UserAchievement[] {
    return this.getUserAchievements(userId).filter(
      (a) => !a.isUnlocked && a.progress > 0
    );
  }

  /**
   * Clear all achievement data
   */
  static clearUserData(userId: string): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.removeItem(`${this.STORAGE_KEY}_${userId}`);
      localStorage.removeItem(`${this.STATS_KEY}_${userId}`);
      localStorage.removeItem(`view_count_${userId}`);
      localStorage.removeItem(`bookmark_count_${userId}`);
      localStorage.removeItem(`share_count_${userId}`);
    } catch (error) {
      console.error("Error clearing achievement data:", error);
    }
  }
}
