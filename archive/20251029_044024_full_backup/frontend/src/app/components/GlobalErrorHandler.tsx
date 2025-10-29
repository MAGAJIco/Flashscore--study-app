'use client';

import { useEffect, useState } from 'react';

interface GlobalError {
  errorId: string;
  message: string;
  timestamp: number;
  type: 'error' | 'unhandledRejection';
  severity: 'low' | 'medium' | 'high';
}

export function GlobalErrorHandler() {
  const [errors, setErrors] = useState<GlobalError[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const severity = getSeverity(event.message);
      
      const globalError: GlobalError = {
        errorId,
        message: event.message,
        timestamp: Date.now(),
        type: 'error',
        severity,
      };

      console.error('🚨 Global Error:', {
        errorId,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });

      logErrorToBackend(globalError, event.error);
      setErrors((prev) => [...prev.slice(-4), globalError]);
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const errorId = `REJ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const message = event.reason?.message || String(event.reason) || 'Unhandled Promise Rejection';
      const severity = getSeverity(message);

      const globalError: GlobalError = {
        errorId,
        message,
        timestamp: Date.now(),
        type: 'unhandledRejection',
        severity,
      };

      console.error('🚨 Unhandled Rejection:', {
        errorId,
        reason: event.reason,
      });

      logErrorToBackend(globalError, event.reason);
      setErrors((prev) => [...prev.slice(-4), globalError]);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const getSeverity = (message: string): 'low' | 'medium' | 'high' => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('network') || lowerMessage.includes('fetch failed')) {
      return 'medium';
    }
    if (lowerMessage.includes('syntax') || lowerMessage.includes('reference')) {
      return 'high';
    }
    return 'low';
  };

  const logErrorToBackend = async (error: GlobalError, originalError: any) => {
    if (process.env.NODE_ENV !== 'production') return;

    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...error,
          stack: originalError?.stack,
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (logError) {
      console.error('Failed to log error to backend:', logError);
    }
  };

  const handleDismiss = (errorId: string) => {
    setDismissed(new Set(dismissed).add(errorId));
  };

  const visibleErrors = errors.filter((err) => !dismissed.has(err.errorId));

  if (visibleErrors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md space-y-2">
      {visibleErrors.map((error) => (
        <div
          key={error.errorId}
          className={`
            rounded-lg shadow-2xl border-l-4 p-4 backdrop-blur-sm animate-slide-up
            ${
              error.severity === 'high'
                ? 'bg-red-500/95 border-red-700'
                : error.severity === 'medium'
                ? 'bg-orange-500/95 border-orange-700'
                : 'bg-yellow-500/95 border-yellow-700'
            }
          `}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">
                  {error.severity === 'high' ? '🚨' : error.severity === 'medium' ? '⚠️' : 'ℹ️'}
                </span>
                <span className="font-bold text-white text-sm">
                  {error.type === 'unhandledRejection' ? 'Promise Rejection' : 'Error'}
                </span>
              </div>
              <p className="text-white text-sm mb-2">{error.message}</p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-white/80 text-xs font-mono">ID: {error.errorId}</p>
              )}
            </div>
            <button
              onClick={() => handleDismiss(error.errorId)}
              className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
