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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        {/* App Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-3xl shadow-lg mx-auto flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
          MagajiCo
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 text-center mb-12 max-w-md mx-auto">
          Your Sports Prediction Platform
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <div className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
            🎯 AI Predictions
          </div>
          <div className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
            ⚡ Live Scores
          </div>
          <div className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-sm font-medium text-gray-700">
            🏆 Rewards
          </div>
        </div>

        {/* CTA Button */}
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200">
          Get Started
        </button>
      </div>
    </div>
  );
}