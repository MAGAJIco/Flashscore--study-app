"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { DIYF } from '@/app/components/diyf';
import { FlashScoreMatchTracker } from '@/app/components/FlashScoreMatchTracker';
import { UnifiedSportsHub } from '@/app/components/UnifiedSportsHub';
import { PortalWidgetSystem } from '@/app/components/PortalWidgetSystem';
import { HorizontalCarousel } from '@/app/components/HorizontalCarousel';

export default function HomePage() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <DIYF>
      <div className="space-y-10">
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">{t("welcome")}</h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)]">
            {t("tagline")}
          </p>
        </section>

        {/* Horizontal Carousel - Interactive Cards */}
        <div className="max-w-7xl mx-auto mb-8">
          <HorizontalCarousel />
        </div>

        {/* Portal Widget System */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <PortalWidgetSystem />
        </div>

        <FlashScoreMatchTracker />
        <UnifiedSportsHub initialTab="overview" showPortalView />
      </div>
    </DIYF>
  );
}