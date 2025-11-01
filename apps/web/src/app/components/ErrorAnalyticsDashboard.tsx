
'use client';

import React, { useEffect, useState } from 'react';

interface ErrorStat {
  type: string;
  count: number;
  lastOccurred: Date;
  resolved: number;
}

export function ErrorAnalyticsDashboard() {
  const [stats, setStats] = useState<ErrorStat[]>([]);
  const [systemHealth, setSystemHealth] = useState<number>(100);

  useEffect(() => {
    // Listen for error events
    const handleError = (event: ErrorEvent) => {
      const errorType = event.error?.name || 'Unknown';
      
      setStats(prev => {
        const existing = prev.find(s => s.type === errorType);
        if (existing) {
          return prev.map(s => 
            s.type === errorType 
              ? { ...s, count: s.count + 1, lastOccurred: new Date() }
              : s
          );
        }
        return [...prev, { type: errorType, count: 1, lastOccurred: new Date(), resolved: 0 }];
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    // Calculate system health
    const totalErrors = stats.reduce((sum, s) => sum + s.count, 0);
    const totalResolved = stats.reduce((sum, s) => sum + s.resolved, 0);
    const health = totalErrors > 0 ? Math.max(0, 100 - (totalErrors - totalResolved) * 5) : 100;
    setSystemHealth(health);
  }, [stats]);

  if (process.env.NODE_ENV !== 'development' || stats.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white">🔍 Error Analytics</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${systemHealth > 80 ? 'bg-green-500' : systemHealth > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {systemHealth.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {stats.map(stat => (
          <div key={stat.type} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-xs">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">{stat.type}</span>
              <span className="text-gray-600 dark:text-gray-400">×{stat.count}</span>
            </div>
            <div className="text-gray-500 dark:text-gray-500 mt-1">
              {stat.lastOccurred.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
