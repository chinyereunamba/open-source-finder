"use client";

import { UserAchievement } from "@/lib/achievement-system";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AchievementNotificationProps {
  achievement: UserAchievement;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function AchievementNotification({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const rarityColors = {
    common: "from-gray-400 to-gray-600",
    rare: "from-blue-400 to-blue-600",
    epic: "from-purple-400 to-purple-600",
    legendary: "from-yellow-400 to-orange-600",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div
            className={cn(
              "bg-white rounded-xl shadow-2xl border-2 overflow-hidden",
              achievement.rarity === "legendary" && "border-yellow-400",
              achievement.rarity === "epic" && "border-purple-400",
              achievement.rarity === "rare" && "border-blue-400",
              achievement.rarity === "common" && "border-gray-400"
            )}
          >
            {/* Header with gradient */}
            <div
              className={cn(
                "bg-gradient-to-r px-4 py-2 text-white",
                rarityColors[achievement.rarity]
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Achievement Unlocked!
                </span>
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Animated Icon */}
                <motion.div
                  className="text-5xl flex-shrink-0"
                  animate={{
                    rotate: [0, -10, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: 2,
                    repeatDelay: 0.5,
                  }}
                >
                  {achievement.icon}
                </motion.div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full font-medium",
                        achievement.rarity === "legendary" &&
                          "bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700",
                        achievement.rarity === "epic" &&
                          "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700",
                        achievement.rarity === "rare" &&
                          "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700",
                        achievement.rarity === "common" &&
                          "bg-gray-100 text-gray-700"
                      )}
                    >
                      {achievement.rarity}
                    </span>
                    <span className="text-green-600 font-semibold">
                      +{achievement.experienceReward} XP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "50%",
                    backgroundColor: [
                      "#FFD700",
                      "#FF6B6B",
                      "#4ECDC4",
                      "#45B7D1",
                      "#FFA07A",
                    ][Math.floor(Math.random() * 5)],
                  }}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: 0,
                    scale: 1,
                    y: [0, -100 - Math.random() * 100],
                    x: [(Math.random() - 0.5) * 100],
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    delay: Math.random() * 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Container component to manage multiple notifications
interface AchievementNotificationContainerProps {
  achievements: UserAchievement[];
  onDismiss: (achievementId: string) => void;
}

export function AchievementNotificationContainer({
  achievements,
  onDismiss,
}: AchievementNotificationContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4 pointer-events-none">
      <AnimatePresence>
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: index * 0.2 }}
            className="pointer-events-auto"
          >
            <AchievementNotification
              achievement={achievement}
              onClose={() => onDismiss(achievement.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
