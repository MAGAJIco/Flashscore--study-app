
'use client';

import React, { useState, useEffect } from 'react';

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: string;
  component?: string;
  userAgent?: string;
  url?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function ErrorMonitor() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadErrorLogs();
    
    // Listen for new errors
    const handleError = (event: ErrorEvent) => {
      logError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const loadErrorLogs = () => {
    try {
      const stored = localStorage.getItem('error_logs');
      if (stored) {
        setErrors(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not load error logs:', e);
    }
  };

  const logError = (errorData: any) => {
    const newError: ErrorLog = {
      id: Date.now().toString(),
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: errorData.url || window.location.href,
      severity: determineSeverity(errorData.message)
    };

    setErrors(prev => {
      const updated = [newError, ...prev].slice(0, 100); // Keep last 100 errors
      try {
        localStorage.setItem('error_logs', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save error logs:', e);
      }
      return updated;
    });
  };

  const determineSeverity = (message: string): ErrorLog['severity'] => {
    if (message.toLowerCase().includes('critical') || message.toLowerCase().includes('crash')) {
      return 'critical';
    }
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
      return 'high';
    }
    if (message.toLowerCase().includes('warning') || message.toLowerCase().includes('deprecated')) {
      return 'medium';
    }
    return 'low';
  };

  const clearErrors = () => {
    setErrors([]);
    localStorage.removeItem('error_logs');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-white bg-gradient-to-r from-red-600 to-red-700';
      case 'high': return 'text-white bg-gradient-to-r from-orange-600 to-orange-700';
      case 'medium': return 'text-white bg-gradient-to-r from-yellow-600 to-yellow-700';
      case 'low': return 'text-white bg-gradient-to-r from-blue-600 to-blue-700';
      default: return 'text-white bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 right-4 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all z-50 font-bold text-lg ${
          errors.length > 0 
            ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse hover:from-red-600 hover:to-red-800' 
            : 'bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800'
        }`}
        title={`${errors.length} errors logged`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{errors.length > 0 ? '🐛' : '✅'}</span>
          {errors.length > 0 && (
            <span className="bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {errors.length}
            </span>
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-900/20 to-orange-900/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🐛</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Error Monitor</h2>
                <p className="text-sm text-gray-400">{errors.length} errors detected</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearErrors}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-red-500/50 font-medium"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all shadow-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        
        {/* Error List */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6">
          {errors.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-7xl mb-4">✨</div>
              <p className="text-xl font-semibold text-gray-300 mb-2">All Clear!</p>
              <p className="text-gray-500">No errors detected. System is healthy.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {errors.map(error => (
                <div 
                  key={error.id} 
                  className={`rounded-xl p-5 border-l-4 backdrop-blur-sm transition-all hover:scale-[1.02] ${
                    error.severity === 'critical'
                      ? 'bg-red-900/20 border-red-500 shadow-lg shadow-red-500/20'
                      : error.severity === 'high'
                      ? 'bg-orange-900/20 border-orange-500 shadow-lg shadow-orange-500/20'
                      : error.severity === 'medium'
                      ? 'bg-yellow-900/20 border-yellow-500 shadow-lg shadow-yellow-500/20'
                      : 'bg-blue-900/20 border-blue-500 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getSeverityColor(error.severity)} shadow-md`}>
                        {error.severity}
                      </span>
                      {error.severity === 'critical' && (
                        <span className="animate-pulse text-red-400">⚠️</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      {new Date(error.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="font-semibold text-white mb-2 text-lg leading-relaxed">
                    {error.message}
                  </p>
                  
                  {error.stack && (
                    <details className="mt-3 group">
                      <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300 font-medium flex items-center gap-2">
                        <span className="group-open:rotate-90 transition-transform">▶</span>
                        Stack Trace
                      </summary>
                      <pre className="text-xs bg-black/40 p-4 rounded-lg mt-2 overflow-x-auto text-gray-300 border border-gray-700 font-mono">
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
