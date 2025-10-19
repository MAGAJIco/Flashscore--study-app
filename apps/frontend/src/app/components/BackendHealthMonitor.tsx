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

    // Check backend API with metrics
    try {
      const res = await fetch('/api/backend/health', { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const data = await res.json();
        newHealth.backend = data.status === 'ok' || data.status === 'degraded' ? 'online' : 'offline';
        newHealth.database = data.db?.status === 'ok' ? 'online' : 'offline';
        
        // Track metrics in console for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Backend Health:', data);
        }
      } else {
        newHealth.backend = 'offline';
        newHealth.database = 'offline';
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Backend health check failed:', err instanceof Error ? err.message : 'Unknown error');
      }
      newHealth.backend = 'offline';
      newHealth.database = 'offline';
    }

    // Check ML service
    try {
      const res = await fetch('/api/ml/health', { signal: AbortSignal.timeout(5000) });
      newHealth.ml = res.ok ? 'online' : 'offline';
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('ML health check failed:', err instanceof Error ? err.message : 'Unknown error');
      }
      newHealth.ml = 'offline';
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
  const healthStatus = allOnline ? 'online' : 'error'; // Simplified health status for the warning message

  // Render the connection error message if any service is offline
  if (healthStatus === 'error') {
    return (
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.98), rgba(220, 38, 38, 0.98))',
        backdropFilter: 'blur(10px)',
        color: 'white',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
        zIndex: 9999,
        maxWidth: '380px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <span style={{ fontSize: '2rem', animation: 'pulse 2s infinite' }}>⚠️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>
              Connection Issue Detected
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.95, marginBottom: '12px', lineHeight: '1.5' }}>
              We're having trouble connecting to our servers. Your predictions are saved locally and will sync when connection is restored.
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={checkHealth}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                🔄 Retry Now
              </button>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                Auto-retry in {60 - (Date.now() % 60000) / 1000 | 0}s
              </span>
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
        `}</style>
      </div>
    );
  }

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
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">DB Connected:</span>
              <span className={`text-xs font-bold ${health.database === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                {health.database === 'online' ? '✓ True' : '✗ False'}
              </span>
            </div>
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