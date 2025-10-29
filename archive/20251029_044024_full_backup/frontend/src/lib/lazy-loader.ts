
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

interface LazyOptions {
  loading?: ComponentType;
  ssr?: boolean;
  timeout?: number;
}

const DefaultLoader = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
  </div>
);

export function lazyLoad<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyOptions = {}
) {
  const { loading = DefaultLoader, ssr = false, timeout = 10000 } = options;

  return dynamic(importFn, {
    loading: () => <>{loading ? <loading.type /> : <DefaultLoader />}</>,
    ssr,
  });
}

// Preload component on hover/focus
export function preloadComponent(importFn: () => Promise<any>) {
  if (typeof window === 'undefined') return;
  
  const load = () => {
    importFn().catch(err => {
      console.warn('Preload failed:', err);
    });
  };

  return {
    onMouseEnter: load,
    onFocus: load,
  };
}
