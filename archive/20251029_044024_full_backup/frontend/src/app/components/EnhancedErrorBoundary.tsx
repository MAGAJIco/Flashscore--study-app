'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  sectionName: string;
  fallback?: ReactNode;
  showErrorUI?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  errorId?: string;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryTimeout?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { sectionName, onError } = this.props;
    const { errorId } = this.state;

    console.error(
      `❌ [${sectionName}] Error Boundary caught error:`,
      {
        errorId,
        error,
        errorInfo,
        timestamp: new Date().toISOString(),
      }
    );

    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, errorId!);
    }

    if (onError) {
      onError(error, errorInfo);
    }

    this.setState({ errorInfo });
  }

  private async logErrorToService(error: Error, errorInfo: ErrorInfo, errorId: string) {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorId,
          section: this.props.sectionName,
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  private handleRetry = () => {
    const { retryCount } = this.state;

    if (retryCount < this.maxRetries) {
      console.log(`🔄 [${this.props.sectionName}] Retrying... (Attempt ${retryCount + 1}/${this.maxRetries})`);

      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1,
      });

      const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      this.retryTimeout = setTimeout(() => {
        window.location.reload();
      }, backoffDelay);
    }
  };

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  render() {
    const { hasError, error, errorId, retryCount } = this.state;
    const { children, fallback, sectionName, showErrorUI = true } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    if (!showErrorUI) {
      return null;
    }

    const canRetry = retryCount < this.maxRetries;

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800 p-6 my-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg
              className="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
              {sectionName} Unavailable
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              We're having trouble loading this section. Don't worry, the rest of the app is still working!
            </p>
            
            {process.env.NODE_ENV === 'development' && error && (
              <details className="text-xs text-red-600 dark:text-red-400 mb-4">
                <summary className="cursor-pointer font-medium mb-2">Error Details (Development Only)</summary>
                <pre className="bg-red-100 dark:bg-red-900/20 p-3 rounded overflow-auto">
                  <div><strong>Error ID:</strong> {errorId}</div>
                  <div><strong>Message:</strong> {error.message}</div>
                  <div className="mt-2">{error.stack}</div>
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              {canRetry && (
                <button
                  onClick={this.handleRetry}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  🔄 Try Again ({this.maxRetries - retryCount} left)
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors text-sm"
              >
                ↻ Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
