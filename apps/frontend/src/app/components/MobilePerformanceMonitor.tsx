
'use client';

import { useEffect, useState } from 'react';

export function MobilePerformanceMonitor() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    connection: 'unknown'
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    // Start FPS monitoring
    animationId = requestAnimationFrame(measureFPS);

    // Monitor memory if available
    const memoryInterval = setInterval(() => {
      if ((performance as any).memory) {
        const memory = Math.round(
          (performance as any).memory.usedJSHeapSize / 1048576
        );
        setMetrics(prev => ({ ...prev, memory }));
      }
    }, 2000);

    // Monitor connection
    const updateConnection = () => {
      const conn = (navigator as any).connection;
      if (conn) {
        setMetrics(prev => ({ 
          ...prev, 
          connection: conn.effectiveType || 'unknown' 
        }));
      }
    };

    updateConnection();
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', updateConnection);
    }

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', updateConnection);
      }
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-20 right-4 bg-black/80 text-white text-xs p-2 rounded-lg z-[9999] font-mono">
      <div>FPS: {metrics.fps}</div>
      {metrics.memory > 0 && <div>MEM: {metrics.memory}MB</div>}
      <div>NET: {metrics.connection}</div>
    </div>
  );
}
