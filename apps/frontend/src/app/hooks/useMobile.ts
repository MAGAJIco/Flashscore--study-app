
"use client";
import { useState, useEffect } from 'react';

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth < 768;
      const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const touchPoints = navigator.maxTouchPoints > 0;
      
      setIsMobile(width || (userAgent && touchPoints));
    };

    checkMobile();
    
    const handleResize = () => {
      // Debounce resize events for better performance
      clearTimeout((window as any).__mobileResizeTimeout);
      (window as any).__mobileResizeTimeout = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', checkMobile, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', checkMobile);
      clearTimeout((window as any).__mobileResizeTimeout);
    };
  }, []);

  return isMobile;
}
