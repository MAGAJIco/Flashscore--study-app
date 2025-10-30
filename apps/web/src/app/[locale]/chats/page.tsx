"use client";

import React, { useState } from 'react';
import MagajicoCEO from '@/components/MagajicoCEO';

export default function ChatsPage() {
  const [isCEOChatOpen, setIsCEOChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                💬 Chats
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with AI assistants and get personalized betting insights
              </p>
            </div>
          </div>

          {/* Chat Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {/* Magajico CEO Chat */}
            <div 
              onClick={() => setIsCEOChatOpen(!isCEOChatOpen)}
              className="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-500"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">🤖</div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isCEOChatOpen ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                  {isCEOChatOpen ? 'Active' : 'Start'}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Magajico CEO
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Your personal AI betting manager. Build smart bet slips with AI assistance.
              </p>
              <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-semibold">
                <span>🎯</span>
                <span>AI-Powered Recommendations</span>
              </div>
            </div>

            {/* AI Coach Assistant - Coming Soon */}
            <div className="bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">🏆</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                AI Coach
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Get expert training tips and performance analysis from our AI coach.
              </p>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-semibold">
                <span>📊</span>
                <span>Performance Analytics</span>
              </div>
            </div>

            {/* Live Match Chat - Coming Soon */}
            <div className="bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">⚡</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Live Match Chat
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Discuss live matches with AI and get real-time insights as games unfold.
              </p>
              <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                <span>🔴</span>
                <span>Real-time Updates</span>
              </div>
            </div>

            {/* Stats Expert - Coming Soon */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">📈</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Stats Expert
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Deep dive into team and player statistics with our analytics AI.
              </p>
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-semibold">
                <span>🔢</span>
                <span>Advanced Analytics</span>
              </div>
            </div>

            {/* News Curator - Coming Soon */}
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">📰</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                News Curator
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Get personalized sports news summaries tailored to your interests.
              </p>
              <div className="flex items-center gap-2 text-xs text-pink-600 dark:text-pink-400 font-semibold">
                <span>🎯</span>
                <span>Personalized Updates</span>
              </div>
            </div>

            {/* Community Chat - Coming Soon */}
            <div className="bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl p-6 opacity-60 cursor-not-allowed">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">👥</div>
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-300 text-gray-700">
                  Coming Soon
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Community Hub
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Connect with other sports enthusiasts and share predictions.
              </p>
              <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
                <span>💬</span>
                <span>Social Features</span>
              </div>
            </div>
          </div>
        </div>

        {/* Magajico CEO Chat Interface - Dropdown */}
        {isCEOChatOpen && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🤖</div>
                <div>
                  <h2 className="text-white font-bold text-xl">Magajico CEO Chat</h2>
                  <p className="text-purple-100 text-sm">Your AI Betting Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsCEOChatOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                title="Close chat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <MagajicoCEO />
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6 mt-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                How to Use AI Chats
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">1.</span>
                  <span>Click on the <strong>Magajico CEO</strong> card to open the chat interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">2.</span>
                  <span>Tell the AI which games you're interested in betting on</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">3.</span>
                  <span>Get personalized recommendations and build your bet slip</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">4.</span>
                  <span>Always remember to gamble responsibly!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
