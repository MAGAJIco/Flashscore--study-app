
'use client';

import { useEffect } from 'react';
import { healthMonitor } from '@/lib/services/healthMonitor';

export function HealthMonitorInitializer() {
  useEffect(() => {
    // Suppress non-critical console errors
    const originalError = console.error;
    console.error = (...args) => {
      const errorStr = args.join(' ');
      // Filter out known non-critical errors
      if (errorStr.includes('404') && (errorStr.includes('icon-') || errorStr.includes('.png'))) {
        return; // Suppress icon 404 errors
      }
      originalError.apply(console, args);
    };

    healthMonitor.startMonitoring();
    
    return () => {
      healthMonitor.stopMonitoring();
      console.error = originalError;
    };
  }, []);

  return null;
}
