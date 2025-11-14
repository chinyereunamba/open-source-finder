"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAchievementNotifications } from "@/hooks/use-achievement-notifications";

interface UseAchievementNotificationsReturn {
  notifications: any[];
  showNotification: (achievement: any) => void;
  dismissNotification: (achievementId: string) => void;
  clearAllNotifications: () => void;
  trackContribution: (projectId: number) => void;
  trackBookmark: (projectId: number) => void;
  trackProjectView: (projectId: number) => void;
  trackShare: (projectId: number) => void;
  celebration: { isVisible: boolean; level: number };
  hideCelebration: () => void;
}

const AchievementNotificationContext =
  createContext<UseAchievementNotificationsReturn | null>(null);

interface AchievementNotificationProviderProps {
  children: ReactNode;
}

export function AchievementNotificationProvider({
  children,
}: AchievementNotificationProviderProps) {
  const achievementNotifications = useAchievementNotifications();

  return (
    <AchievementNotificationContext.Provider value={achievementNotifications}>
      {children}
    </AchievementNotificationContext.Provider>
  );
}

export function useAchievementNotificationContext() {
  const context = useContext(AchievementNotificationContext);
  if (!context) {
    throw new Error(
      "useAchievementNotificationContext must be used within an AchievementNotificationProvider"
    );
  }
  return context;
}
