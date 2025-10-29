'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Smartphone, Zap, Heart, Bell } from 'lucide-react';

interface IOSStyleFeaturesProps {
  children?: React.ReactNode;
}

export function IOSStyleFeatures({ children }: IOSStyleFeaturesProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize theme on mount - client-side only
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark) || (!savedTheme && prefersDark);

    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Haptic Feedback Simulation
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Dark Mode Toggle with iOS-style animation
  const toggleDarkMode = () => {
    triggerHaptic('light');
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Pull to Refresh Implementation
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
      triggerHaptic('medium');

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
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center items-center z-50 transition-all"
          style={{ height: `${pullDistance}px` }}
        >
          <div className={`transform transition-transform ${isRefreshing ? 'animate-spin' : ''}`}>
            <Zap className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
          </div>
        </div>
      )}

      {/* iOS-Style Status Bar */}
      <div className={`fixed top-0 left-0 right-0 h-12 z-40 backdrop-blur-xl ${
        isDarkMode ? 'bg-black/80' : 'bg-white/80'
      } border-b ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
        <div className="flex justify-between items-center h-full px-4">
          <div className="flex items-center gap-2">
            <div className={`w-16 h-4 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`} />
          </div>
          <div className="flex items-center gap-3">
            <Bell className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-black'}`} />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-12">
        {children}
      </div>

      {/* iOS-Style Bottom Sheet */}
      <button
        onClick={() => {
          triggerHaptic('medium');
          setShowBottomSheet(!showBottomSheet);
        }}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full ${
          isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
        } shadow-2xl flex items-center justify-center transition-transform hover:scale-110 z-50`}
      >
        <Heart className="w-6 h-6" />
      </button>

      {showBottomSheet && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setShowBottomSheet(false)}
          />
          <div className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl transform transition-transform duration-300 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          } ${showBottomSheet ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="p-6">
              <div className={`w-12 h-1.5 ${isDarkMode ? 'bg-white/30' : 'bg-gray-300'} rounded-full mx-auto mb-6`} />

              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className={`w-full p-4 rounded-2xl text-left transition-colors ${
                  isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5" />
                    <span className="font-semibold">Share App</span>
                  </div>
                </button>

                <button className={`w-full p-4 rounded-2xl text-left transition-colors ${
                  isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <span className="font-semibold">Notifications</span>
                  </div>
                </button>

                <button className={`w-full p-4 rounded-2xl text-left transition-colors ${
                  isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5" />
                    <span className="font-semibold">Quick Match</span>
                  </div>
                </button>
              </div>

              <button 
                onClick={() => setShowBottomSheet(false)}
                className="w-full mt-6 p-4 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}