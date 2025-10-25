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
      return this.props.fallback || (
        <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-800 mb-2">⚠️ {this.props.sectionName}</h3>
          <p className="text-yellow-700 text-sm">
            This section failed to load. Other features are still available.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load components - each section is independent
const ErrorMonitor = React.lazy(() => import('@components/ErrorMonitor').then(m => ({ default: m.ErrorMonitor })));
const BackendHealthMonitor = React.lazy(() => import('@components').then(m => ({ default: m.BackendHealthMonitor })));
const FeatureShowcase = React.lazy(() => import('@components/FeatureShowcase').then(m => ({ default: m.FeatureShowcase })));
const SmartNewsFeed = React.lazy(() => import('@components/SmartNewsFeed').then(m => ({ default: m.SmartNewsFeed })));
const LiveMatchTracker = React.lazy(() => import('@components/LiveMatchTracker').then(m => ({ default: m.LiveMatchTracker })));
const PredictionInterface = React.lazy(() => import('@components/PredictionInterface').then(m => ({ default: m.PredictionInterface })));

export default function HomePage() {
  const t = useTranslations('home');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('🏠 HomePage: Mounting with pie-chart workload division');
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MagajiCo...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Hero Section - Slice 1 (Always renders) */}
        <SectionErrorBoundary sectionName="Hero Section">
          <section className="text-center py-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              {t('welcome', { defaultValue: 'Welcome to MagajiCo' })}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('tagline', { defaultValue: 'AI-Powered Sports Predictions & Analytics' })}
            </p>
          </section>
        </SectionErrorBoundary>

        {/* Background Services - Slice 2 (Silent failures) */}
        <SectionErrorBoundary sectionName="Background Services" fallback={null}>
          <div style={{ display: 'none' }}>
            <Suspense fallback={null}>
              <ErrorMonitor />
            </Suspense>
            <Suspense fallback={null}>
              <BackendHealthMonitor />
            </Suspense>
          </div>
        </SectionErrorBoundary>

        {/* Feature Showcase - Slice 3 */}
        <SectionErrorBoundary sectionName="Feature Showcase">
          <Suspense fallback={
            <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
          }>
            <FeatureShowcase />
          </Suspense>
        </SectionErrorBoundary>

        {/* News & Matches Grid - Slice 4 & 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionErrorBoundary sectionName="News Feed">
            <Suspense fallback={
              <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
            }>
              <SmartNewsFeed />
            </Suspense>
          </SectionErrorBoundary>

          <SectionErrorBoundary sectionName="Live Matches">
            <Suspense fallback={
              <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
            }>
              <LiveMatchTracker />
            </Suspense>
          </SectionErrorBoundary>
        </div>

        {/* Predictions - Slice 6 */}
        <SectionErrorBoundary sectionName="Predictions">
          <Suspense fallback={
            <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
          }>
            <PredictionInterface />
          </Suspense>
        </SectionErrorBoundary>

        {/* Status Footer - Always visible */}
        <SectionErrorBoundary sectionName="Status">
          <div className="text-center py-4 text-gray-500 text-sm">
            <p>✅ MagajiCo is running with isolated section architecture</p>
            <p className="text-xs mt-1">Each section loads independently - if one fails, others continue working</p>
          </div>
        </SectionErrorBoundary>

      </div>
    </main>
  );
}