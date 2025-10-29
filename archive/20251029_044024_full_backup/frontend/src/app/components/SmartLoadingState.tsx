
"use client";

import React from 'react';

interface SmartLoadingStateProps {
  type: 'card' | 'list' | 'table' | 'chart' | 'dashboard';
  count?: number;
  animate?: boolean;
}

const SmartLoadingState: React.FC<SmartLoadingStateProps> = ({
  type,
  count = 3,
  animate = true
}) => {
  const pulseClass = animate ? 'animate-pulse' : '';

  const CardSkeleton = () => (
    <div className={`bg-white/5 rounded-lg p-4 ${pulseClass}`}>
      <div className="h-4 bg-white/10 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-white/10 rounded w-1/2 mb-2"></div>
      <div className="h-20 bg-white/10 rounded mb-3"></div>
      <div className="h-3 bg-white/10 rounded w-5/6"></div>
    </div>
  );

  const ListSkeleton = () => (
    <div className={`bg-white/5 rounded-lg p-3 mb-2 ${pulseClass}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/10 rounded-full"></div>
        <div className="flex-1">
          <div className="h-3 bg-white/10 rounded w-3/4 mb-2"></div>
          <div className="h-2 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const TableSkeleton = () => (
    <div className={`bg-white/5 rounded-lg overflow-hidden ${pulseClass}`}>
      <div className="h-12 bg-white/10 border-b border-white/5"></div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 bg-white/5 border-b border-white/5 p-4">
          <div className="h-3 bg-white/10 rounded w-full"></div>
        </div>
      ))}
    </div>
  );

  const ChartSkeleton = () => (
    <div className={`bg-white/5 rounded-lg p-4 ${pulseClass}`}>
      <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="flex items-end gap-2 h-40">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-white/10 rounded-t"
            style={{ height: `${Math.random() * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  );

  const DashboardSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />);
      case 'list':
        return Array.from({ length: count }).map((_, i) => <ListSkeleton key={i} />);
      case 'table':
        return <TableSkeleton />;
      case 'chart':
        return <ChartSkeleton />;
      case 'dashboard':
        return <DashboardSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return <div className="w-full">{renderSkeleton()}</div>;
};

export { SmartLoadingState };
