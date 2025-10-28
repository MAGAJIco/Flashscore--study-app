
"use client";

import React, { useState, useEffect } from "react";

interface LeaderboardEntry {
  userId: string;
  username: string;
  totalPower: number;
  rank: number;
  avatar?: string;
}

export default function LeaderboardFeature() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/empire/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/20 rounded w-1/2"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/20 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🏆</span>
        Global Leaderboard
      </h2>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.userId}
            className={`flex items-center justify-between p-4 rounded-xl transition-all ${
              index < 3
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index === 0
                    ? 'bg-yellow-500 text-gray-900'
                    : index === 1
                    ? 'bg-gray-300 text-gray-900'
                    : index === 2
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <div className="text-white font-semibold">{entry.username}</div>
                <div className="text-gray-400 text-sm">{entry.totalPower} Power</div>
              </div>
            </div>

            {index < 3 && (
              <div className="text-2xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
            )}
          </div>
        ))}

        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No rankings yet. Be the first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
