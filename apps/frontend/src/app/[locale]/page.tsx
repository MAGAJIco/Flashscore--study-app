
"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { FlashScoreMatchTracker } from '@/app/components/FlashScoreMatchTracker';
import { UnifiedSportsHub } from '@/app/components/UnifiedSportsHub';
import { PortalWidgetSystem } from '@/app/components/PortalWidgetSystem';
import { PortalCommandCenter } from '@/app/components/PortalCommandCenter';
import { HorizontalCarousel } from '@/app/components/HorizontalCarousel';

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
      </div>

      {/* Horizontal Carousel - Interactive Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <HorizontalCarousel />
      </div>

      {/* Portal Widget System */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <PortalWidgetSystem />
      </div>

      {/* FlashScore Match Tracker */}
      <div className="mb-8">
        <FlashScoreMatchTracker />
      </div>

      {/* Unified Sports Hub */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <UnifiedSportsHub initialTab="overview" showPortalView={true} />
      </div>

      {/* Portal Command Center (floating button) */}
      <PortalCommandCenter />
    </div>
  );
}
