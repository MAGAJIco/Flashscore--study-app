
import React from 'react';

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  variant?: 'text' | 'card' | 'list';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  lines = 3, 
  className = '',
  variant = 'text'
}) => {
  const baseClasses = 'bg-gray-300 dark:bg-gray-700 rounded animate-pulse';

  if (variant === 'card') {
    return (
      <div className={`border rounded-xl p-6 ${className}`}>
        <div className={`${baseClasses} h-6 w-3/4 mb-4`} />
        <div className={`${baseClasses} h-4 w-full mb-2`} />
        <div className={`${baseClasses} h-4 w-5/6 mb-4`} />
        <div className={`${baseClasses} h-8 w-24 rounded-md`} />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`${baseClasses} h-12 w-12 rounded-full flex-shrink-0`} />
            <div className="flex-1">
              <div className={`${baseClasses} h-4 w-3/4 mb-2`} />
              <div className={`${baseClasses} h-3 w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} h-4 ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};
