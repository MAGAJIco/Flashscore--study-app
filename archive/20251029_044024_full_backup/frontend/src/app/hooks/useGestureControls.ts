"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { haptic } from '../components/HapticFeedback';
import { useAuth } from '@hooks/useAuth';

interface GestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enableHaptic?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function useGestureControls({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enableHaptic = true
}: GestureConfig) {
  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);
  const [isGesturing, setIsGesturing] = useState(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    setIsGesturing(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;

    touchEnd.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      setIsGesturing(false);
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime;

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        if (deltaX > 0) {
          if (enableHaptic) haptic.swipeAction();
          onSwipeRight?.();
        } else {
          if (enableHaptic) haptic.swipeAction();
          onSwipeLeft?.();
        }
      } else {
        if (deltaY > 0) {
          if (enableHaptic) haptic.swipeAction();
          onSwipeDown?.();
        } else {
          if (enableHaptic) haptic.swipeAction();
          onSwipeUp?.();
        }
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
    setIsGesturing(false);
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, enableHaptic]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice || !hasCoarsePointer) {
      return;
    }

    const element = document.body;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isGesturing };
}

export function useSwipeableItem(onSwipe: (direction: 'left' | 'right') => void) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    setOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 100;

    if (Math.abs(offset) > threshold) {
      const direction = offset > 0 ? 'right' : 'left';
      haptic.swipeAction();
      onSwipe(direction);
    }

    setOffset(0);
  };

  return {
    offset,
    isDragging,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
}