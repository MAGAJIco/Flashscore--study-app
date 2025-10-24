
"use client";

import { useEffect, useState } from 'react';

interface RenderTrackerProps {
  componentName: string;
  children: React.ReactNode;
  showDebugPanel?: boolean;
}

export function RenderTracker({ componentName, children, showDebugPanel = true }: RenderTrackerProps) {
  const [renderCount, setRenderCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    const elapsed = Date.now() - startTime;
    console.log(`📊 [${componentName}] Render #${renderCount + 1} at +${elapsed}ms`);

    // Performance monitoring
    if (elapsed > 1000) {
      console.warn(`⚠️ [${componentName}] Slow render detected: ${elapsed}ms`);
    }

    return () => {
      console.log(`🔄 [${componentName}] Cleanup`);
    };
  }, [componentName, renderCount, startTime]);

  try {
    return (
      <div data-component={componentName} data-render-count={renderCount}>
        {showDebugPanel && process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'rgba(0,0,0,0.8)',
            color: '#0f0',
            padding: '4px 8px',
            fontSize: '10px',
            zIndex: 9998,
            borderRadius: '0 0 0 4px'
          }}>
            {componentName}: {renderCount} renders
          </div>
        )}
        {children}
        {errors.length > 0 && (
          <div style={{
            background: '#fee',
            border: '1px solid #f00',
            padding: '10px',
            margin: '10px 0',
            borderRadius: '4px'
          }}>
            <strong>Errors in {componentName}:</strong>
            <ul>
              {errors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ [${componentName}] Render error:`, error);
    setErrors(prev => [...prev, errorMsg]);
    return (
      <div style={{
        background: '#fee',
        border: '2px solid #f00',
        padding: '20px',
        margin: '10px',
        borderRadius: '8px'
      }}>
        <h3 style={{ color: '#f00' }}>❌ {componentName} Failed</h3>
        <p>{errorMsg}</p>
      </div>
    );
  }
}
