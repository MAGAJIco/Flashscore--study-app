
'use client';

import React, { useState, useEffect } from 'react';
import { useMobile } from '@hooks/useMobile';

interface UnifiedError {
  id: string;
  source: 'frontend' | 'backend' | 'ml';
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  stack?: string;
  metadata?: Record<string, any>;
}

export default function UnifiedErrorDashboard() {
  const [errors, setErrors] = useState<UnifiedError[]>([]);
  const [filter, setFilter] = useState<'all' | 'frontend' | 'backend' | 'ml'>('all');
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    loadAllErrors();
    const interval = setInterval(loadAllErrors, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllErrors = async () => {
    try {
      // Frontend errors
      const frontendLogs = JSON.parse(localStorage.getItem('error_logs') || '[]');
      
      // Backend errors
      const backendResponse = await fetch('/api/backend/errors?limit=50');
      const backendData = await backendResponse.json();
      
      const combined: UnifiedError[] = [
        ...frontendLogs.map((e: any) => ({
          id: e.id || Date.now().toString(),
          source: 'frontend' as const,
          type: e.type || 'runtime',
          message: e.message,
          severity: e.severity || 'medium',
          timestamp: e.timestamp,
          stack: e.stack,
          metadata: e
        })),
        ...(backendData.data || []).map((e: any) => ({
          id: e._id,
          source: 'backend' as const,
          type: e.type,
          message: e.message,
          severity: e.severity,
          timestamp: e.createdAt,
          stack: e.stack,
          metadata: e.metadata
        }))
      ];

      combined.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setErrors(combined);
    } catch (error) {
      console.warn('Failed to load unified errors:', error);
    }
  };

  const filteredErrors = filter === 'all' 
    ? errors 
    : errors.filter(e => e.source === filter);

  const criticalCount = errors.filter(e => e.severity === 'critical').length;
  const highCount = errors.filter(e => e.severity === 'high').length;

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-32 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center gap-2"
      >
        <span className="text-xl">🔍</span>
        {criticalCount > 0 && (
          <span className="bg-red-700 px-2 py-1 rounded-full text-xs font-bold">
            {criticalCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🔍</span>
              Unified Error Intelligence
            </h2>
            <button
              onClick={() => setIsVisible(false)}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-white font-medium"
            >
              Close
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-xs text-gray-300">Total Errors</div>
              <div className="text-2xl font-bold text-white">{errors.length}</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-3">
              <div className="text-xs text-red-200">Critical</div>
              <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
            </div>
            <div className="bg-orange-500/20 rounded-lg p-3">
              <div className="text-xs text-orange-200">High</div>
              <div className="text-2xl font-bold text-orange-400">{highCount}</div>
            </div>
            <div className="bg-blue-500/20 rounded-lg p-3">
              <div className="text-xs text-blue-200">Frontend</div>
              <div className="text-2xl font-bold text-blue-400">
                {errors.filter(e => e.source === 'frontend').length}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-700 flex gap-2 overflow-x-auto">
          {(['all', 'frontend', 'backend', 'ml'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && (
                <span className="ml-2 text-xs opacity-70">
                  ({errors.filter(e => e.source === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error List */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-4">
          {filteredErrors.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-6xl mb-4">✨</div>
              <p className="text-lg">No errors found! System is healthy.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredErrors.map(error => (
                <div
                  key={error.id}
                  className={`rounded-lg p-4 border-l-4 ${
                    error.severity === 'critical'
                      ? 'bg-red-900/20 border-red-500'
                      : error.severity === 'high'
                      ? 'bg-orange-900/20 border-orange-500'
                      : error.severity === 'medium'
                      ? 'bg-yellow-900/20 border-yellow-500'
                      : 'bg-blue-900/20 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        error.source === 'frontend' ? 'bg-blue-500' :
                        error.source === 'backend' ? 'bg-green-500' : 'bg-purple-500'
                      }`}>
                        {error.source.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                        {error.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-white font-medium mb-2">{error.message}</p>
                  
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                        Stack Trace
                      </summary>
                      <pre className="text-xs bg-black/30 p-2 rounded mt-1 overflow-x-auto text-gray-300">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
