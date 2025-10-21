
"use client";

import React, { Suspense, lazy } from 'react';

interface LazyComponentProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ 
  importFunc, 
  fallback = <div className="animate-pulse bg-gray-200 rounded h-32 w-full"></div>,
  children
}) => {
  const Component = lazy(importFunc);

  return (
    <Suspense fallback={fallback}>
      <Component>{children}</Component>
    </Suspense>
  );
};
