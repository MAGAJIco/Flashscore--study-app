'use client';

import { useEffect, useState } from 'react';
import { healthMonitor } from '@/lib/services/healthMonitor';

export function HealthMonitorInitializer() {
  const [isClient, setIsClient] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Wait for the app to stabilize before starting health monitoring
    const initTimer = setTimeout(() => {
      setIsReady(true);
    }, 2000);

    return () => clearTimeout(initTimer);
  }, [isClient]);

  useEffect(() => {
    if (!isReady) return;

    let mounted = true;

    const startMonitoring = async () => {
      try {
        if (mounted) {
          healthMonitor.startMonitoring();
          console.log('✅ Health monitoring initialized');
        }
      } catch (error) {
        if (mounted) {
          console.warn('⚠️ Health monitor initialization delayed:', error);
          // Retry after a delay
          setTimeout(() => {
            if (mounted) {
              try {
                healthMonitor.startMonitoring();
              } catch (retryError) {
                console.debug('Health monitor will retry on next cycle');
              }
            }
          }, 5000);
        }
      }
    };

    startMonitoring();

    return () => {
      mounted = false;
      try {
        healthMonitor.stopMonitoring();
      } catch (error) {
        // Silent cleanup
        console.debug('Health monitor cleanup');
      }
    };
  }, [isReady]);

  return null;
}