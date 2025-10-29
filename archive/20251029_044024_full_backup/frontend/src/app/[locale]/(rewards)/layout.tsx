
'use client';

import React from 'react';

export default function RewardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rewards-app">
      <div className="rewards-header bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-4 mb-4">
        <h2 className="text-xl font-bold">🏆 Rewards & Achievements</h2>
        <p className="text-sm opacity-90">Earn Coins & Unlock Achievements</p>
      </div>
      <div className="rewards-content">
        {children}
      </div>
    </div>
  );
}
