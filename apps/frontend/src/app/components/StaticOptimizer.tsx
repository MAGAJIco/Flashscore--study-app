
'use client';

import { useEffect } from 'react';

interface PreloadRoute {
  path: string;
  priority: 'high' | 'low';
}

const PRELOAD_ROUTES: PreloadRoute[] = [
  { path: '/api/predictions', priority: 'high' },
  { path: '/api/matches/live', priority: 'high' },
  { path: '/api/news', priority: 'low' },
];

export default function StaticOptimizer() {
  useEffect(() => {
    // Preload critical routes on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        PRELOAD_ROUTES.forEach(({ path, priority }) => {
          const link = document.createElement('link');
          link.rel = priority === 'high' ? 'preload' : 'prefetch';
          link.href = path;
          link.as = 'fetch';
          document.head.appendChild(link);
        });
      });
    }

    // DNS prefetch for backend
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    document.head.appendChild(dnsPrefetch);
  }, []);

  return null;
}
