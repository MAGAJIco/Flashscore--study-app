"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { EnhancedErrorBoundary } from '@/app/components/EnhancedErrorBoundary';
import { PerformanceMonitor } from '@/lib/performance';
import { cache } from '@/lib/cache';
import { serviceMesh } from '@/lib/service-mesh';

// Clean loading skeleton that matches the content
const CleanSkeleton = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg animate-pulse`} />
);

// Temporary: These components will be loaded as they become available
// Wrapping in try-catch to prevent build failures
const lazyLoadComponent = (importFn: () => Promise<any>) => {
  return React.lazy(() => 
    importFn().catch(() => ({ default: () => null }))
  );
};

const ErrorMonitor = lazyLoadComponent(() => 
  import('@/app/components/ErrorMonitor').then(m => ({ default: m.ErrorMonitor }))
);
const BackendHealthMonitor = lazyLoadComponent(() => 
  import('@/app/components/BackendHealthMonitor').then(m => ({ default: m.BackendHealthMonitor }))
);
const ComprehensiveSportsHub = lazyLoadComponent(() => 
  import('@/app/components/ComprehensiveSportsHub').then(m => ({ default: m.ComprehensiveSportsHub }))
);
const LiveMatchTracker = lazyLoadComponent(() => 
  import('@/app/components/LiveMatchTracker').then(m => ({ default: m.LiveMatchTracker }))
);
const PredictionInterface = lazyLoadComponent(() => 
  import('@/app/components/PredictionInterface').then(m => ({ default: m.PredictionInterface }))
);
const Welcome = lazyLoadComponent(() => 
  import('@/app/components/Welcome').then(m => ({ default: m.Welcome }))
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    console.log('🏠 HomePage: Mounting with mobile-first optimization');
    
    // Start performance tracking
    PerformanceMonitor.mark('homepage-mount');
    
    setMounted(true);

    // Check service health before loading components
    const checkServices = async () => {
      const canServe = serviceMesh.canServeRequest(['frontend', 'backend']);
      if (!canServe) {
        console.warn('⚠️ Some services degraded, using cached data');
      }
    };
    checkServices();

    // Load theme last for better performance
    const loadTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'auto';
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const effectiveTheme = savedTheme === 'auto' ? (prefersDark ? 'dark' : 'light') : savedTheme;
      
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(effectiveTheme);
      setThemeLoaded(true);
      
      // Measure performance
      PerformanceMonitor.measure('homepage-load', 'homepage-mount');
    };

    // Defer theme loading until after critical content
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadTheme);
    } else {
      setTimeout(loadTheme, 100);
    }

    // Graceful shutdown handler for mobile
    const handleBeforeUnload = () => {
      // Save scroll position
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      
      // Clear temporary caches
      if ('caches' in window) {
        caches.keys().then(keys => {
          keys.forEach(key => {
            if (key.includes('temp')) {
              caches.delete(key);
            }
          });
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Restore scroll position
    const savedScroll = sessionStorage.getItem('scrollPosition');
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem('scrollPosition');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Clear expired cache on unmount
      cache.clear();
    };
  }, []);

  // Cache component states for faster re-renders
  useEffect(() => {
    if (mounted && themeLoaded) {
      cache.set('homepage-state', {
        mounted: true,
        themeLoaded: true,
        timestamp: Date.now()
      }, 60000); // 1 minute cache
    }
  }, [mounted, themeLoaded]);

  if (!mounted) {
    return null; // Return null during SSR to prevent hydration mismatch
  }

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      style={{ opacity: themeLoaded ? 1 : 0.95, transition: 'opacity 0.3s ease-in-out' }}
    >
      <div className="container mx-auto px-4 py-8 space-y-8" style={{ maxWidth: '100%', overflowX: 'hidden' }}>

        {/* PRIORITY 1: Welcome - Fast Loading */}
        <EnhancedErrorBoundary sectionName="Welcome" fallback={<CleanSkeleton height="h-32" />}>
          <Suspense fallback={<CleanSkeleton height="h-32" />}>
            <Welcome />
          </Suspense>
        </EnhancedErrorBoundary>

        {/* PRIORITY 2: Comprehensive Sports Hub */}
        <EnhancedErrorBoundary sectionName="Sports Hub" fallback={<CleanSkeleton height="h-screen" />}>
          <Suspense fallback={<CleanSkeleton height="h-screen" />}>
            <ComprehensiveSportsHub />
          </Suspense>
        </EnhancedErrorBoundary>

        {/* Background Services - Hidden */}
        <EnhancedErrorBoundary sectionName="Background Services" showErrorUI={false}>
          <div style={{ display: 'none' }}>
            <Suspense fallback={null}>
              <ErrorMonitor />
            </Suspense>
            <Suspense fallback={null}>
              <BackendHealthMonitor />
            </Suspense>
          </div>
        </EnhancedErrorBoundary>

        {/* PRIORITY 3: Predictions */}
        <EnhancedErrorBoundary sectionName="Predictions" fallback={<CleanSkeleton height="h-96" />}>
          <Suspense fallback={<CleanSkeleton height="h-96" />}>
            <PredictionInterface />
          </Suspense>
        </EnhancedErrorBoundary>

        {/* Minimal Status Footer */}
        {themeLoaded && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm" suppressHydrationWarning>
            <p>✅ MagajiCo Sports</p>
          </div>
        )}

      </div>
    </main>
  );
}