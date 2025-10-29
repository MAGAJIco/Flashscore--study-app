
"use client";

import React from 'react';
import { useKidsMode } from '../hooks/useKidsMode';

interface AgeRestrictionGuardProps {
  children: React.ReactNode;
  feature?: 'betting' | 'payments' | 'fullContent';
  fallback?: React.ReactNode;
}

export function AgeRestrictionGuard({ 
  children, 
  feature = 'fullContent',
  fallback 
}: AgeRestrictionGuardProps) {
  const { isKidsModeEnabled } = useKidsMode();

  if (isKidsModeEnabled) {
    return (
      <>
        {fallback || (
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Kids Mode Active
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              This feature is not available in Kids Mode for your safety.
            </p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
