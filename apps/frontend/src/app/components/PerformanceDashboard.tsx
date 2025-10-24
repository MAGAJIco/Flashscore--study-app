'use client';

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  bundleSize?: number;
  loadTime?: number;
  renderTime?: number;
  memoryUsage?: number;
  networkLatency?: number;
  cacheHitRate?: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [optimizations, setOptimizations] = useState<string[]>([]);

  useEffect(() => {
    measurePerformance();
    analyzeOptimizations();
  }, []);

  const measurePerformance = () => {
    if (typeof window === 'undefined') return;

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      const resources = performance.getEntriesByType('resource');

      const fcp = (paint as any).find((p: any) => p.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = 0;

      setMetrics({
        bundleSize: Math.round((resources as any).reduce((acc: number, r: any) => acc + (r.transferSize || 0), 0) / 1024),
        loadTime: Math.round((navigation && navigation.loadEventEnd && navigation.fetchStart) ? navigation.loadEventEnd - navigation.fetchStart : 0),
        renderTime: Math.round(performance.now()),
        memoryUsage: (performance as any).memory?.usedJSHeapSize ?? undefined,
        networkLatency: undefined,
        cacheHitRate: undefined
      });
    } catch (e) {
      // defensive: don't fail the build/runtime
      if (process.env.NODE_ENV !== 'production') console.warn('measurePerformance failed', e);
    }
  };

  const analyzeOptimizations = () => {
    // Example analysis - determine which optimizations to enable/recommend
    const foundOptimizations: string[] = [];

    // If bundle is large, recommend code-splitting
    if (metrics && metrics.bundleSize && metrics.bundleSize > 1024) {
      foundOptimizations.push('code-splitting');
    }

    // If no lazy-loading is detected, recommend image optimizations
    // NOTE: this is a heuristic; we still guard with typeof document to avoid SSR errors
    try {
      if (typeof document !== 'undefined') {
        // check if any <img> has loading="lazy"
        const imgs = Array.from(document.images || []) as HTMLImageElement[];
        const hasLazy = imgs.some(img => (img as any).loading === 'lazy' || img.loading === 'lazy');
        if (!hasLazy) foundOptimizations.push('images');
      } else {
        // assume images can be optimized on SSR-less environments
        foundOptimizations.push('images');
      }
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') console.warn('analyzeOptimizations image check failed', e);
    }

    // Other heuristic checks (cache headers, preconnects, etc.) can be added here
    setOptimizations(foundOptimizations);

    // Apply lightweight image optimization helper when images optimization recommended
    if (foundOptimizations.includes('images')) {
      try {
        if (typeof document !== 'undefined' && document.images) {
          const images = Array.from(document.images) as HTMLImageElement[];
          images.forEach(img => {
            try {
              // Safely set lazy loading (guard older browsers)
              if (!('loading' in img) || !(img as any).loading) {
                // only set if not already set to avoid overriding
                (img as any).loading = 'lazy';
              }

              // If data-src is present, swap it to src for eager hydration/lazy fallback
              if ((img as any).dataset && (img as any).dataset.src) {
                img.src = (img as any).dataset.src;
                delete (img as any).dataset.src;
              }
            } catch (inner) {
              if (process.env.NODE_ENV !== 'production') console.warn('image helper error', inner);
            }
          });
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.warn('image optimization helper failed', e);
      }
    }
  };

  return (
    <div className="p-6 bg-white/5 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Performance Dashboard</h2>

      <div className="mb-4">
        <div>Bundle Size: {metrics?.bundleSize ? `${metrics.bundleSize} KB` : 'n/a'}</div>
        <div>Load Time: {metrics?.loadTime ? `${metrics.loadTime} ms` : 'n/a'}</div>
        <div>Render Time: {metrics?.renderTime ? `${metrics.renderTime} ms` : 'n/a'}</div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Recommended Optimizations</h3>
        {optimizations.length === 0 ? (
          <div>No optimizations detected</div>
        ) : (
          <ul>
            {optimizations.map(opt => <li key={opt}>{opt}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
}