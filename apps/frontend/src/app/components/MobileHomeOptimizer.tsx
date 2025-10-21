'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';

export function MobileHomeOptimizer() {
  const pathname = usePathname();

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  const optimizeForMobile = useCallback(() => {
    if (!isMobile) return;

    // Disable hover effects on mobile
    document.body.classList.add('mobile-optimized');

    // Optimize touch targets
    const style = document.createElement('style');
    style.textContent = `
      .mobile-optimized button,
      .mobile-optimized a {
        min-height: 44px;
        min-width: 44px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [isMobile]);

  useEffect(() => {
    const cleanup = optimizeForMobile();
    return cleanup;
  }, [optimizeForMobile]);

  return null;
}