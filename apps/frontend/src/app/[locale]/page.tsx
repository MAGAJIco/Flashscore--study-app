
"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { FlashScoreMatchTracker } from '@/app/components/FlashScoreMatchTracker';
import { UnifiedSportsHub } from '@/app/components/UnifiedSportsHub';

export default function HomePage() {
  const t = useTranslations('home');
  const tc = useTranslations('common');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('welcome')}
          </h1>
          <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
            {t('tagline')}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a
            href="/predictions"
            className="p-6 rounded-xl text-center transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {tc('predictions')}
            </div>
          </a>

          <a
            href="/matches"
            className="p-6 rounded-xl text-center transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="text-3xl mb-2">⚽</div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {tc('matches')}
            </div>
          </a>

          <a
            href="/news"
            className="p-6 rounded-xl text-center transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="text-3xl mb-2">📰</div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {tc('news')}
            </div>
          </a>

          <a
            href="/empire"
            className="p-6 rounded-xl text-center transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div className="text-3xl mb-2">🏰</div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {tc('empire')}
            </div>
          </a>
        </div>
      </div>

      {/* FlashScore Match Tracker */}
      <div className="mb-8">
        <FlashScoreMatchTracker />
      </div>

      {/* Unified Sports Hub */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <UnifiedSportsHub initialTab="overview" showPortalView={true} />
      </div>
    </div>
  );
}
