
'use client';

import { useEffect, useState, useRef, ReactNode } from 'react';

interface HydrationCoordinatorProps {
  children: ReactNode;
  fallback?: ReactNode;
  priority?: 'high' | 'normal' | 'low';
}

/**
 * Advanced Hydration Coordinator
 * Prevents mismatches by ensuring consistent rendering between server and client
 */
export function HydrationCoordinator({ 
  children, 
  fallback = null,
  priority = 'normal' 
}: HydrationCoordinatorProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hydrationError, setHydrationError] = useState<Error | null>(null);
  const hydrationRef = useRef<boolean>(false);
  const renderCount = useRef(0);

  useEffect(() => {
    // Prevent double hydration
    if (hydrationRef.current) return;
    hydrationRef.current = true;

    // Clear any problematic cached data
    try {
      const problematicKeys = [
        'theme',
        'crossPlatformSettings',
        'offlineQueue',
        'microPredictions',
        'deviceSettings'
      ];
      
      problematicKeys.forEach(key => {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            JSON.parse(stored);
          } catch {
            // Invalid JSON, clear it
            localStorage.removeItem(key);
          }
        }
      });
    } catch (e) {
      console.warn('Storage cleanup failed:', e);
    }

    // Delay hydration based on priority
    const delay = priority === 'high' ? 0 : priority === 'normal' ? 50 : 100;
    
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [priority]);

  // Track render cycles
  useEffect(() => {
    renderCount.current += 1;
    
    // Detect hydration loops
    if (renderCount.current > 10) {
      console.error('Hydration loop detected, resetting...');
      setHydrationError(new Error('Hydration loop detected'));
    }
  });

  // Error recovery
  if (hydrationError) {
    return (
      <div className="hydration-error-recovery">
        <button onClick={() => window.location.reload()}>
          Reload Application
        </button>
      </div>
    );
  }

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
