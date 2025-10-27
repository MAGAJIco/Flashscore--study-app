//app/components/AppWrapper.tsx
"use client";
import React from "react";
import { usePathname } from 'next/navigation';
import { DIYF } from '@/app/components/DIYF';

// Simplified Error Boundary
class ResilientErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Reload App
            </button>
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
      <DIYF>
        {children}
      </DIYF>
    </ResilientErrorBoundary>
  );
}