
'use client';

import { useEffect, useState } from 'react';
import { useMobile } from '@hooks/useMobile';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const isMobile = useMobile();
  const [isPWA, setIsPWA] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Detect if running as PWA
    const isPWAMode = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true;
    setIsPWA(isPWAMode);

    if (isMobile) {
      // Prevent pull-to-refresh on mobile
      document.body.style.overscrollBehavior = 'none';
      
      // Enable smooth scrolling
      document.documentElement.style.scrollBehavior = 'smooth';
      
      // Optimize viewport height for mobile browsers
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
      
      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    }
  }, [isMobile]);

  if (!mounted) {
    return <div className="mobile-layout">{children}</div>;
  }

  return (
    <div className={`mobile-layout ${isPWA ? 'pwa-mode' : ''}`}>
      {children}
    </div>
  );
}
