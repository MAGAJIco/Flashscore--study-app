'use client';

import { useEffect, useState } from 'react';
import { mobileDetector } from '@/lib/mobile-detection';

export function MobileOptimizationWrapper({ children }: { children: React.ReactNode }) {
  const [isOptimized, setIsOptimized] = useState(false);
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');

  useEffect(() => {
    const checkAndOptimize = () => {
      // Get centralized mobile detection
      const { isMobile } = mobileDetector.current;

      // Determine device performance tier (Amazon-style optimization)
      const getPerformanceTier = () => {
        const memory = (navigator as any).deviceMemory || 4;
        const cores = navigator.hardwareConcurrency || 2;
        const connection = (navigator as any).connection;
        const effectiveType = connection?.effectiveType || '4g';

        if (memory < 2 || cores < 2 || effectiveType === '2g' || effectiveType === 'slow-2g') {
          return 'low';
        } else if (memory < 4 || cores < 4 || effectiveType === '3g') {
          return 'medium';
        }
        return 'high';
      };

      const tier = getPerformanceTier();
      setPerformanceLevel(tier);
      document.body.setAttribute('data-performance', tier);

      if (isMobile) {
        // Apply mobile-specific optimizations
        document.body.classList.add('mobile-optimized');

        // Amazon-style adaptive loading based on performance tier
        if (tier === 'low') {
          document.body.classList.add('low-performance-mode');
          // Disable animations and heavy effects
          document.documentElement.style.setProperty('--animation-duration', '0ms');
        } else if (tier === 'medium') {
          document.body.classList.add('medium-performance-mode');
          document.documentElement.style.setProperty('--animation-duration', '150ms');
        }

        // Disable hover effects on mobile
        const style = document.createElement('style');
        style.textContent = `
          @media (hover: none) and (pointer: coarse) {
            .hover\\:scale-105:hover { transform: none !important; }
            .hover\\:shadow-lg:hover { box-shadow: none !important; }
            .hover-lift:hover { transform: none !important; }
          }

          /* Amazon-style performance optimizations */
          .low-performance-mode * {
            animation: none !important;
            transition: none !important;
          }

          .low-performance-mode img {
            image-rendering: auto;
          }
        `;
        document.head.appendChild(style);

        // Add resource hints for critical resources (Amazon strategy)
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        document.head.appendChild(preconnect);

      // Optimize touch targets
      document.documentElement.style.setProperty('--touch-target-min', '44px');

      // Enable momentum scrolling
      document.body.style.webkitOverflowScrolling = 'touch';

      // Prevent zoom on input focus
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport && viewport instanceof HTMLMetaElement) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        );
      }

      // Set custom viewport height for mobile browsers
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);

      setIsOptimized(true);
      } else {
        document.body.classList.remove('mobile-optimized');
        setIsOptimized(false);
      }

      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    };

    checkAndOptimize();
    window.addEventListener('resize', checkAndOptimize);
    window.addEventListener('orientationchange', checkAndOptimize);

    return () => {
      window.removeEventListener('resize', checkAndOptimize);
      window.removeEventListener('orientationchange', checkAndOptimize);
    };
  }, []);

  return <>{children}</>;
}