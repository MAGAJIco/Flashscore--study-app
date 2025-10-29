
'use client';

import { useEffect } from 'react';

export function ThemeInitializer() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.error('Theme initialization failed:', e);
    }
  }, []);

  return null;
}
