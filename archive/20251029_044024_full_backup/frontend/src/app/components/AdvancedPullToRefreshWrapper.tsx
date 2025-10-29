
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { PullToRefresh } from './PullToRefresh';
import { triggerFloatingAlert } from './FloatingAlert';

interface AdvancedPullToRefreshWrapperProps {
  children: React.ReactNode;
  enableAutoRefresh?: boolean;
  autoRefreshInterval?: number;
  onDataRefresh?: () => Promise<void>;
  refreshEndpoints?: string[];
}

export function AdvancedPullToRefreshWrapper({
  children,
  enableAutoRefresh = false,
  autoRefreshInterval = 30000, // 30 seconds
  onDataRefresh,
  refreshEndpoints = ['/api/predictions', '/api/matches/live'],
}: AdvancedPullToRefreshWrapperProps) {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [refreshCount, setRefreshCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerFloatingAlert({
        type: 'success',
        title: '🌐 Back Online',
        message: 'Connection restored',
        duration: 2000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      triggerFloatingAlert({
        type: 'warning',
        title: '📡 Offline',
        message: 'No internet connection',
        duration: 3000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    if (!enableAutoRefresh || !isOnline) return;

    const interval = setInterval(async () => {
      await handleRefresh(true);
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, autoRefreshInterval, isOnline]);

  const handleRefresh = useCallback(async (isAutoRefresh = false) => {
    if (!isOnline) {
      triggerFloatingAlert({
        type: 'warning',
        title: '📡 Offline',
        message: 'Cannot refresh while offline',
        duration: 2000,
      });
      return;
    }

    const startTime = Date.now();
    const results: { endpoint: string; success: boolean; time: number }[] = [];

    try {
      // Refresh all endpoints in parallel
      const refreshPromises = refreshEndpoints.map(async (endpoint) => {
        const endpointStartTime = Date.now();
        try {
          const response = await fetch(endpoint, { 
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
          });
          
          const success = response.ok;
          results.push({
            endpoint,
            success,
            time: Date.now() - endpointStartTime,
          });

          return success;
        } catch (error) {
          results.push({
            endpoint,
            success: false,
            time: Date.now() - endpointStartTime,
          });
          return false;
        }
      });

      // Call custom refresh handler
      if (onDataRefresh) {
        refreshPromises.push(onDataRefresh().then(() => true).catch(() => false));
      }

      const outcomes = await Promise.all(refreshPromises);
      const allSuccess = outcomes.every(result => result);

      setLastRefresh(new Date());
      setRefreshCount(prev => prev + 1);

      const totalTime = Date.now() - startTime;

      if (!isAutoRefresh) {
        if (allSuccess) {
          triggerFloatingAlert({
            type: 'success',
            title: '✅ Data Refreshed',
            message: `Updated ${refreshEndpoints.length} sources in ${(totalTime / 1000).toFixed(1)}s`,
            duration: 2000,
          });
        } else {
          const failedCount = results.filter(r => !r.success).length;
          triggerFloatingAlert({
            type: 'warning',
            title: '⚠️ Partial Refresh',
            message: `${failedCount} source(s) failed to update`,
            duration: 3000,
          });
        }
      }

      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('dataRefreshed', {
        detail: { results, totalTime, timestamp: new Date() }
      }));

    } catch (error) {
      console.error('Refresh failed:', error);
      
      if (!isAutoRefresh) {
        triggerFloatingAlert({
          type: 'error',
          title: '❌ Refresh Failed',
          message: 'Unable to update data',
          duration: 3000,
        });
      }
    }
  }, [isOnline, refreshEndpoints, onDataRefresh]);

  return (
    <PullToRefresh
      onRefresh={() => handleRefresh(false)}
      enableHaptics={true}
      enableAnalytics={true}
      refreshMessage={`🔄 Refreshing ${refreshEndpoints.length} data sources...`}
    >
      {/* Refresh Stats Badge */}
      {refreshCount > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: '10px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            color: '#60a5fa',
            zIndex: 998,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🔄</span>
          <span>{refreshCount} refresh{refreshCount !== 1 ? 'es' : ''}</span>
        </div>
      )}

      {/* Auto-refresh indicator */}
      {enableAutoRefresh && isOnline && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '8px',
            height: '8px',
            background: '#22c55e',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
            zIndex: 998,
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
          }}
          title={`Auto-refresh every ${autoRefreshInterval / 1000}s`}
        />
      )}

      {children}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </PullToRefresh>
  );
}

// Hook for components to listen to refresh events
export const useRefreshListener = (callback: (detail: any) => void) => {
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail);
    };

    window.addEventListener('dataRefreshed', handler);
    return () => window.removeEventListener('dataRefreshed', handler);
  }, [callback]);
};
