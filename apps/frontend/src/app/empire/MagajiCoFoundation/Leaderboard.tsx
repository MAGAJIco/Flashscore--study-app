import React, { useState, useEffect } from 'react';
import { foundationApi } from '../../lib/api/foundation';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalPower: number;
  completedPhases: number;
  totalPhases: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await foundationApi.getLeaderboard();
      setLeaderboard(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h3 className="text-2xl font-bold mb-4 text-yellow-400">🏆 Leaderboard</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
        <h3 className="text-2xl font-bold mb-4 text-yellow-400">🏆 Leaderboard</h3>
        <p className="text-red-400">{error}</p>
        <button 
          onClick={loadLeaderboard}
          className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
      <h3 className="text-2xl font-bold mb-4 text-yellow-400">🏆 Top Builders</h3>
      
      {leaderboard.length === 0 ? (
        <p className="text-gray-400">No builders yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div 
              key={entry.userId}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                entry.rank <= 3 
                  ? 'bg-gradient-to-r from-yellow-600/20 to-transparent' 
                  : 'bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl font-bold ${
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-gray-300' :
                  entry.rank === 3 ? 'text-amber-600' :
                  'text-gray-500'
                }`}>
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                </span>
                <div>
                  <p className="font-semibold text-white">
                    {entry.userId.startsWith('user-') ? `Builder ${entry.userId.slice(-8)}` : entry.userId}
                  </p>
                  <p className="text-sm text-gray-400">
                    {entry.completedPhases}/{entry.totalPhases} phases
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-yellow-400">⚡ {entry.totalPower}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button 
        onClick={loadLeaderboard}
        className="mt-4 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
      >
        🔄 Refresh
      </button>
    </div>
  );
}
