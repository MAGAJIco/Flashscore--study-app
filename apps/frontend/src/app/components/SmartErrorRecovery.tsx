
"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
  retrying: boolean;
}

class SmartErrorRecovery extends Component<Props, State> {
  private retryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorCount: 0,
      retrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by SmartErrorRecovery:', error, errorInfo);
    this.props.onError?.(error, errorInfo);

    // Auto-retry logic
    const { errorCount } = this.state;
    if (errorCount < 3) {
      this.setState({ retrying: true, errorCount: errorCount + 1 });
      this.retryTimeout = setTimeout(() => {
        this.setState({ hasError: false, error: null, retrying: false });
      }, Math.min(1000 * Math.pow(2, errorCount), 5000)); // Exponential backoff
    }
  }

  componentWillUnmount() {
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  handleManualRetry = () => {
    this.setState({ hasError: false, error: null, errorCount: 0 });
  };

  render() {
    const { hasError, error, retrying, errorCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (retrying) {
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">Recovering... Attempt {errorCount}/3</p>
            </div>
          </div>
        );
      }

      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="glass-card p-6 m-4">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
            <p className="text-gray-300 mb-4">
              {error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.handleManualRetry}
              className="ios-button bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export { SmartErrorRecovery };
