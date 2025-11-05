
'use client';

import { useEffect, useState } from 'react';

export function MobileOptimizer() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Detect mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Network status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Connection type
    const updateConnection = () => {
      const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
        setConnectionType(conn.effectiveType || 'unknown');
      }
    };

    checkMobile();
    updateOnlineStatus();
    updateConnection();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      conn.addEventListener('change', updateConnection);
    }

    // Add mobile meta tags dynamically
    const metaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    ];

    metaTags.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Preload critical resources for mobile
  useEffect(() => {
    if (isMobile) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001';
      document.head.appendChild(link);
    }
  }, [isMobile]);

  return null;
}
