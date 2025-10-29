
'use client';

import React, { useState, useEffect } from 'react';

interface IOSStyleFeaturesProps {
  children?: React.ReactNode;
}

export function IOSStyleFeatures({ children }: IOSStyleFeaturesProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  let startY = 0;
  const handleTouchStart = (e: React.TouchEvent) => {
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(distance, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 80) {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        window.location.reload();
      }, 1500);
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div 
      className={`ios-wrapper ${isDarkMode ? 'dark' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      suppressHydrationWarning
    >
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <div className={`transform transition-transform ${isRefreshing ? 'animate-spin' : ''}`}>
            ⚡
          </div>
        </div>
      )}

      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
}
