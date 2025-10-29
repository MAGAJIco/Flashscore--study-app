
"use client";

import React, { useState, useRef, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  enableHaptics?: boolean;
  enableAnalytics?: boolean;
  refreshMessage?: string;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  enableHaptics = true,
  enableAnalytics = false,
  refreshMessage = '🔄 Refreshing...'
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics || !('vibrate' in navigator)) return;
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    };
    navigator.vibrate(patterns[type]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setCanPull(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!canPull || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance * 0.5, 100));
      
      if (distance > 80 && enableHaptics) {
        triggerHaptic('light');
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull) return;
    setCanPull(false);

    if (pullDistance > 60) {
      setIsRefreshing(true);
      triggerHaptic('medium');
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <div className={`transform transition-transform ${isRefreshing ? 'animate-spin' : ''}`}>
            {isRefreshing ? '⚡' : '↓'}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
