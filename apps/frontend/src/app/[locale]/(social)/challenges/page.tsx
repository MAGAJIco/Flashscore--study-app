"use client";

import React from 'react';
import Link from 'next/link';

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-purple-600 flex items-center gap-3">
              🎯 Friend Challenges
            </h1>
            <Link 
              href="/social/feed"
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ← Back to Feed
            </Link>
          </div>
          <p className="text-gray-600 text-lg mb-8">
            Challenge your friends to head-to-head prediction competitions. See who has the best sports analysis skills!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border-2 border-orange-200">
              <h3 className="text-xl font-bold text-orange-600 mb-3 flex items-center gap-2">
                🏆 Active Challenges
              </h3>
              <p className="text-gray-700 mb-4">
                Your ongoing prediction battles with friends.
              </p>
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">vs. @SportsFan123</p>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Live</span>
                  </div>
                  <p className="text-sm text-gray-600">Premier League Week 10</p>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-semibold">You: 7/10</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-gray-600">Them: 6/10</span>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">vs. @PredictionPro</p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Live</span>
                  </div>
                  <p className="text-sm text-gray-600">NBA Weekly Challenge</p>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-gray-600 font-semibold">You: 12/15</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-green-600">Them: 13/15</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-600 mb-3 flex items-center gap-2">
                📊 Leaderboard
              </h3>
              <p className="text-gray-700 mb-4">
                Top challenge performers this week.
              </p>
              <div className="space-y-2">
                {[
                  { rank: 1, name: '@ChampionPredictor', score: '95%', emoji: '🥇' },
                  { rank: 2, name: '@YouUsername', score: '87%', emoji: '🥈' },
                  { rank: 3, name: '@SportsMaster', score: '84%', emoji: '🥉' },
                  { rank: 4, name: '@PredictionKing', score: '79%', emoji: '4️⃣' },
                  { rank: 5, name: '@AnalyticsQueen', score: '76%', emoji: '5️⃣' }
                ].map((player, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{player.emoji}</span>
                      <span className="font-semibold text-gray-800">{player.name}</span>
                    </div>
                    <span className="text-green-600 font-bold">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                🎮 Challenge Types
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span><strong>Weekly:</strong> Predict all matches in a week</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span><strong>Head-to-Head:</strong> Single match predictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span><strong>Season Long:</strong> Compete all season</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">▸</span>
                  <span><strong>Custom:</strong> Create your own rules</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 border-2 border-pink-200">
              <h3 className="text-xl font-bold text-pink-600 mb-3 flex items-center gap-2">
                🎁 Rewards
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>Earn Pi Coins for wins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>Unlock achievements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>Climb global rankings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500">▸</span>
                  <span>Special badges & titles</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
              🎯 Create New Challenge
            </button>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border-2 border-orange-200">
            <p className="text-center text-gray-600">
              💡 <strong>Note:</strong> This is a preview page. Full challenge functionality will be implemented in the next phase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
