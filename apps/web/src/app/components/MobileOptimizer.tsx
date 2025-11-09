
'use client';

import { useEffect, useState } from 'react';

export function MobileOptimizer() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Network status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Connection type and speed
    const updateConnection = () => {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        setConnectionType(conn.effectiveType || 'unknown');
        
        // Detect slow connection
        if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
          document.documentElement.classList.add('slow-connection');
        } else {
          document.documentElement.classList.remove('slow-connection');
        }

        // Save data mode
        if (conn.saveData) {
          document.documentElement.classList.add('save-data');
        }
      }
    };

    // Detect low power mode (battery)
    const updateBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          const checkPowerMode = () => {
            const isLow = battery.charging === false && battery.level < 0.2;
            setIsLowPowerMode(isLow);
            if (isLow) {
              document.documentElement.classList.add('low-power-mode');
            } else {
              document.documentElement.classList.remove('low-power-mode');
            }
          };
          
          checkPowerMode();
          battery.addEventListener('chargingchange', checkPowerMode);
          battery.addEventListener('levelchange', checkPowerMode);
        } catch (e) {
          // Battery API not supported
        }
      }
    };

    checkMobile();
    updateOnlineStatus();
    updateConnection();
    updateBatteryStatus();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      conn.addEventListener('change', updateConnection);
    }

    // Viewport height fix for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Add mobile meta tags dynamically
    const metaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'format-detection', content: 'telephone=no' },
    ];

    metaTags.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Preload critical resources
    if (isMobile) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001';
      document.head.appendChild(link);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, [isMobile]);

  return null;
}
