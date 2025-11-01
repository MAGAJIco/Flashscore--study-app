
'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
          animation: 'pulse-slow 4s ease-in-out infinite'
        }} />
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center space-y-8">
        {/* 404 */}
        <div className="relative">
          <h1 className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse-slow">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Lost in the Multiverse
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            This page doesn't exist in our reality. Let's get you back to familiar territory.
          </p>
        </div>

        {/* Navigation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          <Link href="/en" className="group bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all transform hover:scale-105">
            <div className="text-4xl mb-2">🏠</div>
            <div className="text-white font-semibold">Empire Home</div>
            <div className="text-gray-500 text-sm mt-1">Main dashboard</div>
          </Link>

          <Link href="/en/predictions" className="group bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all transform hover:scale-105">
            <div className="text-4xl mb-2">🤖</div>
            <div className="text-white font-semibold">Predictions</div>
            <div className="text-gray-500 text-sm mt-1">AI insights</div>
          </Link>

          <Link href="/en/live" className="group bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all transform hover:scale-105">
            <div className="text-4xl mb-2">⚡</div>
            <div className="text-white font-semibold">Live Matches</div>
            <div className="text-gray-500 text-sm mt-1">Real-time action</div>
          </Link>
        </div>

        {/* Error code */}
        <div className="mt-12 text-gray-600 text-sm font-mono">
          ERROR_CODE: PAGE_NOT_FOUND_IN_REALITY_v1.0
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
