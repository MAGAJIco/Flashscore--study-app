
"use client";

import { useEffect, useState } from 'react';

export default function MobilePerformanceOptimizer() {
  const [connectionType, setConnectionType] = useState<string>('4g');
  const [dataMode, setDataMode] = useState<'full' | 'lite'>('full');

  useEffect(() => {
    // Detect connection speed
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const updateConnection = () => {
        const effectiveType = connection.effectiveType;
        setConnectionType(effectiveType);
        
        // Auto-switch to lite mode on slow connections
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          setDataMode('lite');
          document.body.classList.add('lite-mode');
        } else if (effectiveType === '3g') {
          // Keep current mode but optimize
          document.body.classList.add('optimized-mode');
        }
      };

      updateConnection();
      connection.addEventListener('change', updateConnection);

      return () => connection.removeEventListener('change', updateConnection);
    }
  }, []);

  useEffect(() => {
    // Lazy load images on mobile
    if ('IntersectionObserver' in window) {
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
      }, { rootMargin: '50px' });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      return () => imageObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    // Reduce animations on low-end devices
    const checkPerformance = () => {
      if ('deviceMemory' in navigator && (navigator as any).deviceMemory < 4) {
        document.body.classList.add('reduce-motion');
      }
    };

    checkPerformance();
  }, []);

  useEffect(() => {
    // Prefetch critical resources
    const prefetchLinks = [
      '/api/predictions',
      '/api/matches/today'
    ];

    prefetchLinks.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  return null;
}
