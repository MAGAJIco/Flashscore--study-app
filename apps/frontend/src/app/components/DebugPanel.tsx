
"use client";

import { useEffect, useState } from 'react';

export function DebugPanel() {
  const [logs, setLogs] = useState<Array<{ time: string; message: string; type: string }>>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [performance, setPerformance] = useState({
    loadTime: 0,
    domReady: 0,
    firstPaint: 0
  });

  useEffect(() => {
    // Capture console logs
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      setLogs(prev => [...prev.slice(-50), {
        time: new Date().toLocaleTimeString(),
        message: args.join(' '),
        type: 'log'
      }]);
    };

    console.error = (...args) => {
      originalError(...args);
      setLogs(prev => [...prev.slice(-50), {
        time: new Date().toLocaleTimeString(),
        message: args.join(' '),
        type: 'error'
      }]);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      setLogs(prev => [...prev.slice(-50), {
        time: new Date().toLocaleTimeString(),
        message: args.join(' '),
        type: 'warn'
      }]);
    };

    // Performance metrics
    if (performance.timing) {
      const timing = performance.timing as any;
      setPerformance({
        loadTime: timing.loadEventEnd - timing.navigationStart,
        domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
        firstPaint: timing.responseEnd - timing.requestStart
      });
    }

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#1a1a1a',
      color: '#fff',
      zIndex: 99999,
      maxHeight: isMinimized ? '40px' : '400px',
      overflow: 'hidden',
      borderTop: '2px solid #333',
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#000',
        cursor: 'pointer'
      }} onClick={() => setIsMinimized(!isMinimized)}>
        <strong>🐛 Debug Panel ({logs.length} logs)</strong>
        <div style={{ display: 'flex', gap: '16px', fontSize: '10px' }}>
          <span>Load: {performance.loadTime}ms</span>
          <span>DOM: {performance.domReady}ms</span>
          <button onClick={(e) => { e.stopPropagation(); setLogs([]); }} style={{
            background: '#f00',
            color: '#fff',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Clear</button>
          <span>{isMinimized ? '▲' : '▼'}</span>
        </div>
      </div>
      {!isMinimized && (
        <div style={{
          padding: '12px',
          maxHeight: '360px',
          overflowY: 'auto'
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{
              padding: '4px 0',
              borderBottom: '1px solid #333',
              color: log.type === 'error' ? '#f00' : log.type === 'warn' ? '#fa0' : '#0f0'
            }}>
              <span style={{ opacity: 0.6 }}>[{log.time}]</span> {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
