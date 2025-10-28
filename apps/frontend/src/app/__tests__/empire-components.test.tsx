
/**
 * Empire Components Import Verification Test
 * Ensures all components from the architecture docs are properly imported
 */

import { describe, test, expect } from '@jest/globals';

describe('Empire Architecture Components', () => {
  test('Core navigation components should be importable', async () => {
    const { GoogleStyleNav } = await import('@/app/components/GoogleStyleNav');
    const { AppDrawer } = await import('@/app/components/layout/AppDrawer');
    
    expect(GoogleStyleNav).toBeDefined();
    expect(AppDrawer).toBeDefined();
  });

  test('Carousel components should be importable', async () => {
    const { LiveCarousel } = await import('@/app/components/carousels/LiveCarousel');
    const { NewsCarousel } = await import('@/app/components/carousels/NewsCarousel');
    
    expect(LiveCarousel).toBeDefined();
    expect(NewsCarousel).toBeDefined();
  });

  test('Card components should be importable', async () => {
    const { FeatureCard } = await import('@/app/components/cards/FeatureCard');
    const { CarouselCard } = await import('@/app/components/cards/CarouselCard');
    
    expect(FeatureCard).toBeDefined();
    expect(CarouselCard).toBeDefined();
  });

  test('Section components should be importable', async () => {
    const { ArchitectureOverview } = await import('@/app/components/sections/ArchitectureOverview');
    const { FrontendApps } = await import('@/app/components/sections/FrontendApps');
    const { KeyBenefits } = await import('@/app/components/sections/KeyBenefits');
    const { DataFlow } = await import('@/app/components/sections/DataFlow');
    const { ImplementationStatus } = await import('@/app/components/sections/ImplementationStatus');
    const { NextSteps } = await import('@/app/components/sections/NextSteps');
    
    expect(ArchitectureOverview).toBeDefined();
    expect(FrontendApps).toBeDefined();
    expect(KeyBenefits).toBeDefined();
    expect(DataFlow).toBeDefined();
    expect(ImplementationStatus).toBeDefined();
    expect(NextSteps).toBeDefined();
  });

  test('UI components should be importable', async () => {
    const { StatusBadge } = await import('@/components/ui/StatusBadge');
    const { ScrollButton } = await import('@/components/ui/ScrollButton');
    
    expect(StatusBadge).toBeDefined();
    expect(ScrollButton).toBeDefined();
  });

  test('Custom hooks should be importable', async () => {
    const { useCarousel } = await import('@/app/hooks/useCarousel');
    
    expect(useCarousel).toBeDefined();
  });

  test('Constants should be importable', async () => {
    const { FEATURE_APPS } = await import('@/lib/constant/features');
    const { APP_DRAWER_ITEMS } = await import('@/lib/constant/apps');
    const { LIVE_MATCHES, NEWS_ITEMS } = await import('@/lib/constant/mockData');
    
    expect(FEATURE_APPS).toBeDefined();
    expect(APP_DRAWER_ITEMS).toBeDefined();
    expect(LIVE_MATCHES).toBeDefined();
    expect(NEWS_ITEMS).toBeDefined();
  });

  test('Types should be importable', async () => {
    const types = await import('@/lib/types');
    
    expect(types).toBeDefined();
  });
});

describe('Empire Feature Components', () => {
  test('Foundation feature should be importable', async () => {
    const { default: FoundationFeature } = await import('@/app/[locale]/(empire)/features/foundation/FoundationFeature');
    
    expect(FoundationFeature).toBeDefined();
  });

  test('Leaderboard feature should be importable', async () => {
    const { default: LeaderboardFeature } = await import('@/app/[locale]/(empire)/features/leaderboard/LeaderboardFeature');
    
    expect(LeaderboardFeature).toBeDefined();
  });

  test('Achievements feature should be importable', async () => {
    const { default: AchievementsFeature } = await import('@/app/[locale]/(empire)/features/achievements/AchievementsFeature');
    
    expect(AchievementsFeature).toBeDefined();
  });
});
