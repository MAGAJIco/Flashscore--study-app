
"use client";

import { useEffect, useState } from 'react';

interface RenderLog {
  timestamp: string;
  component: string;
  status: 'mount' | 'error' | 'unmount';
  message?: string;
}

export function RenderDebugger() {
  const [logs, setLogs] = useState<RenderLog[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Intercept console logs
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('mounted') || message.includes('unmounted')) {
        setLogs(prev => [...prev, {
          timestamp: new Date().toISOString().split('T')[1].split('.')[0],
          component: message.split(' ')[1],
          status: message.includes('mounted') ? 'mount' : 'unmount',
          message
        }]);
      }
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      setLogs(prev => [...prev, {
        timestamp: new Date().toISOString().split('T')[1].split('.')[0],
        component: 'Error',
        status: 'error',
        message
      }]);
      originalError.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
    };
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-[9999] bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition"
        title="Open Render Debugger"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-[9999] w-96 max-h-96 bg-gray-900 text-white rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-purple-600 px-4 py-2 flex justify-between items-center">
        <h3 className="font-bold">🐛 Render Debugger</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Stats */}
      <div className="bg-gray-800 px-4 py-2 text-xs grid grid-cols-3 gap-2">
        <div>
          <div className="text-green-400">✅ Mounted: {logs.filter(l => l.status === 'mount').length}</div>
        </div>
        <div>
          <div className="text-red-400">❌ Errors: {logs.filter(l => l.status === 'error').length}</div>
        </div>
        <div>
          <div className="text-gray-400">🔄 Unmounted: {logs.filter(l => l.status === 'unmount').length}</div>
        </div>
      </div>

      {/* Logs */}
      <div className="overflow-y-auto max-h-64 p-4 space-y-1 text-xs font-mono">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No logs yet...</div>
        ) : (
          logs.slice(-20).reverse().map((log, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                log.status === 'mount' ? 'bg-green-900/20 text-green-300' :
                log.status === 'error' ? 'bg-red-900/20 text-red-300' :
                'bg-gray-800 text-gray-400'
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-gray-500">{log.timestamp}</span>
                <span className="flex-1">{log.component}</span>
                <span>
                  {log.status === 'mount' ? '✅' : 
                   log.status === 'error' ? '❌' : '🔄'}
                </span>
              </div>
              {log.message && (
                <div className="text-gray-500 mt-1 text-[10px] truncate">
                  {log.message}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Actions */}
      <div className="bg-gray-800 px-4 py-2 flex gap-2">
        <button
          onClick={() => setLogs([])}
          className="flex-1 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs"
        >
          Clear Logs
        </button>
        <button
          onClick={() => {
            const data = JSON.stringify(logs, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `render-logs-${Date.now()}.json`;
            a.click();
          }}
          className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-xs"
        >
          Export
        </button>
      </div>
    </div>
  );
}
