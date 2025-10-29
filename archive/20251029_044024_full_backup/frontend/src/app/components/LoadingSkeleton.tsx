import React from 'react';

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  variant?: 'text' | 'card' | 'list' | 'quiz' | 'news';
  animate?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  lines = 3, 
  className = '',
  variant = 'text',
  animate = true
}) => {
  const baseClasses = `bg-gray-300 rounded ${animate ? 'animate-pulse' : ''}`;

  // Different skeleton layouts for different content types
  const renderTextSkeleton = () => (
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

  const renderCardSkeleton = () => (
    <div className={`border rounded-lg p-4 ${className}`}>
      <div className={`${baseClasses} h-6 w-3/4 mb-3`} />
      <div className={`${baseClasses} h-4 w-full mb-2`} />
      <div className={`${baseClasses} h-4 w-5/6 mb-3`} />
      <div className={`${baseClasses} h-8 w-24 rounded-md`} />
    </div>
  );

  const renderListSkeleton = () => (
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

  const renderQuizSkeleton = () => (
    <div className={`max-w-2xl mx-auto p-6 ${className}`}>
      {/* Question skeleton */}
      <div className={`${baseClasses} h-6 w-full mb-2`} />
      <div className={`${baseClasses} h-6 w-4/5 mb-6`} />
      
      {/* Progress bar skeleton */}
      <div className={`${baseClasses} h-2 w-full mb-6 rounded-full`} />
      
      {/* Answer options skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((option) => (
          <div key={option} className={`${baseClasses} h-12 w-full rounded-lg`} />
        ))}
      </div>
      
      {/* Button skeleton */}
      <div className={`${baseClasses} h-10 w-32 mt-6 rounded-md`} />
    </div>
  );

  const renderNewsSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: Math.min(lines, 3) }).map((_, index) => (
        <article key={index} className="border-b pb-4">
          <div className="flex space-x-4">
            {/* Image skeleton */}
            <div className={`${baseClasses} h-20 w-20 rounded-lg flex-shrink-0`} />
            
            <div className="flex-1">
              {/* Title skeleton */}
              <div className={`${baseClasses} h-5 w-full mb-2`} />
              <div className={`${baseClasses} h-5 w-3/4 mb-2`} />
              
              {/* Content preview skeleton */}
              <div className={`${baseClasses} h-3 w-full mb-1`} />
              <div className={`${baseClasses} h-3 w-4/5 mb-2`} />
              
              {/* Meta info skeleton */}
              <div className="flex space-x-4">
                <div className={`${baseClasses} h-3 w-16`} />
                <div className={`${baseClasses} h-3 w-20`} />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'card':
      return renderCardSkeleton();
    case 'list':
      return renderListSkeleton();
    case 'quiz':
      return renderQuizSkeleton();
    case 'news':
      return renderNewsSkeleton();
    default:
      return renderTextSkeleton();
  }
};

// Specialized skeleton components for common use cases
export const NewsLoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <LoadingSkeleton variant="news" lines={count} />
);

export const QuizLoadingSkeleton: React.FC = () => (
  <LoadingSkeleton variant="quiz" />
);

export const CardLoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="card" className={className} />
);

export const ListLoadingSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <LoadingSkeleton variant="list" lines={items} />
);