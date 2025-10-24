
"use client";
import React, { useState } from 'react';
import MagajiCoManager from '../../components/MagajiCoManager';
import MagajiCoPredictionChat from '../../components/MagajiCoPredictionChat';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/Breadcrumbs';

export default function AICEOPage() {
  const [activeView, setActiveView] = useState<'classic' | 'chat'>('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumbs 
            items={[
              { label: "Empire", href: "/empire" },
              { label: "AI CEO" }
            ]}
          />
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
                🧠 MagajiCo AI CEO Command Center
              </h1>
              <p className="text-gray-300 mt-2">
                Your strategic AI advisor for empire building and predictions
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('chat')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeView === 'chat'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                💬 Chat Mode
              </button>
              <button
                onClick={() => setActiveView('classic')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeView === 'classic'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                📊 Classic View
              </button>
            </div>
          </div>
        </div>

        {/* AI Interface */}
        <div className="relative">
          {activeView === 'chat' ? (
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <MagajiCoPredictionChat />
            </div>
          ) : (
            <MagajiCoManager isOpen={true} />
          )}
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

