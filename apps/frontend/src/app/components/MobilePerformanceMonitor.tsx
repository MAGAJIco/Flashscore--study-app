'use client';

import { useEffect } from 'react';
import { ClientOnly } from './ClientOnly';
import { usePerformanceMonitor } from '@hooks/usePerformanceMonitor';

function MobilePerformanceMonitorContent() {
  const { trackPerformance } = usePerformanceMonitor();

  useEffect(() => {
    // Track mobile-specific performance events
    trackPerformance('mobile_performance_monitor_mounted');
  }, [trackPerformance]);

  return null;
}

export function MobilePerformanceMonitor() {
  return (
    <ClientOnly>
      <MobilePerformanceMonitorContent />
    </ClientOnly>
  );
}