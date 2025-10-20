
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { triggerFloatingAlert } from '../FloatingAlert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundaryWithPerformance extends Component<Props, State> {
  private performanceStart: number;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.performanceStart = performance.now();
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const performanceEnd = performance.now();
    const renderTime = performanceEnd - this.performanceStart;

    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.log('Render time before error:', renderTime, 'ms');

    this.logErrorToService(error, errorInfo, renderTime);

    this.setState({ error, errorInfo });

    // Trigger floating alert for error notification
    try {
      triggerFloatingAlert({
        type: 'danger',
        title: 'Application Error',
        message: error.message
      });
    } catch (alertError) {
      console.warn('Failed to trigger alert:', alertError);
    }

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo, renderTime: number) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      renderTime,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      timestamp: new Date().toISOString(),
    };

    console.log('Error data for tracking service:', errorData);

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const existingErrors = JSON.parse(localStorage.getItem('error_logs') || '[]');
        existingErrors.unshift(errorData);
        localStorage.setItem('error_logs', JSON.stringify(existingErrors.slice(0, 50)));
      } catch (e) {
        console.warn('Could not save error to localStorage:', e);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                Performance Error Detected
              </h2>
              <p className="text-gray-600 mb-4">
                {this.state.error?.message || 'An unexpected error occurred during rendering'}
              </p>
              <div className="bg-gray-100 p-3 rounded mb-4 text-sm text-left">
                <strong>Performance Impact:</strong> Error occurred during component render cycle
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Reload Application
                </button>
                <button
                  onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryWithPerformance;
