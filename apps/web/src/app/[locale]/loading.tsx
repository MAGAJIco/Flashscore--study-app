
'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center space-y-8">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full animate-spin" style={{
              borderTopColor: '#8b5cf6',
              animationDuration: '3s'
            }} />
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full animate-pulse flex items-center justify-center">
                <span className="text-4xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Brand name */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
            Magajico
          </h1>
          <p className="text-gray-400 text-sm tracking-wider uppercase animate-pulse">
            Empire Loading...
          </p>
        </div>

        {/* Loading progress bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 animate-loading-bar" />
        </div>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Subtle status text */}
        <p className="text-gray-500 text-xs animate-pulse">
          Initializing AI-powered predictions...
        </p>
      </div>

      <style jsx>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
