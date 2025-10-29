'use client';

import { useEffect, useState } from 'react';

export function BackendStatusIndicator() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('/api/backend/health', { 
          signal: AbortSignal.timeout(3000) 
        });
        setStatus(response.ok ? 'connected' : 'disconnected');
      } catch {
        setStatus('disconnected');
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 120000); // Check every 2 minutes
    return () => clearInterval(interval);
  }, []);

  if (status === 'connected') return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div 
        className={`glass-card px-6 py-3 rounded-full shadow-2xl cursor-pointer transition-all hover:scale-105 ${
          status === 'checking' 
            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30'
        }`}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            status === 'checking' 
              ? 'bg-yellow-400 animate-pulse' 
              : 'bg-red-500 animate-pulse'
          }`} />
          <span className="text-white font-semibold">
            {status === 'checking' ? 'Connecting to backend...' : 'Backend offline - Using demo data'}
          </span>
          <span className="text-gray-300 text-sm">ℹ️</span>
        </div>
      </div>

      {showDetails && status === 'disconnected' && (
        <div className="mt-2 glass-card p-4 rounded-xl shadow-xl max-w-md">
          <h4 className="text-white font-bold mb-2">💡 Backend Service Status</h4>
          <p className="text-gray-300 text-sm mb-3">
            The backend service is not running. The app is currently using demo data.
          </p>
          <div className="bg-black/40 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-400 mb-1">To start the backend:</p>
            <code className="text-xs text-green-400 font-mono">
              cd apps/backend && npm start
            </code>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
          >
            Retry Connection
          </button>
        </div>
      )}
    </div>
  );
}