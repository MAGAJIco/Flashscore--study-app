"use client";

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ErrorMonitor } from '@components/ErrorMonitor';
import { BackendHealthMonitor } from '@components';
import { SmartLoadingState } from '@components/SmartLoadingState';
import { FeatureShowcase } from '@components/FeatureShowcase';
import { PWAServiceWorker } from '@components/PWAServiceWorker';
import { MobileMetaOptimizer } from '@components/MobileMetaOptimizer';
import { MobilePerformanceOptimizer } from '@components/MobilePerformanceOptimizer';
import { LatestNews } from '@components/LatestNews';
import { SmartNewsFeed } from '@components/SmartNewsFeed';
import { LiveMatchTracker } from '@components/LiveMatchTracker';
import { PredictionInterface } from '@components/PredictionInterface';

// Component wrapper with error boundary and logging
function SafeComponent({ name, children }: { name: string; children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(`✅ ${name} mounted successfully`);
    setMounted(true);
    return () => console.log(`🔄 ${name} unmounted`);
  }, [name]);

  if (error) {
    console.error(`❌ ${name} failed:`, error);
    return (
      <div style={{ padding: '20px', background: '#fee', border: '1px solid #f00', margin: '10px', borderRadius: '8px' }}>
        <strong>{name} Error:</strong> {error.message}
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (err) {
    setError(err as Error);
    return null;
  }
}

export default function HomePage() {
  const [renderStage, setRenderStage] = useState('initializing');
  
  useEffect(() => {
    console.log('🚀 HomePage: Component mounting');
    console.log('📍 Current URL:', window.location.href);
    console.log('🌐 Locale:', window.location.pathname.split('/')[1]);
    setRenderStage('mounted');
    
    return () => {
      console.log('🔚 HomePage: Component unmounting');
    };
  }, []);

  console.log('🎨 HomePage: Rendering (stage:', renderStage, ')');

  let t;
  try {
    t = useTranslations('home');
    console.log('✅ useTranslations hook initialized');
  } catch (error) {
    console.error('❌ useTranslations failed:', error);
    return (
      <div style={{ padding: '40px', textAlign: 'center', background: '#fff', minHeight: '100vh' }}>
        <h1 style={{ color: '#f00' }}>Translation Error</h1>
        <p>{String(error)}</p>
      </div>
    );
  }

  return (
    <>
      {/* Debug Info Panel - Remove in production */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        background: 'rgba(0,0,0,0.9)',
        color: '#0f0',
        padding: '10px',
        fontSize: '12px',
        zIndex: 99999,
        maxWidth: '300px',
        fontFamily: 'monospace'
      }}>
        <div>🎯 HomePage Render Stage: {renderStage}</div>
        <div>📍 Path: {typeof window !== 'undefined' ? window.location.pathname : 'SSR'}</div>
        <div>⏰ Time: {new Date().toLocaleTimeString()}</div>
      </div>

      <SafeComponent name="ErrorMonitor">
        <ErrorMonitor />
      </SafeComponent>

      <SafeComponent name="BackendHealthMonitor">
        <BackendHealthMonitor />
      </SafeComponent>

      <SafeComponent name="PWAServiceWorker">
        <PWAServiceWorker />
      </SafeComponent>

      <SafeComponent name="MobileMetaOptimizer">
        <MobileMetaOptimizer />
      </SafeComponent>

      <SafeComponent name="MobilePerformanceOptimizer">
        <MobilePerformanceOptimizer />
      </SafeComponent>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <SafeComponent name="HeroSection">
            <section className="text-center py-12">
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                {t('welcome', { defaultValue: 'Welcome to MajajiCo' })}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {t('tagline', { defaultValue: 'AI-Powered Sports Predictions & Analytics' })}
              </p>
            </section>
          </SafeComponent>

          <SafeComponent name="FeatureShowcase">
            <FeatureShowcase />
          </SafeComponent>

          <SafeComponent name="NewsAndMatches">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SafeComponent name="SmartNewsFeed">
                <SmartNewsFeed />
              </SafeComponent>
              <SafeComponent name="LiveMatchTracker">
                <LiveMatchTracker />
              </SafeComponent>
            </div>
          </SafeComponent>

          <SafeComponent name="PredictionInterface">
            <PredictionInterface />
          </SafeComponent>

          <SafeComponent name="LatestNews">
            <LatestNews />
          </SafeComponent>
        </div>
      </main>
    </>
  );
}
