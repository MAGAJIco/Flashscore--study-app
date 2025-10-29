
"use client";

import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  totalPredictions: number;
  correctPredictions: number;
  winRate: number;
  growthLevel: number;
  empireRank: string;
  streak: number;
}

export default function LeaderboardFeature() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        userId: 'user-elite-001',
        username: 'ElitePro',
        totalPredictions: 250,
        correctPredictions: 205,
        winRate: 0.82,
        growthLevel: 6,
        empireRank: 'Legendary Rooftop',
        streak: 12,
      },
      {
        rank: 2,
        userId: 'user-master-002',
        username: 'StrategyMaster',
        totalPredictions: 180,
        correctPredictions: 130,
        winRate: 0.72,
        growthLevel: 4,
        empireRank: 'Master Strategist',
        streak: 5,
      },
      {
        rank: 3,
        userId: 'user-expert-003',
        username: 'ExpertAnalyst',
        totalPredictions: 120,
        correctPredictions: 75,
        winRate: 0.625,
        growthLevel: 3,
        empireRank: 'Expert Predictor',
        streak: 3,
      },
    ];

    setLeaderboard(mockLeaderboard);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-700/50 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-white mb-6">🏆 Top Empire Builders</h3>
      {leaderboard.map((entry) => {
        const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;

        return (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 p-6 rounded-xl transition-all ${
              entry.rank <= 3
                ? 'bg-gradient-to-r from-yellow-600/30 to-transparent border border-yellow-500/30'
                : 'bg-gray-800/50 border border-gray-700'
            }`}
          >
            <div className="flex items-center justify-center w-16 h-16 text-3xl">
              {medal || `#${entry.rank}`}
            </div>

            <div className="flex-1">
              <h4 className="text-xl font-bold text-white">{entry.username}</h4>
              <p className="text-sm text-gray-400">{entry.empireRank}</p>
            </div>

            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">{entry.totalPredictions}</div>
                <div className="text-xs text-gray-400">Predictions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{(entry.winRate * 100).toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-400">{entry.streak}🔥</div>
                <div className="text-xs text-gray-400">Streak</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
