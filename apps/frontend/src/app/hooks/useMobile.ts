
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface WindowDimensions {
  readonly width: number;
  readonly height: number;
}

interface MobileDetectionConfig {
  readonly breakpoint: number;
  readonly debounceMs: number;
}

const MOBILE_CONFIG: Readonly<MobileDetectionConfig> = {
  breakpoint: 768,
  debounceMs: 150,
} as const;

type ResizeHandler = () => void;

export const useMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCurrentDimensions = useCallback((): WindowDimensions => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }), []);

  const checkMobile = useCallback((): void => {
    const { width } = getCurrentDimensions();
    setIsMobile(width < MOBILE_CONFIG.breakpoint);
  }, [getCurrentDimensions]);

  const debouncedCheckMobile = useCallback((): void => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout((): void => {
      checkMobile();
      timeoutRef.current = null;
    }, MOBILE_CONFIG.debounceMs);
  }, [checkMobile]);

  useEffect((): (() => void) => {
    checkMobile();

    const handleResize: ResizeHandler = debouncedCheckMobile;
    window.addEventListener('resize', handleResize);

    return (): void => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [checkMobile, debouncedCheckMobile]);

  return isMobile;
};

export type { WindowDimensions, MobileDetectionConfig };
