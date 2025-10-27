
'use client';

import React, { useState } from 'react';
import { DocsHeader } from './DocsHeader';
import { DocsOverview } from './DocsOverview';
import { DocsCarousel } from './DocsCarousel';
import { DocsFooter } from './DocsFooter';

export function DocsLayout() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <DocsHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {activeSection === 'overview' && <DocsOverview />}
        {activeSection === 'features' && (
          <DocsCarousel
            title="🎯 Feature Showcase"
            icon="✨"
            cards={[
              {
                icon: '🤖',
                title: 'AI Predictions',
                description: 'Advanced machine learning algorithms analyze thousands of data points to provide accurate match predictions.',
                badge: 'New',
                badgeColor: 'bg-green-500',
                meta: [
                  { icon: '📊', text: '95% accuracy' },
                  { icon: '⚡', text: 'Real-time' }
                ]
              },
              {
                icon: '⚽',
                title: 'Live Scores',
                description: 'Get instant updates on matches from leagues worldwide with our real-time scoring system.',
                meta: [
                  { icon: '🌍', text: 'Global coverage' },
                  { icon: '⏱️', text: 'Live updates' }
                ]
              },
              {
                icon: '🏆',
                title: 'Rewards System',
                description: 'Earn points, unlock achievements, and compete with friends on our global leaderboard.',
                badge: 'Popular',
                badgeColor: 'bg-purple-500',
                meta: [
                  { icon: '💎', text: 'Exclusive rewards' },
                  { icon: '🎮', text: 'Gamified' }
                ]
              }
            ]}
          />
        )}
      </main>

      <DocsFooter />
    </div>
  );
}
