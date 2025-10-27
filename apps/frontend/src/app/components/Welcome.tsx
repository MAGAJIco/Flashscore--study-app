
'use client';

import React, { useState, useEffect } from 'react';

export function Welcome() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 flex items-center justify-center">
      <div className="text-center px-6">
        {/* App Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl mx-auto flex items-center justify-center border border-white/30">
            <span className="text-4xl">⚽</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          MagajiCo
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-white/90 mb-12 max-w-md mx-auto">
          Your Sports Prediction Platform
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <div className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-sm font-medium text-white">
            🎯 AI Predictions
          </div>
          <div className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-sm font-medium text-white">
            ⚡ Live Scores
          </div>
          <div className="px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-sm font-medium text-white">
            🏆 Rewards
          </div>
        </div>

        {/* CTA Button */}
        <button className="px-10 py-4 bg-white text-purple-600 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 active:scale-95 transition-all duration-200">
          Get Started
        </button>
      </div>
    </div>
  );
}
