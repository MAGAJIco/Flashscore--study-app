
"use client";

import React, { useEffect, useState } from 'react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
      color: 'white',
      padding: '12px',
      textAlign: 'center',
      zIndex: 9999,
      fontSize: '14px',
      fontWeight: 600,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
    }}>
      📡 You're offline - Some features may be limited
    </div>
  );
};
