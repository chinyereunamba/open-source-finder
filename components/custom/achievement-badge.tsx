"use client";

import { UserAchievement, AchievementRarity } from "@/lib/achievement-system";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AchievementBadgeProps {
  achievement: UserAchievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  onClick?: () => void;
}

const rarityColors: Record<AchievementRarity, string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-orange-600",
};

const rarityBorders: Record<AchievementRarity, string> = {
  common: "border-gray-400",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

const sizeClasses = {
  sm: "w-16 h-16 text-2xl",
  md: "w-24 h-24 text-4xl",
  lg: "w-32 h-32 text-5xl",
};

export function AchievementBadge({
  achievement,
  size = "md",
  showProgress = false,
  onClick,
}: AchievementBadgeProps) {
  const isLocked = !achievement.isUnlocked;
  const progressPercentage =
    (achievement.progress / achievement.maxProgress) * 100;

  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer",
        onClick && "hover:scale-105 transition-transform"
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Badge Container */}
      <div
        className={cn(
          "relative rounded-full border-4 flex items-center justify-center",
          sizeClasses[size],
          isLocked
            ? "bg-gray-200 border-gray-300 opacity-50 grayscale"
            : `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${
                rarityBorders[achievement.rarity]
              }`
        )}
      >
        {/* Icon */}
        <span className="relative z-10">{achievement.icon}</span>

        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
            <span className="text-2xl">🔒</span>
          </div>
        )}

        {/* Progress Ring */}
        {showProgress &&
          !achievement.isUnlocked &&
          achievement.progress > 0 && (
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-gray-300"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${progressPercentage * 2.827} 282.7`}
                className="text-blue-500 transition-all duration-500"
              />
            </svg>
          )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
        <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
          <div className="font-semibold">{achievement.title}</div>
          <div className="text-gray-300 text-xs">{achievement.description}</div>
          {showProgress && !achievement.isUnlocked && (
            <div className="text-gray-400 text-xs mt-1">
              Progress: {achievement.progress}/{achievement.maxProgress}
            </div>
          )}
          {achievement.unlockedAt && (
            <div className="text-gray-400 text-xs mt-1">
              Unlocked: {achievement.unlockedAt.toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1" />
      </div>

      {/* Rarity Indicator */}
      {!isLocked && (
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs">
          {achievement.rarity === "legendary" && "👑"}
          {achievement.rarity === "epic" && "💎"}
          {achievement.rarity === "rare" && "⭐"}
          {achievement.rarity === "common" && "✨"}
        </div>
      )}
    </motion.div>
  );
}
