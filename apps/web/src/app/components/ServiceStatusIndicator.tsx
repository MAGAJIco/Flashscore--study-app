
'use client';

import { useEffect, useState } from 'react';

interface ServiceStatus {
  api: boolean;
  predictions: boolean;
}

export function ServiceStatusIndicator() {
  const [status, setStatus] = useState<ServiceStatus>({ api: true, predictions: true });
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleServiceUnhealthy = (event: CustomEvent) => {
      const { serviceName } = event.detail;
      setStatus(prev => ({
        ...prev,
        [serviceName]: false
      }));
      setShowIndicator(true);
    };

    window.addEventListener('service-unhealthy', handleServiceUnhealthy as EventListener);

    return () => {
      window.removeEventListener('service-unhealthy', handleServiceUnhealthy as EventListener);
    };
  }, []);

  if (!showIndicator || (status.api && status.predictions)) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded-lg p-3 shadow-lg max-w-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
        <div>
          <p className="font-semibold text-yellow-900 dark:text-yellow-100 text-sm">
            Limited Connectivity
          </p>
          <p className="text-xs text-yellow-800 dark:text-yellow-200">
            Some features may be unavailable
          </p>
        </div>
      </div>
    </div>
  );
}
