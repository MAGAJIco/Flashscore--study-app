"use client";
import React, { useState } from "react";

type RetryBoundaryProps = {
  children: React.ReactNode;
  fallback?: (error: Error | null, onRetry: () => void) => React.ReactNode;
};

class ErrorBoundary extends React.Component<{ 
  resetKey: number;
  fallbackRender?: (error: Error | null, onRetry: () => void) => React.ReactNode;
  onRetry?: () => void;
}> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // Log the error for diagnostics
    // You can hook this into your logging service here
    // eslint-disable-next-line no-console
    console.error("RetryBoundary caught an error:", error, info);
  }

  componentDidUpdate(prevProps: any) {
    // When resetKey changes, clear the error state so children remount
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      const onRetry = () => {
        // call parent's onRetry to update resetKey
        this.props.onRetry?.();
      };

      if (this.props.fallbackRender) {
        return this.props.fallbackRender(this.state.error, onRetry);
      }

      return (
        <div role="alert" className="p-4 bg-red-900 text-white rounded">
          <p className="font-semibold">Something went wrong.</p>
          <pre className="text-xs my-2">{String(this.state.error)}</pre>
          <div className="mt-2">
            <button
              onClick={onRetry}
              className="px-3 py-1 rounded bg-green-400 text-black hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default function RetryBoundary({ children, fallback }: RetryBoundaryProps) {
  const [resetKey, setResetKey] = useState(0);
  const handleRetry = () => setResetKey((k) => k + 1);

  return (
    <ErrorBoundary resetKey={resetKey} fallbackRender={fallback} onRetry={handleRetry}>
      {children}
    </ErrorBoundary>
  );
}