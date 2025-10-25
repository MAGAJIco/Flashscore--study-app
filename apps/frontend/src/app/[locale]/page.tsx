"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Pie-chart division: Each section is isolated with its own error boundary
class SectionErrorBoundary extends React.Component<
  { children: React.ReactNode; sectionName: string; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`❌ ${this.props.sectionName} section failed:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return null to hide broken sections completely
      return null;
    }
    return this.props.children;
  }
}

// Clean loading skeleton that matches the content
const CleanSkeleton = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg animate-pulse`} />
);

// Lazy load components with retry logic
const ErrorMonitor = React.lazy(() => 
  import('@components/ErrorMonitor').then(m => ({ default: m.ErrorMonitor })).catch(() => ({ default: () => null }))
);
const BackendHealthMonitor = React.lazy(() => 
  import('@components').then(m => ({ default: m.BackendHealthMonitor })).catch(() => ({ default: () => null }))
);
const FeatureShowcase = React.lazy(() => 
  import('@components/FeatureShowcase').then(m => ({ default: m.FeatureShowcase })).catch(() => ({ default: () => null }))
);
const SmartNewsFeed = React.lazy(() => 
  import('@components/SmartNewsFeed').then(m => ({ default: m.SmartNewsFeed })).catch(() => ({ default: () => null }))
);
const LiveMatchTracker = React.lazy(() => 
  import('@components/LiveMatchTracker').then(m => ({ default: m.LiveMatchTracker })).catch(() => ({ default: () => null }))
);
const PredictionInterface = React.lazy(() => 
  import('@components/PredictionInterface').then(m => ({ default: m.PredictionInterface })).catch(() => ({ default: () => null }))
);

export default function HomePage() {
  const t = useTranslations('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🏠 HomePage: Mounting with pie-chart workload division');
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Return null during SSR to prevent hydration mismatch
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Hero Section - Always renders cleanly */}
        <section className="text-center py-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            {t('welcome', { defaultValue: 'Welcome to MagajiCo' })}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('tagline', { defaultValue: 'AI-Powered Sports Predictions & Analytics' })}
          </p>
        </section>

        {/* Background Services - Hidden */}
        <SectionErrorBoundary sectionName="Background Services">
          <div style={{ display: 'none' }}>
            <Suspense fallback={null}>
              <ErrorMonitor />
            </Suspense>
            <Suspense fallback={null}>
              <BackendHealthMonitor />
            </Suspense>
          </div>
        </SectionErrorBoundary>

        {/* Feature Showcase */}
        <SectionErrorBoundary sectionName="Feature Showcase">
          <Suspense fallback={<CleanSkeleton />}>
            <FeatureShowcase />
          </Suspense>
        </SectionErrorBoundary>

        {/* News & Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionErrorBoundary sectionName="News Feed">
            <Suspense fallback={<CleanSkeleton height="h-96" />}>
              <SmartNewsFeed />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary sectionName="Live Matches">
            <Suspense fallback={<CleanSkeleton height="h-96" />}>
              <LiveMatchTracker />
            </Suspense>
          </SectionErrorBoundary>
        </div>

        {/* Predictions */}
        <SectionErrorBoundary sectionName="Predictions">
          <Suspense fallback={<CleanSkeleton height="h-96" />}>
            <PredictionInterface />
          </Suspense>
        </SectionErrorBoundary>

        {/* Status Footer - Always visible */}
        <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm" suppressHydrationWarning>
          <p>✅ MagajiCo - Progressive Loading Architecture</p>
        </div>

      </div>
    </main>
  );
}