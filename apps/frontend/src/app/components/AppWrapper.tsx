
"use client";
import React from "react";

// Resilient Error Boundary that always shows MagajiCo branding
class ResilientErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Critical App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                M
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">MagajiCo</h2>
              <p className="text-gray-500 mb-4 text-sm">AI-Powered Sports Predictions</p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-red-600 mb-2">Application Error</h3>
                <p className="text-red-700 text-sm">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Reload App
                </button>
                <button
                  onClick={() => this.setState({ hasError: false })}
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

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ResilientErrorBoundary>
      {children}
    </ResilientErrorBoundary>
  );
}
