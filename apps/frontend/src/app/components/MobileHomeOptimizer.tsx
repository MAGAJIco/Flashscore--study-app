
'use client';

import { useEffect } from 'react';
import { useMobile } from '../hooks/useMobile';
import { useBatteryOptimization } from '../hooks/useBatteryOptimization';

export default function MobileHomeOptimizer() {
  const isMobile = useMobile();
  const { optimizationSettings } = useBatteryOptimization();

  useEffect(() => {
    if (!isMobile) return;

    // Reduce animation complexity on mobile
    if (optimizationSettings.disableAnimations) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    }

    // Lazy load images with Intersection Observer
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));

    // Optimize scroll performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Throttled scroll logic here
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      imageObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile, optimizationSettings]);

  return null;
}
