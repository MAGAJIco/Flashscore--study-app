
"use client";

import React, { useState, useEffect } from 'react';

interface DiagnosticIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'hydration' | 'network' | 'storage' | 'component';
  message: string;
  autoFix?: () => void;
  suggestion: string;
}

export function AutoDiagnostics() {
  const [issues, setIssues] = useState<DiagnosticIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const runDiagnostics = () => {
    setIsScanning(true);
    const detected: DiagnosticIssue[] = [];

    // Check localStorage availability
    try {
      localStorage.getItem('test');
    } catch (e) {
      detected.push({
        id: 'storage-1',
        severity: 'high',
        category: 'storage',
        message: 'localStorage is not available',
        suggestion: 'Enable storage in browser settings or use IndexedDB fallback'
      });
    }

    // Check for hydration markers
    if (typeof window !== 'undefined') {
      try {
        const hydrationErrors = localStorage.getItem('error_logs');
        if (hydrationErrors && hydrationErrors.includes('hydration')) {
        detected.push({
            id: 'hydration-1',
            severity: 'critical',
            category: 'hydration',
            message: 'Hydration mismatch detected',
            autoFix: () => {
              // Clear problematic cached data
              ['crossPlatformSettings', 'offlineQueue', 'microPredictions'].forEach(key => {
                localStorage.removeItem(key);
              });
              window.location.reload();
            },
            suggestion: 'Clear cached data and reload'
          });
        }
      } catch (e) {
        console.warn('Error checking hydration markers:', e);
      }
    }

    // Check backend connectivity
    fetch('/api/health')
      .catch(() => {
        detected.push({
          id: 'network-1',
          severity: 'critical',
          category: 'network',
          message: 'Backend service unavailable',
          suggestion: 'Start backend service or check API configuration'
        });
      })
      .finally(() => {
        setIssues(detected);
        setIsScanning(false);
      });
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-2xl p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">🔍 System Diagnostics</h3>
        <button
          onClick={runDiagnostics}
          disabled={isScanning}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {issues.length === 0 ? (
        <p className="text-green-600 text-sm">✓ No issues detected</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {issues.map(issue => (
            <div
              key={issue.id}
              className={`p-3 rounded border-l-4 ${
                issue.severity === 'critical'
                  ? 'bg-red-50 border-red-500'
                  : issue.severity === 'high'
                  ? 'bg-orange-50 border-orange-500'
                  : 'bg-yellow-50 border-yellow-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{issue.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{issue.suggestion}</p>
                </div>
                {issue.autoFix && (
                  <button
                    onClick={issue.autoFix}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    Auto-Fix
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
