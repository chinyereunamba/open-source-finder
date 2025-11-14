"use client";

import { AchievementNotificationContainer } from "./achievement-notification";
import { MilestoneCelebration } from "./milestone-celebration";
import { useAchievementNotifications } from "@/hooks/use-achievement-notifications";

export function GlobalAchievementNotifications() {
  const { notifications, dismissNotification, celebration, hideCelebration } =
    useAchievementNotifications();

  return (
    <>
      <AchievementNotificationContainer
        achievements={notifications}
        onDismiss={dismissNotification}
      />
      <MilestoneCelebration
        isVisible={celebration.isVisible}
        level={celebration.level}
        onComplete={hideCelebration}
      />
    </>
  );
}
