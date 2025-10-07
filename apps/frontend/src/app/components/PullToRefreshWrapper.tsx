"use client";

import { useState, useRef, useEffect, ReactNode } from 'react';
import { haptic } from './HapticFeedback';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  pullThreshold?: number;
  maxPullDistance?: number;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
}

export default function PullToRefreshWrapper({
  onRefresh,
  children,
  pullThreshold = 80,
  maxPullDistance = 150,
  refreshingText = 'Refreshing...',
  pullText = 'Pull to refresh',
  releaseText = 'Release to refresh'
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const touchStartY = useRef(0);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollTop = scrollableRef.current?.scrollTop || 0;
    if (scrollTop === 0 && !isRefreshing) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const scrollTop = scrollableRef.current?.scrollTop || 0;
    
    if (scrollTop === 0 && !isRefreshing && touchStartY.current > 0) {
      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStartY.current;
      
      if (distance > 0) {
        e.preventDefault();
        
        const dampedDistance = Math.min(
          distance * 0.5,
          maxPullDistance
        );
        
        setPullDistance(dampedDistance);
        
        if (dampedDistance >= pullThreshold && !canRefresh) {
          setCanRefresh(true);
          haptic.selection();
        } else if (dampedDistance < pullThreshold && canRefresh) {
          setCanRefresh(false);
        }
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= pullThreshold && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
        if (typeof window !== 'undefined') {
          haptic.refreshComplete();
        }
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
          setCanRefresh(false);
          touchStartY.current = 0;
        }, 300);
      }
    } else {
      setPullDistance(0);
      setCanRefresh(false);
      touchStartY.current = 0;
    }
  };

  const getRefreshIndicatorOpacity = () => {
    return Math.min(pullDistance / pullThreshold, 1);
  };

  const getRefreshIndicatorRotation = () => {
    return (pullDistance / pullThreshold) * 360;
  };

  const getRefreshText = () => {
    if (isRefreshing) return refreshingText;
    if (canRefresh) return releaseText;
    return pullText;
  };

  return (
    <div className="pull-to-refresh-container">
      <div 
        className="refresh-indicator"
        style={{
          height: `${isRefreshing ? pullThreshold : pullDistance}px`,
          opacity: isRefreshing ? 1 : getRefreshIndicatorOpacity()
        }}
      >
        <div className="refresh-content">
          <div 
            className={`refresh-spinner ${isRefreshing ? 'spinning' : ''}`}
            style={{
              transform: `rotate(${isRefreshing ? 0 : getRefreshIndicatorRotation()}deg)`
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="refresh-text">{getRefreshText()}</div>
        </div>
      </div>

      <div
        ref={scrollableRef}
        className="scrollable-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease' : 'none'
        }}
      >
        {children}
      </div>

      <style jsx>{`
        .pull-to-refresh-container {
          position: relative;
          height: 100%;
          overflow: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .refresh-indicator {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: linear-gradient(to bottom, #1e293b, transparent);
          z-index: 10;
          transition: opacity 0.2s ease;
          overflow: hidden;
        }

        .refresh-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          color: white;
        }

        .refresh-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          color: #3b82f6;
          transition: transform 0.1s ease;
        }

        .refresh-spinner.spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .refresh-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          letter-spacing: 0.5px;
        }

        .scrollable-content {
          height: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .scrollable-content::-webkit-scrollbar {
          display: none;
        }

        @media (min-width: 768px) {
          .refresh-indicator {
            display: none;
          }
          
          .scrollable-content {
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
