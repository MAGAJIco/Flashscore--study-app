
'use client';

import React from 'react';

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="live-tracking-app">
      <div className="live-header bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold">📡 LIVE Sports Tracking</h2>
        </div>
        <p className="text-sm opacity-90">Real-time Scores & Updates</p>
      </div>
      <div className="live-content">
        {children}
      </div>
    </div>
  );
}
