
"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'text-blue-500' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-current ${sizeClasses[size]} ${color}`}></div>
  );
};

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded ${width} ${height} ${className}`}></div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 animate-pulse">
    <Skeleton height="h-6" width="w-3/4" className="mb-4" />
    <Skeleton height="h-4" width="w-full" className="mb-2" />
    <Skeleton height="h-4" width="w-2/3" className="mb-4" />
    <div className="flex gap-2">
      <Skeleton height="h-8" width="w-16" />
      <Skeleton height="h-8" width="w-20" />
    </div>
  </div>
);

export const TableSkeleton: React.FC = () => (
  <div className="bg-gray-800/20 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6">
    <Skeleton height="h-8" width="w-1/2" className="mb-6" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 mb-4">
        <Skeleton height="h-10" width="w-10" className="rounded-full" />
        <div className="flex-1">
          <Skeleton height="h-4" width="w-3/4" className="mb-2" />
          <Skeleton height="h-3" width="w-1/2" />
        </div>
        <Skeleton height="h-8" width="w-20" />
      </div>
    ))}
  </div>
);

interface LoadingStateProps {
  type: 'spinner' | 'skeleton' | 'card' | 'table';
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ type, message }) => {
  const renderLoadingContent = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            {message && <p className="text-gray-400 mt-4">{message}</p>}
          </div>
        );
      case 'card':
        return <CardSkeleton />;
      case 'table':
        return <TableSkeleton />;
      case 'skeleton':
      default:
        return (
          <div className="space-y-4">
            <Skeleton height="h-6" width="w-1/2" />
            <Skeleton height="h-4" width="w-full" />
            <Skeleton height="h-4" width="w-3/4" />
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderLoadingContent()}
    </div>
  );
};

export { LoadingState };
