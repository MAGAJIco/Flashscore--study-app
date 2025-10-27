"use client";

import React from 'react';

interface UnifiedSportsHubProps {
  initialTab?: string;
  showPortalView?: boolean;
}

export function UnifiedSportsHub({ initialTab = 'overview', showPortalView = false }: UnifiedSportsHubProps) {
  return (
    <div className="unified-sports-hub bg-[var(--card-background)] rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sports Hub</h2>
      <div className="space-y-4">
        <p className="text-[var(--text-secondary)]">
          Your unified sports experience - predictions, live scores, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--background)] rounded-lg">
            <h3 className="font-semibold mb-2">⚽ Football</h3>
            <p className="text-sm text-[var(--text-secondary)]">Live matches and predictions</p>
          </div>
          <div className="p-4 bg-[var(--background)] rounded-lg">
            <h3 className="font-semibold mb-2">🏀 Basketball</h3>
            <p className="text-sm text-[var(--text-secondary)]">NBA and more</p>
          </div>
          <div className="p-4 bg-[var(--background)] rounded-lg">
            <h3 className="font-semibold mb-2">🎾 Tennis</h3>
            <p className="text-sm text-[var(--text-secondary)]">Grand Slam coverage</p>
          </div>
        </div>
      </div>
    </div>
  );
}
