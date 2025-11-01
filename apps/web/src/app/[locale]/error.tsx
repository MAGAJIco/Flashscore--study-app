
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-purple-900/10" />
      
      <div className="relative z-10 max-w-2xl w-full">
        {/* Error card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50">
              <span className="text-4xl">⚠️</span>
            </div>
          </div>

          {/* Error message */}
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold text-white">
              Houston, we have a problem
            </h1>
            <p className="text-gray-400 text-lg">
              Something unexpected happened while loading your Empire
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-300">
                  Technical Details
                </summary>
                <pre className="mt-2 p-4 bg-black/50 rounded-lg text-xs text-red-400 overflow-auto">
                  {error.message}
                </pre>
              </details>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🔄</span>
              Try Again
            </button>
            
            <Link
              href="/en"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🏠</span>
              Go Home
            </Link>
          </div>

          {/* Help section */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-sm text-gray-500">
              If this problem persists, please refresh the page or contact support
            </p>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
