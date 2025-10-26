"use client";

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  // event tracking
  events?: Array<{ name: string; timestamp: number; payload?: any }>;
}

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<Partial<PerformanceMetrics>>({
    events: []
  });

  useEffect(() => {
    const observePerformance = () => {
      if (typeof window === 'undefined') return () => {};

      // Page Load Time
      if (window.performance && (performance as any).timing) {
        try {
          const timing = (performance as any).timing;
          const loadTime = Math.max(0, timing.loadEventEnd - timing.navigationStart);
          metricsRef.current.pageLoadTime = loadTime;
        } catch (e) {
          // ignore
        }
      }

      // First Contentful Paint & LCP & CLS & FID via PerformanceObserver
      let paintObserver: PerformanceObserver | null = null;
      let lcpObserver: PerformanceObserver | null = null;
      let clsObserver: PerformanceObserver | null = null;
      let fidObserver: PerformanceObserver | null = null;

      if ('PerformanceObserver' in window) {
        try {
          paintObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if ((entry as any).name === 'first-contentful-paint') {
                metricsRef.current.firstContentfulPaint = (entry as any).startTime;
              }
            }
          });
          paintObserver.observe({ entryTypes: ['paint'] });

          lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) metricsRef.current.largestContentfulPaint = (lastEntry as any).startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

          let clsValue = 0;
          clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value || 0;
              }
            }
            metricsRef.current.cumulativeLayoutShift = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              metricsRef.current.firstInputDelay = ((entry as any).processingStart - (entry as any).startTime) || metricsRef.current.firstInputDelay;
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          // Some browsers may throw for unavailable entry types — ignore silently
        }
      }

      // Return cleanup
      return () => {
        try { paintObserver?.disconnect(); } catch {}
        try { lcpObserver?.disconnect(); } catch {}
        try { clsObserver?.disconnect(); } catch {}
        try { fidObserver?.disconnect(); } catch {}
      };
    };

    const cleanup = observePerformance();
    return cleanup;
  }, []);

  const getMetrics = (): Partial<PerformanceMetrics> => {
    // Make a shallow clone to avoid exposing the ref directly
    return { ...metricsRef.current, events: metricsRef.current.events ? [...metricsRef.current.events] : [] };
  };

  const logMetrics = () => {
    const metrics = getMetrics();
    // Friendly console output for debugging in the browser
    console.log('Performance Metrics:', {
      'Page Load Time': metrics.pageLoadTime ? `${metrics.pageLoadTime}ms` : 'n/a',
      'First Contentful Paint': metrics.firstContentfulPaint ? `${metrics.firstContentfulPaint}ms` : 'n/a',
      'Largest Contentful Paint': metrics.largestContentfulPaint ? `${metrics.largestContentfulPaint}ms` : 'n/a',
      'Cumulative Layout Shift': metrics.cumulativeLayoutShift ?? 'n/a',
      'First Input Delay': metrics.firstInputDelay ? `${metrics.firstInputDelay}ms` : 'n/a',
      'Events Tracked': metrics.events?.length ?? 0
    });
  };

  // Track performance events with ML/prediction-specific support
  const trackPerformance = (eventName: string, payload?: any) => {
    if (typeof window === 'undefined') return;

    const event = { name: eventName, timestamp: Date.now(), payload };
    if (!metricsRef.current.events) metricsRef.current.events = [];
    metricsRef.current.events.push(event);

    // Lightweight console for debugging in dev/preview
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[PerfMonitor] tracked event:', event);
    }

    // Optionally: send to server-side analytics if a runtime URL is provided
    const analyticsUrl = (window as any).__PERF_ANALYTICS_URL || (process.env.NEXT_PUBLIC_PERF_ANALYTICS_URL as string | undefined);
    if (analyticsUrl) {
      try {
        fetch(analyticsUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, metrics: getMetrics() })
        }).catch(() => {});
      } catch {
        // ignore
      }
    }
  };

  // ML-specific tracking methods
  const trackPredictionAccuracy = (userId: string, predictionId: string, wasCorrect: boolean) => {
    trackPerformance(`prediction_accuracy_${userId}`, { predictionId, wasCorrect });
  };

  const trackMLModelLatency = (modelName: string, latency: number) => {
    trackPerformance(`ml_model_${modelName}_latency`, { latency });
    if (latency > 2000) {
      console.warn(`[PerfMonitor] ML model ${modelName} took ${latency}ms - consider optimization`);
    }
  };

  const reportWebVitals = (metric: any) => {
    console.log(`[WebVitals] ${metric.name}: ${metric.value}`);
    trackPerformance(`web-vital-${metric.name}`, { value: metric.value });
  };

  return {
    getMetrics,
    logMetrics,
    trackPerformance,
    trackPredictionAccuracy,
    trackMLModelLatency,
    reportWebVitals
  };
};