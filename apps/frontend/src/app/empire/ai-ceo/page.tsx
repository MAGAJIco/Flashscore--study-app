
"use client";
import React from 'react';
import MagajiCoManager from '../../components/MagajiCoManager';
import Link from 'next/link';

export default function AICEOPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/empire" 
            className="text-blue-400 hover:text-blue-300 mb-4 inline-flex items-center gap-2"
          >
            ← Back to Empire
          </Link>
          <h1 className="text-4xl font-bold text-white mt-4 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            🧠 MagajiCo AI CEO Command Center
          </h1>
          <p className="text-gray-300 mt-2">
            Your strategic AI advisor for empire building and predictions
          </p>
        </div>

        {/* AI CEO Manager - Always Open */}
        <div className="relative">
          <MagajiCoManager isOpen={true} />
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Strategic Intelligence</h3>
            <p className="text-gray-300">Real-time market analysis and predictions</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-purple-400 mb-2">AI Insights</h3>
            <p className="text-gray-300">ML-powered decision making</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-blue-400 mb-2">Empire Growth</h3>
            <p className="text-gray-300">Build your prediction empire</p>
          </div>
        </div>
      </div>
    </div>
  );
}
