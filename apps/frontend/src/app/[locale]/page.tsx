"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { SmartErrorRecovery } from '@components/SmartErrorRecovery';

// Component wrapper with debugging
function ComponentWrapper({ 
  name, 
  children, 
  fallback 
}: { 
  name: string; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(`✅ ${name} mounted successfully`);
    setMounted(true);
    return () => console.log(`🔄 ${name} unmounted`);
  }, [name]);

  if (!mounted) {
    return fallback || <div className="h-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />;
  }

  return (
    <SmartErrorRecovery
      fallback={
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-red-600 dark:text-red-400">⚠️ {name} failed to load</p>
        </div>
      }
    >
      {children}
    </SmartErrorRecovery>
  );
}

// Lazy load heavy components
const ErrorMonitor = React.lazy(() => import('@components/ErrorMonitor').then(m => ({ default: m.ErrorMonitor })));
const BackendHealthMonitor = React.lazy(() => import('@components').then(m => ({ default: m.BackendHealthMonitor })));
const PWAServiceWorker = React.lazy(() => import('@components/PWAServiceWorker').then(m => ({ default: m.PWAServiceWorker })));
const MobileMetaOptimizer = React.lazy(() => import('@components/MobileMetaOptimizer').then(m => ({ default: m.MobileMetaOptimizer })));
const MobilePerformanceOptimizer = React.lazy(() => import('@components/MobilePerformanceOptimizer').then(m => ({ default: m.MobilePerformanceOptimizer })));
const FeatureShowcase = React.lazy(() => import('@components/FeatureShowcase').then(m => ({ default: m.FeatureShowcase })));
const SmartNewsFeed = React.lazy(() => import('@components/SmartNewsFeed').then(m => ({ default: m.SmartNewsFeed })));
const LiveMatchTracker = React.lazy(() => import('@components/LiveMatchTracker').then(m => ({ default: m.LiveMatchTracker })));
const PredictionInterface = React.lazy(() => import('@components/PredictionInterface').then(m => ({ default: m.PredictionInterface })));
const LatestNews = React.lazy(() => import('@components/LatestNews').then(m => ({ default: m.LatestNews })));

export default function HomePage() {
  const t = useTranslations('home');
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    console.log('🏠 HomePage rendering started');
    // Enable debug mode with query param ?debug=true
    setDebugMode(window.location.search.includes('debug=true'));
    return () => console.log('🏠 HomePage unmounting');
  }, []);

  return (
    <>
      {/* Debug Panel */}
      {debugMode && (
        <div className="fixed top-20 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs">
          <h3 className="font-bold mb-2">🐛 Debug Mode</h3>
          <p>Check console for component lifecycle logs</p>
        </div>
      )}

      {/* Background Services - Load silently */}
      <Suspense fallback={null}>
        <ComponentWrapper name="ErrorMonitor">
          <ErrorMonitor />
        </ComponentWrapper>
      </Suspense>
      
      <Suspense fallback={null}>
        <ComponentWrapper name="BackendHealthMonitor">
          <BackendHealthMonitor />
        </ComponentWrapper>
      </Suspense>
      
      <Suspense fallback={null}>
        <ComponentWrapper name="PWAServiceWorker">
          <PWAServiceWorker />
        </ComponentWrapper>
      </Suspense>
      
      <Suspense fallback={null}>
        <ComponentWrapper name="MobileMetaOptimizer">
          <MobileMetaOptimizer />
        </ComponentWrapper>
      </Suspense>
      
      <Suspense fallback={null}>
        <ComponentWrapper name="MobilePerformanceOptimizer">
          <MobilePerformanceOptimizer />
        </ComponentWrapper>
      </Suspense>

      {/* Main Content */}
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 space-y-8">
          
          {/* Hero Section - Always render */}
          <section className="text-center py-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              {t('welcome', { defaultValue: 'Welcome to MajajiCo' })}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('tagline', { defaultValue: 'AI-Powered Sports Predictions & Analytics' })}
            </p>
          </section>

          {/* Feature Showcase */}
          <Suspense fallback={
            <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
          }>
            <ComponentWrapper name="FeatureShowcase" fallback={
              <div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
            }>
              <FeatureShowcase />
            </ComponentWrapper>
          </Suspense>

          {/* News Feed & Match Tracker Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={
              <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
            }>
              <ComponentWrapper name="SmartNewsFeed" fallback={
                <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
              }>
                <SmartNewsFeed />
              </ComponentWrapper>
            </Suspense>

            <Suspense fallback={
              <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
            }>
              <ComponentWrapper name="LiveMatchTracker" fallback={
                <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
              }>
                <LiveMatchTracker />
              </ComponentWrapper>
            </Suspense>
          </div>

          {/* Prediction Interface */}
          <Suspense fallback={
            <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
          }>
            <ComponentWrapper name="PredictionInterface" fallback={
              <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
            }>
              <PredictionInterface />
            </ComponentWrapper>
          </Suspense>

          {/* Latest News */}
          <Suspense fallback={
            <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
          }>
            <ComponentWrapper name="LatestNews" fallback={
              <div className="h-96 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg" />
            }>
              <LatestNews />
            </ComponentWrapper>
          </Suspense>

        </div>
      </main>
    </>
  );
}
