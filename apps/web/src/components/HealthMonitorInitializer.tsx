
'use client';

import { useEffect } from 'react';
import { healthMonitor } from '@/lib/services/healthMonitor';

export function HealthMonitorInitializer() {
  useEffect(() => {
    healthMonitor.startMonitoring();
    return () => healthMonitor.stopMonitoring();
  }, []);

  return null;
}
