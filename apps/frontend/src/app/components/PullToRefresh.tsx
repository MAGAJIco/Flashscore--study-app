"use client";

import React, { useState, useRef, useEffect, ReactNode } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  const threshold = 80;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshing || container.scrollTop !== 0) return;

      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;

      if (distance > 0) {
        e.preventDefault();
        const dampedDistance = Math.min(distance * 0.5, threshold * 1.5);
        setPullDistance(dampedDistance);
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
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

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh, threshold]);

  const rotation = Math.min((pullDistance / threshold) * 360, 360);
  const opacity = Math.min(pullDistance / threshold, 1);
  const isPulling = pullDistance > 0;

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
          transform: `translateX(-50%) translateY(${isRefreshing ? pullDistance : pullDistance - 60}px)`,
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
            background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)',
            transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
            transition: isRefreshing ? 'none' : 'transform 0.1s ease',
          }}
        >
          {isRefreshing ? (
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '3px solid #000',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          ) : (
            <span style={{ color: '#000', fontSize: '1.2rem', fontWeight: 'bold' }}>↓</span>
          )}
        </div>
      </div>

      <div
        style={{
          paddingTop: isRefreshing ? `${threshold}px` : 0,
          transition: isRefreshing ? 'padding-top 0.3s ease' : 'none',
        }}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
