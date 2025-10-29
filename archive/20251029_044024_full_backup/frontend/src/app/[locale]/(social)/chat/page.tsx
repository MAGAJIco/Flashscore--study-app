"use client";

import React from 'react';
import Link from 'next/link';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-purple-600 flex items-center gap-3">
              💬 Live Match Chat
            </h1>
            <Link 
              href="/social/feed"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← Back to Feed
            </Link>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Join live discussions during matches, share your predictions, and engage with the community in real-time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-600 mb-3 flex items-center gap-2">
                ⚽ Live Match Rooms
              </h3>
              <p className="text-gray-700 mb-4">
                Chat in real-time during live matches. See what other fans are saying and share your analysis.
              </p>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-800">⚽ Premier League - Man Utd vs Arsenal</p>
                  <p className="text-xs text-gray-500">234 users online</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-800">🏀 NBA - Lakers vs Celtics</p>
                  <p className="text-xs text-gray-500">156 users online</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-600 mb-3 flex items-center gap-2">
                👥 Community Chat
              </h3>
              <p className="text-gray-700 mb-4">
                General sports discussions, predictions, and strategy talks with the community.
              </p>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-800">💡 Prediction Strategies</p>
                  <p className="text-xs text-gray-500">89 users online</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold text-gray-800">📊 Analytics Discussion</p>
                  <p className="text-xs text-gray-500">67 users online</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                ⚡ Features
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span>Real-time messaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span>Emoji reactions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span>Match notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span>Expert insights</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border-2 border-pink-200">
              <h3 className="text-xl font-bold text-pink-600 mb-3 flex items-center gap-2">
                🎯 Coming Soon
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>Voice chat rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>Private messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>GIF support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>Thread replies</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <p className="text-center text-gray-600">
              💡 <strong>Note:</strong> This is a preview page. Full chat functionality will be implemented in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
