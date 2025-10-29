
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useGestureControls } from '@/app/hooks/useGestureControls';
import { haptic } from './HapticFeedback';
import { useState } from 'react';

interface SwipeNavigationWrapperProps {
  children: React.ReactNode;
  routes: {
    left?: string;
    right?: string;
  };
}

export function SwipeNavigationWrapper({ children, routes }: SwipeNavigationWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useGestureControls({
    onSwipeLeft: () => {
      if (routes.left && !isTransitioning) {
        setIsTransitioning(true);
        haptic.swipeAction();
        router.push(routes.left);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    onSwipeRight: () => {
      if (routes.right && !isTransitioning) {
        setIsTransitioning(true);
        haptic.swipeAction();
        router.push(routes.right);
        setTimeout(() => setIsTransitioning(false), 300);
      }
    },
    threshold: 100,
    enableHaptic: true
  });

  return (
    <div 
      className={`swipe-navigation-wrapper ${isTransitioning ? 'transitioning' : ''}`}
      style={{
        transition: isTransitioning ? 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none'
      }}
    >
      {children}
      
      {/* Swipe Indicators */}
      {routes.left && (
        <div className="swipe-indicator swipe-left">
          <div className="indicator-arrow">←</div>
        </div>
      )}
      {routes.right && (
        <div className="swipe-indicator swipe-right">
          <div className="indicator-arrow">→</div>
        </div>
      )}

      <style jsx>{`
        .swipe-navigation-wrapper {
          position: relative;
          min-height: 100vh;
        }

        .swipe-indicator {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: opacity 0.2s ease;
          pointer-events: none;
          z-index: 1000;
        }

        .swipe-left {
          left: 20px;
        }

        .swipe-right {
          right: 20px;
        }

        .indicator-arrow {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .transitioning .swipe-indicator {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
