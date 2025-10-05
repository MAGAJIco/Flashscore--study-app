import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
import { saveOffline } from '@/utils/offlineStorage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isRetrying: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, isRetrying: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, isRetrying: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    saveOffline('lastError', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    void import('../utils/securityUtils')
      .then(({ default: SecurityUtils }) =>
        SecurityUtils.logSecurityEvent('app_error', {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
        })
      )
      .catch(() => console.warn('SecurityUtils not available for error logging'));

    this.props.onError?.(error, errorInfo);

    // Auto-retry for network errors after 3 seconds
    if (error.message.includes('fetch') || error.message.includes('network')) {
      setTimeout(() => {
        this.setState({ hasError: false });
      }, 3000);
    }
  }

  private handleRetry = async () => {
    this.setState({ isRetrying: true });
    await new Promise(resolve => setTimeout(resolve, 800));

    this.setState({ hasError: false, error: null, isRetrying: false });
    this.props.onRetry?.();
  };

  private handleRefresh = () => {
    if (navigator.vibrate) navigator.vibrate(50);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.container} aria-live="assertive">
          <div className={styles.modal}>
            <div className={styles.backgroundPattern} />
            <div className={styles.icon}>⚠️</div>
            <h1 className={styles.title}>Something Went Wrong</h1>
            <p className={styles.subtitle}>
              We've encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>

            <div className={styles.actions}>
              <button
                className={styles.retryButton}
                onClick={this.handleRetry}
                disabled={this.state.isRetrying}
              >
                {this.state.isRetrying ? (
                  <span className={styles.spinnerWrapper}>
                    <div className={styles.spinner} />
                    Retrying...
                  </span>
                ) : (
                  'Try Again'
                )}
              </button>

              <button className={styles.refreshButton} onClick={this.handleRefresh}>
                Refresh Page
              </button>
            </div>

            <details className={styles.details}>
              <summary className={styles.summary}>Technical Details ▶</summary>
              <pre className={styles.pre}>
                {this.state.error?.message}
                {'\n\n'}
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;