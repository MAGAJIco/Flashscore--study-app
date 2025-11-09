
'use client';

import React, { useState, useRef, useCallback } from 'react';

interface TouchOptimizedProps {
  children: React.ReactNode;
  onTap?: () => void;
  onLongPress?: () => void;
  haptic?: boolean;
  debounce?: number;
}

export function TouchOptimized({ 
  children, 
  onTap, 
  onLongPress,
  haptic = true,
  debounce = 300 
}: TouchOptimizedProps) {
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef<number>(0);

  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!haptic || !('vibrate' in navigator)) return;
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30, 10, 20]
    };
    navigator.vibrate(patterns[type]);
  }, [haptic]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    setIsPressed(true);
    triggerHaptic('light');

    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        triggerHaptic('medium');
        onLongPress();
        setIsPressed(false);
      }, 500);
    }
  }, [onLongPress, triggerHaptic]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (onTap) {
      const now = Date.now();
      if (now - lastTap.current > debounce) {
        lastTap.current = now;
        onTap();
      }
    }
  }, [onTap, debounce]);

  const handleTouchCancel = useCallback(() => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      className={`transition-transform duration-100 ${isPressed ? 'scale-95' : 'scale-100'}`}
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        cursor: 'pointer'
      }}
    >
      {children}
    </div>
  );
}
