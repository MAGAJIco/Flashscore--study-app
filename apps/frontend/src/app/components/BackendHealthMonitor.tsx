
"use client";

import React, { useState, useEffect } from 'react';

interface HealthStatus {
  backend: 'online' | 'offline' | 'checking';
  ml: 'online' | 'offline' | 'checking';
  database: 'online' | 'offline' | 'checking';
  lastCheck: Date;
}

export default function BackendHealthMonitor() {
  const [health, setHealth] = useState<HealthStatus>({
    backend: 'checking',
    ml: 'checking',
    database: 'checking',
    lastCheck: new Date()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const checkHealth = async () => {
    const newHealth: HealthStatus = {
      backend: 'checking',
      ml: 'checking',
      database: 'checking',
      lastCheck: new Date()
    };

    // Check backend API
    try {
      const res = await fetch('/api/health', { signal: AbortSignal.timeout(5000) });
      newHealth.backend = res.ok ? 'online' : 'offline';
    } catch {
      newHealth.backend = 'offline';
    }

    // Check ML service
    try {
      const res = await fetch('/api/ml/health', { signal: AbortSignal.timeout(5000) });
      newHealth.ml = res.ok ? 'online' : 'offline';
    } catch {
      newHealth.ml = 'offline';
    }

    // Check database through backend
    try {
      const res = await fetch('/api/predictions?limit=1', { signal: AbortSignal.timeout(5000) });
      newHealth.database = res.ok ? 'online' : 'offline';
    } catch {
      newHealth.database = 'offline';
    }

    setHealth(newHealth);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-yellow-500 animate-pulse';
    }
  };

  const allOnline = health.backend === 'online' && health.ml === 'online' && health.database === 'online';

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-3 py-2 rounded-full shadow-lg ${allOnline ? 'bg-green-100' : 'bg-red-100'} hover:shadow-xl transition-all`}
      >
        <span className="text-sm font-medium">
          {allOnline ? '✓ System Online' : '⚠ System Issues'}
        </span>
      </button>

      {isExpanded && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-2xl p-4 min-w-[250px]">
          <h4 className="font-bold mb-3">Service Status</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Backend API</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(health.backend)}`} />
                <span className="text-xs text-gray-600">{health.backend}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">ML Service</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(health.ml)}`} />
                <span className="text-xs text-gray-600">{health.ml}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(health.database)}`} />
                <span className="text-xs text-gray-600">{health.database}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-gray-500">
              Last checked: {health.lastCheck.toLocaleTimeString()}
            </p>
            <button
              onClick={checkHealth}
              className="mt-2 w-full px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
