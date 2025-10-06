"use client";
import React, { useState, useEffect } from 'react';
import { sportsIntegration, GrowthScore, EMPIRE_LEVELS } from '../../../../../../packages/shared/src/libs/services/sportsIntegration';

interface LeaderboardEntry extends GrowthScore {
  rank: number;
  username?: string;
}

export default function EmpireLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/empire/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      } else {
        setLeaderboard(generateMockLeaderboard());
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      setLeaderboard(generateMockLeaderboard());
    } finally {
      setLoading(false);
    }
  };

  const generateMockLeaderboard = (): LeaderboardEntry[] => {
    return [
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
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">🏆 Empire Leaderboard</h2>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
      <h2 className="text-2xl font-bold text-white mb-4">🏆 Empire Leaderboard</h2>
      
      <div className="space-y-2">
        {leaderboard.map((entry) => {
          const medal = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : null;
          const level = EMPIRE_LEVELS.find(l => l.level === entry.growthLevel);

          return (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                entry.rank <= 3
                  ? 'bg-gradient-to-r from-yellow-600/30 to-transparent border border-yellow-500/30'
                  : 'bg-gray-800/50 border border-gray-700'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 text-2xl">
                {medal || `#${entry.rank}`}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">
                    {entry.username || `Builder ${entry.userId.slice(-8)}`}
                  </h3>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                    {entry.empireRank}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-300">
                  <span>Win Rate: <span className="text-green-400 font-semibold">{(entry.winRate * 100).toFixed(1)}%</span></span>
                  <span>Predictions: <span className="text-blue-400 font-semibold">{entry.totalPredictions}</span></span>
                  {entry.streak > 0 && (
                    <span>Streak: <span className="text-orange-400 font-semibold">🔥 {entry.streak}</span></span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-400">
                  ⚡ {sportsIntegration.calculatePowerBonus(entry)}
                </div>
                <div className="text-xs text-gray-400">
                  {level?.powerMultiplier}x multiplier
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={loadLeaderboard}
        className="mt-4 w-full py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm text-gray-300"
      >
        🔄 Refresh Leaderboard
      </button>
    </div>
  );
}
