
'use client';

import React, { useEffect, useState } from 'react';

interface ErrorRecoveryAction {
  id: string;
  errorType: string;
  action: () => void;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export default function ErrorRecoverySystem() {
  const [recoveryActions, setRecoveryActions] = useState<ErrorRecoveryAction[]>([]);
  const [autoRecoveryEnabled, setAutoRecoveryEnabled] = useState(true);

  useEffect(() => {
    // Define recovery actions for common errors
    const actions: ErrorRecoveryAction[] = [
      {
        id: 'clear-cache',
        errorType: 'cache',
        action: () => {
          localStorage.clear();
          sessionStorage.clear();
          caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
        },
        description: 'Clear all cached data',
        priority: 'medium'
      },
      {
        id: 'reload-page',
        errorType: 'component',
        action: () => window.location.reload(),
        description: 'Reload the page',
        priority: 'high'
      },
      {
        id: 'reset-state',
        errorType: 'state',
        action: () => {
          const keysToKeep = ['theme', 'language'];
          Object.keys(localStorage).forEach(key => {
            if (!keysToKeep.includes(key)) {
              localStorage.removeItem(key);
            }
          });
        },
        description: 'Reset application state',
        priority: 'high'
      },
      {
        id: 'offline-mode',
        errorType: 'network',
        action: () => {
          localStorage.setItem('force-offline-mode', 'true');
          window.location.href = '/offline.html';
        },
        description: 'Switch to offline mode',
        priority: 'medium'
      }
    ];

    setRecoveryActions(actions);

    // Auto-recovery system
    const handleError = (event: ErrorEvent) => {
      if (!autoRecoveryEnabled) return;

      const errorMessage = event.message.toLowerCase();
      
      // Identify error type and attempt recovery
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        const action = actions.find(a => a.errorType === 'network');
        if (action) {
          console.log('Auto-recovering from network error...');
          setTimeout(action.action, 2000);
        }
      } else if (errorMessage.includes('cache') || errorMessage.includes('storage')) {
        const action = actions.find(a => a.errorType === 'cache');
        if (action) {
          console.log('Auto-recovering from cache error...');
          action.action();
        }
      }
    };

    window.addEventListener('error', handleError);

    return () => window.removeEventListener('error', handleError);
  }, [autoRecoveryEnabled]);

  return (
    <div className="fixed bottom-20 right-20 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            🔧 Auto-Recovery
          </h3>
          <button
            onClick={() => setAutoRecoveryEnabled(!autoRecoveryEnabled)}
            className={`px-3 py-1 rounded text-xs font-medium ${
              autoRecoveryEnabled
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            {autoRecoveryEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="space-y-2">
          {recoveryActions.map(action => (
            <button
              key={action.id}
              onClick={action.action}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{action.description}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  action.priority === 'critical' ? 'bg-red-100 text-red-700' :
                  action.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                  action.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {action.priority}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
