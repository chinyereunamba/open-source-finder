"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MilestoneCelebrationProps {
  isVisible: boolean;
  level: number;
  onComplete: () => void;
  duration?: number;
}

export function MilestoneCelebration({
  isVisible,
  level,
  onComplete,
  duration = 4000,
}: MilestoneCelebrationProps) {
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowFireworks(true);
      const timer = setTimeout(() => {
        setShowFireworks(false);
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fireworks Background */}
          {showFireworks && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    backgroundColor: [
                      "#FFD700",
                      "#FF6B6B",
                      "#4ECDC4",
                      "#45B7D1",
                      "#FFA07A",
                      "#98D8C8",
                      "#F7DC6F",
                      "#BB8FCE",
                    ][Math.floor(Math.random() * 8)],
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    x: [(Math.random() - 0.5) * 200],
                    y: [(Math.random() - 0.5) * 200],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 2,
                    repeat: 2,
                    repeatDelay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Celebration Card */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce">
              🎉
            </div>
            <div className="absolute -top-4 -right-4 text-4xl animate-bounce delay-100">
              🎊
            </div>
            <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce delay-200">
              ✨
            </div>
            <div className="absolute -bottom-4 -right-4 text-4xl animate-bounce delay-300">
              🌟
            </div>

            {/* Level Badge */}
            <motion.div
              className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                scale: {
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                },
              }}
            >
              <div className="text-center">
                <div className="text-xs text-white/80 font-medium">Level</div>
                <div className="text-2xl font-bold text-white">{level}</div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Level Up!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg text-gray-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              You've reached level {level}!
            </motion.p>

            {/* Achievement Message */}
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-gray-700">{getLevelMessage(level)}</p>
            </motion.div>

            {/* Confetti Rain */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    backgroundColor: [
                      "#FFD700",
                      "#FF6B6B",
                      "#4ECDC4",
                      "#45B7D1",
                      "#FFA07A",
                    ][Math.floor(Math.random() * 5)],
                  }}
                  initial={{ y: -10, opacity: 1 }}
                  animate={{
                    y: 400,
                    opacity: 0,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Close Button */}
            <motion.button
              onClick={onComplete}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getLevelMessage(level: number): string {
  if (level >= 25)
    return "You're now a Master Contributor! Your expertise is inspiring others in the community.";
  if (level >= 20)
    return "Expert Developer status achieved! You're making significant impact in open source.";
  if (level >= 15)
    return "Senior Contributor level reached! Your contributions are shaping the future of open source.";
  if (level >= 10)
    return "Veteran status unlocked! You're becoming a pillar of the open source community.";
  if (level >= 5)
    return "Rising Star! Your consistent contributions are being noticed.";
  if (level >= 3)
    return "Active Member! You're building momentum in your open source journey.";
  return "Welcome to the community! Every expert was once a beginner.";
}

// Hook to manage milestone celebrations
export function useMilestoneCelebration() {
  const [celebration, setCelebration] = useState<{
    isVisible: boolean;
    level: number;
  }>({ isVisible: false, level: 0 });

  const showCelebration = (level: number) => {
    setCelebration({ isVisible: true, level });
  };

  const hideCelebration = () => {
    setCelebration({ isVisible: false, level: 0 });
  };

  return {
    celebration,
    showCelebration,
    hideCelebration,
  };
}
