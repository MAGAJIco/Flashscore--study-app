
'use client';

import React, { useState, useEffect } from 'react';

export function Welcome() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-800 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* iOS 17 Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-3 pb-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="opacity-90">9:41</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2.5 bg-white rounded-full opacity-60" />
              <div className="w-0.5 h-2.5 bg-white rounded-full opacity-70" />
              <div className="w-0.5 h-2.5 bg-white rounded-full opacity-80" />
              <div className="w-0.5 h-2.5 bg-white rounded-full" />
            </div>
            <svg className="w-4 h-3.5" fill="white" viewBox="0 0 24 24">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 border border-white rounded-sm relative">
                <div className="absolute inset-0.5 bg-white rounded-sm" />
              </div>
              <div className="w-0.5 h-1 bg-white rounded-full opacity-60" />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Island */}
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40">
        <div className="w-32 h-9 bg-black border border-gray-900 rounded-full shadow-2xl flex items-center justify-center gap-2 px-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          <div className="w-12 h-0.5 bg-gray-700 rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative pt-24 px-6 flex flex-col items-center justify-center min-h-screen">
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        {/* App Icon */}
        <div className="relative z-10 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="relative z-10 text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
          MagajiCo
        </h1>

        {/* Subtitle */}
        <p className="relative z-10 text-lg text-gray-400 text-center mb-12 max-w-md">
          Your Sports Prediction Platform
        </p>

        {/* Feature Pills */}
        <div className="relative z-10 flex flex-wrap justify-center gap-3 mb-12">
          <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium">
            🎯 AI Predictions
          </div>
          <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium">
            ⚡ Live Scores
          </div>
          <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-sm font-medium">
            🏆 Rewards
          </div>
        </div>

        {/* CTA Button */}
        <button className="relative z-10 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200">
          Get Started
        </button>

        {/* Bottom Indicator */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
