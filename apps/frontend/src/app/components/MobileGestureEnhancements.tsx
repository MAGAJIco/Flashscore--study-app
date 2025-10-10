
"use client";

import React, { useEffect, useState } from 'react';
import { useGestureControls } from '../hooks/useGestureControls';
import { haptic } from './HapticFeedback';

interface MobileGestureEnhancementsProps {
  onRefresh?: () => void;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
}

export default function MobileGestureEnhancements({
  onRefresh,
  onNavigateBack,
  onNavigateForward
}: MobileGestureEnhancementsProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useGestureControls({
    onSwipeLeft: () => {
      haptic.swipeAction();
      onNavigateForward?.();
    },
    onSwipeRight: () => {
      haptic.swipeAction();
      onNavigateBack?.();
    },
    onSwipeDown: async () => {
      if (window.scrollY === 0 && onRefresh) {
        setIsRefreshing(true);
        haptic.refreshComplete();
        await onRefresh();
        setIsRefreshing(false);
      }
    },
    threshold: 80,
    enableHaptic: true
  });

  return (
    <>
      {isRefreshing && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(34, 197, 94, 0.95)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '24px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'slideDown 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid white',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
          <span style={{ fontWeight: '600' }}>Refreshing...</span>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
