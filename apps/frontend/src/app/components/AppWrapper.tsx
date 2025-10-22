"use client";
import React from "react";
import { ProductionErrorBoundary as ErrorBoundary } from "./ErrorBoundary/ErrorBoundaryWithPerformance";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("App Error:", error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}