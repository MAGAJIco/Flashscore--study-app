'use client';

import { useEffect, useState } from 'react';
import { healthMonitor } from '@/lib/services/healthMonitor';

export function HealthMonitorInitializer() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      healthMonitor.startMonitoring();
    } catch (error) {
      console.warn('Health monitor failed to start:', error);
    }

    return () => {
      try {
        healthMonitor.stopMonitoring();
      } catch (error) {
        console.warn('Health monitor failed to stop:', error);
      }
    };
  }, [isClient]);

  return null;
}