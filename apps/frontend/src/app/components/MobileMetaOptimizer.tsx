"use client";

import { useEffect } from 'react';
import { ClientOnly } from './ClientOnly';

function MobileMetaOptimizerContent() {
  useEffect(() => {
    // Viewport height fix for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Prevent zoom on input focus (iOS)
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport && viewport instanceof HTMLMetaElement) {
      const content = viewport.getAttribute('content');
      viewport.setAttribute('content', `${content}, maximum-scale=1`);
    }

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return null;
}

export function MobileMetaOptimizer() {
  return (
    <ClientOnly>
      <MobileMetaOptimizerContent />
    </ClientOnly>
  );
}