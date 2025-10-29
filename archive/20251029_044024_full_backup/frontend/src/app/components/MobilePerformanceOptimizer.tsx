
"use client";

import { useEffect, useState, useCallback, useMemo } from 'react';

export function MobilePerformanceOptimizer() {
  const [connectionType, setConnectionType] = useState<string>('4g');
  const [dataMode, setDataMode] = useState<'full' | 'lite'>('full');

  const updateConnection = useCallback((effectiveType: string) => {
    setConnectionType(effectiveType);
    
    // Auto-switch to lite mode on slow connections with Liverpool theme
    if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      setDataMode('lite');
      document.body.classList.add('lite-mode');
      document.body.classList.remove('optimized-mode');
      document.body.style.setProperty('--accent-color', '#C8102E');
    } else if (effectiveType === '3g') {
      setDataMode('full');
      document.body.classList.add('optimized-mode');
      document.body.classList.remove('lite-mode');
      document.body.style.setProperty('--accent-color', '#C8102E');
    } else {
      setDataMode('full');
      document.body.classList.remove('lite-mode', 'optimized-mode');
      document.body.style.setProperty('--accent-color', '#C8102E');
    }
  }, []);

  useEffect(() => {
    // Add viewport meta tag for mobile optimization
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover');
    }

    // Detect connection speed
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const handleConnectionChange = () => {
        updateConnection(connection.effectiveType);
      };

      updateConnection(connection.effectiveType);
      connection.addEventListener('change', handleConnectionChange);

      return () => connection.removeEventListener('change', handleConnectionChange);
    }
  }, [updateConnection]);

  useEffect(() => {
    // Lazy load images on mobile with improved performance
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              // Use requestIdleCallback for better performance
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  img.src = img.dataset.src!;
                  img.removeAttribute('data-src');
                  imageObserver.unobserve(img);
                });
              } else {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          }
        });
      }, { rootMargin: '100px', threshold: 0.01 });

      // Observe existing images
      const observeImages = () => {
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      };

      observeImages();

      // Re-observe on dynamic content changes
      const mutationObserver = new MutationObserver(() => {
        observeImages();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => {
        imageObserver.disconnect();
        mutationObserver.disconnect();
      };
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
    // Add DNS prefetch and preconnect for external resources
    const dnsPrefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);

      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    });

    // Prefetch critical resources with priority
    const prefetchLinks = [
      { url: '/api/predictions', priority: 'high' },
      { url: '/api/matches/today', priority: 'high' },
      { url: '/api/backend/predictions/live', priority: 'low' }
    ];

    prefetchLinks.forEach(({ url, priority }) => {
      // Use requestIdleCallback for low priority prefetches
      const prefetch = () => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'fetch';
        document.head.appendChild(link);
      };

      if (priority === 'low' && 'requestIdleCallback' in window) {
        requestIdleCallback(() => prefetch(), { timeout: 2000 });
      } else {
        prefetch();
      }
    });

    // Reduce main thread work
    if ('scheduler' in window && 'yield' in (window.scheduler as any)) {
      (async () => {
        await (window.scheduler as any).yield();
      })();
    }
  }, []);

  return null;
}
