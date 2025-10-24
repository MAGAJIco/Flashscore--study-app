'use client';

import { useEffect } from 'react';
import { ClientOnly } from './ClientOnly';

function MobilePerformanceMonitorContent() {
  useEffect(() => {
    // Monitor performance metrics
    if ('performance' in window && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              console.log('Navigation timing:', entry);
            }
          }
        });

        observer.observe({ entryTypes: ['navigation', 'paint'] });

        return () => observer.disconnect();
      } catch (e) {
        console.warn('Performance monitoring not available:', e);
      }
    }
  }, []);

  return null;
}

export function MobilePerformanceMonitor() {
  return (
    <ClientOnly>
      <MobilePerformanceMonitorContent />
    </ClientOnly>
  );
}