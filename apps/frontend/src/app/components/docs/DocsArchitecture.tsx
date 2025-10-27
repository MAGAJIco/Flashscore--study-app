
"use client";

import React from 'react';

export function DocsArchitecture() {
  return (
    <section className="mb-16 bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">🏗️ Complete Architecture</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Frontend Structure</h3>
          <pre className="text-green-300 text-xs overflow-x-auto">{`apps/frontend/src/app/[locale]/
├── (portal)/           # Main dashboard
├── (predictions)/      # AI Predictions
├── (live)/            # Live tracking
├── (social)/          # Social features
├── (kids)/            # Kids mode
├── (rewards)/         # Achievements
└── components/        # Shared components`}</pre>
        </div>
        <div className="bg-black/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Backend Modules</h3>
          <pre className="text-blue-300 text-xs overflow-x-auto">{`apps/backend/src/modules/
├── predictions/       # ML predictions
├── matches/          # Live matches
├── social/           # Social features
├── rewards/          # Gamification
└── kids/             # Kids safety`}</pre>
        </div>
      </div>
    </section>
  );
}
