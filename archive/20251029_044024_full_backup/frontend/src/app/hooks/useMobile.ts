
'use client';

import { useState, useEffect } from 'react';
import { mobileDetector } from '@/lib/mobile-detection';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Subscribe to mobile detection changes
    const unsubscribe = mobileDetector.subscribe((result) => {
      setIsMobile(result.isMobile);
    });

    return unsubscribe;
  }, []);

  // Return false during SSR to match initial server render
  return mounted ? isMobile : false;
}

// Extended hook for more detailed detection
export function useMobileDetection() {
  const [detection, setDetection] = useState(mobileDetector.current);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const unsubscribe = mobileDetector.subscribe(setDetection);
    return unsubscribe;
  }, []);

  return mounted ? detection : {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isMobileWidth: false,
    isMobileDevice: false,
    isPWA: false,
    deviceType: 'desktop' as const,
    screenWidth: 1920,
    userAgent: '',
  };
}
