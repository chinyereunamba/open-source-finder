"use client";

import { useEffect, useRef } from "react";

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  longPressDelay?: number;
}

export function useTouchGestures(options: TouchGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onTap,
    onDoubleTap,
    onLongPress,
    threshold = 50,
    longPressDelay = 500,
  } = options;

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const lastTap = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress();
        touchStart.current = null;
      }, longPressDelay);
    }
  };

  const handleTouchMove = () => {
    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;

    // Check for swipe gestures
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    } else if (deltaTime < 300) {
      // Check for tap or double tap
      const now = Date.now();
      const timeSinceLastTap = now - lastTap.current;

      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        // Double tap
        if (onDoubleTap) {
          onDoubleTap();
        }
        lastTap.current = 0;
      } else {
        // Single tap
        if (onTap) {
          onTap();
        }
        lastTap.current = now;
      }
    }

    touchStart.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

export function useTouchGestureRef<T extends HTMLElement>(
  options: TouchGestureOptions
) {
  const ref = useRef<T>(null);
  const handlers = useTouchGestures(options);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.addEventListener("touchstart", handlers.onTouchStart);
    element.addEventListener("touchmove", handlers.onTouchMove);
    element.addEventListener("touchend", handlers.onTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handlers.onTouchStart);
      element.removeEventListener("touchmove", handlers.onTouchMove);
      element.removeEventListener("touchend", handlers.onTouchEnd);
    };
  }, [handlers]);

  return ref;
}
