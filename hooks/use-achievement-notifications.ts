"use client";

import { useState, useCallback, useEffect } from "react";
import { UserAchievement, AchievementSystem } from "@/lib/achievement-system";
import { useSession } from "next-auth/react";
import { useMilestoneCelebration } from "@/components/custom/milestone-celebration";

interface UseAchievementNotificationsReturn {
  notifications: UserAchievement[];
  showNotification: (achievement: UserAchievement) => void;
  dismissNotification: (achievementId: string) => void;
  clearAllNotifications: () => void;
  trackContribution: (projectId: number) => void;
  trackBookmark: (projectId: number) => void;
  trackProjectView: (projectId: number) => void;
  trackShare: (projectId: number) => void;
  celebration: { isVisible: boolean; level: number };
  hideCelebration: () => void;
}

export function useAchievementNotifications(): UseAchievementNotificationsReturn {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<UserAchievement[]>([]);
  const { celebration, showCelebration, hideCelebration } =
    useMilestoneCelebration();

  const userId = session?.user?.email || "demo-user";

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  const showNotification = useCallback((achievement: UserAchievement) => {
    setNotifications((prev) => [...prev, achievement]);
  }, []);

  const dismissNotification = useCallback((achievementId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== achievementId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const trackContribution = useCallback(
    (projectId: number) => {
      const unlockedAchievements = AchievementSystem.trackContribution(
        userId,
        projectId
      );
      unlockedAchievements.forEach((achievement) => {
        showNotification(achievement);
      });

      // Check for level up
      const stats = AchievementSystem.getUserStats(userId);
      const result = AchievementSystem.addExperience(userId, 0); // Just check current level
      if (result.leveledUp && result.newLevel) {
        showCelebration(result.newLevel);
      }
    },
    [userId, showNotification, showCelebration]
  );

  const trackBookmark = useCallback(
    (projectId: number) => {
      const unlockedAchievements = AchievementSystem.trackBookmark(
        userId,
        projectId
      );
      unlockedAchievements.forEach((achievement) => {
        showNotification(achievement);
      });
    },
    [userId, showNotification]
  );

  const trackProjectView = useCallback(
    (projectId: number) => {
      const unlockedAchievements = AchievementSystem.trackProjectView(
        userId,
        projectId
      );
      unlockedAchievements.forEach((achievement) => {
        showNotification(achievement);
      });
    },
    [userId, showNotification]
  );

  const trackShare = useCallback(
    (projectId: number) => {
      // Track sharing achievement
      const shareCount = AchievementSystem.getShareCount?.(userId) || 0;
      const newShareCount = shareCount + 1;
      AchievementSystem.saveShareCount?.(userId, newShareCount);

      const result = AchievementSystem.updateAchievementProgress(
        userId,
        "share-5",
        newShareCount
      );
      if (result.unlocked && result.achievement) {
        showNotification(result.achievement);
      }
    },
    [userId, showNotification]
  );

  return {
    notifications,
    showNotification,
    dismissNotification,
    clearAllNotifications,
    trackContribution,
    trackBookmark,
    trackProjectView,
    trackShare,
    celebration,
    hideCelebration,
  };
}
