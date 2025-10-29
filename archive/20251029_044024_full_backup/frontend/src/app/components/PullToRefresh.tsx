"use client";

import React, { useRef, useEffect, useState, ReactNode, useCallback } from 'react';
import { triggerFloatingAlert } from './FloatingAlert';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  threshold?: number;
  maxPullDistance?: number;
  enableHaptics?: boolean;
  enableAnalytics?: boolean;
  refreshMessage?: string;
  errorMessage?: string;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPullDistance = 120,
  enableHaptics = true,
  enableAnalytics = true,
  refreshMessage = '🔄 Refreshing data...',
  errorMessage = '❌ Refresh failed',
}: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics) return;
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30]
      };
      navigator.vibrate(patterns[type]);
    }
  }, [enableHaptics]);

  // Analytics tracking
  const trackRefresh = useCallback((success: boolean, duration: number) => {
    if (!enableAnalytics) return;

    const analyticsData = {
      event: 'pull_to_refresh',
      success,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage for analytics
    try {
      const existingData = JSON.parse(localStorage.getItem('refresh_analytics') || '[]');
      existingData.push(analyticsData);
      localStorage.setItem('refresh_analytics', JSON.stringify(existingData.slice(-100)));
    } catch (error) {
      console.error('Failed to track refresh:', error);
    }
  }, [enableAnalytics]);

  const handleTouchStart = (e: TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    currentY.current = e.touches[0].clientY;
    const distance = Math.min(
      Math.max(0, currentY.current - startY.current),
      maxPullDistance
    );
    setPullDistance(distance);

    // Haptic feedback at threshold
    if (distance >= threshold && distance < threshold + 10) {
      triggerHaptic('medium');
    }

    if (distance > 0) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling || isRefreshing) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      triggerHaptic('heavy');

      const startTime = Date.now();

      try {
        // Show loading alert
        triggerFloatingAlert({
          type: 'info',
          title: refreshMessage,
          message: 'Fetching latest data...',
          duration: 2000,
        });

        await onRefresh();

        const duration = Date.now() - startTime;
        setLastRefreshTime(new Date());
        trackRefresh(true, duration);

        triggerFloatingAlert({
          type: 'success',
          title: '✅ Refreshed Successfully',
          message: `Data updated in ${(duration / 1000).toFixed(1)}s`,
          duration: 2000,
        });

        triggerHaptic('medium');
      } catch (error) {
        const duration = Date.now() - startTime;
        trackRefresh(false, duration);

        triggerFloatingAlert({
          type: 'error',
          title: errorMessage,
          message: 'Please try again',
          duration: 3000,
        });

        triggerHaptic('heavy');
      } finally {
        refreshTimeoutRef.current = setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      setPullDistance(0);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isPulling, pullDistance, isRefreshing]);

  const rotation = (pullDistance / threshold) * 360;
  const opacity = Math.min(pullDistance / threshold, 1);
  const scale = 0.8 + (opacity * 0.2);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100%',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${isRefreshing ? pullDistance : pullDistance - 60}px) scale(${scale})`,
          transition: isRefreshing || !isPulling ? 'transform 0.3s ease' : 'none',
          zIndex: 1000,
          opacity: isRefreshing ? 1 : opacity,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isRefreshing
              ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
              : 'linear-gradient(135deg, #00ff88, #00d4ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${isRefreshing ? 'rgba(59, 130, 246, 0.4)' : 'rgba(0, 255, 136, 0.3)'}`,
            transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
            transition: isRefreshing ? 'none' : 'transform 0.1s ease',
          }}
        >
          {isRefreshing ? (
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ) : (
            <span
              style={{
                fontSize: '1.2rem',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              ↓
            </span>
          )}
        </div>
      </div>

      {/* Last Refresh Indicator */}
      {lastRefreshTime && !isRefreshing && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '4px 8px',
            borderRadius: '12px',
            zIndex: 999,
          }}
        >
          Last: {lastRefreshTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      <div style={{ paddingTop: isRefreshing ? `${pullDistance}px` : '0px' }}>
        {children}
      </div>

      <style jsx global>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

// Hook for programmatic refresh
export const usePullToRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async (refreshFn: () => Promise<void>) => {
    setIsRefreshing(true);
    try {
      await refreshFn();
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return { isRefreshing, refresh };
};