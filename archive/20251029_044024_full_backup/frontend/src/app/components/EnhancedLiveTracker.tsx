'use client';

import React, { useState, useEffect } from 'react';
import { Circle, TrendingUp, Activity, Timer } from 'lucide-react';

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  score: { home: number; away: number };
  minute: string;
  status: 'live' | 'halftime' | 'finished';
  competition: string;
  probability: { home: number; draw: number; away: number };
}

export const EnhancedLiveTracker: React.FC = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMatches = async () => {
    try {
      const response = await fetch('/api/matches/live');
      const data = await response.json();

      if (data.success) {
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Error fetching live matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'text-green-400';
      case 'halftime': return 'text-amber-400';
      case 'finished': return 'text-gray-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Circle className="w-8 h-8 text-green-400 fill-green-400 animate-pulse" />
            <div>
              <h1 className="text-3xl font-bold text-white">Live Matches</h1>
              <p className="text-green-300">{matches.length} matches in progress</p>
            </div>
          </div>
          <button
            onClick={fetchLiveMatches}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border-2 border-green-500/30 hover:border-green-400 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Circle className={`w-3 h-3 ${getStatusColor(match.status)} ${match.status === 'live' ? 'animate-pulse' : ''}`} />
                    <span className="text-xs font-semibold text-gray-300 uppercase">
                      {match.competition}
                    </span>
                  </div>
                  {match.status === 'live' && (
                    <div className="flex items-center gap-2 text-green-400">
                      <Timer className="w-4 h-4" />
                      <span className="font-bold">{match.minute}'</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 items-center gap-4 mb-4">
                  <div className="text-right">
                    <p className="text-white font-bold text-lg">{match.homeTeam}</p>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-4xl font-bold text-white">{match.score.home}</span>
                    <span className="text-2xl text-gray-400">-</span>
                    <span className="text-4xl font-bold text-white">{match.score.away}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-lg">{match.awayTeam}</p>
                  </div>
                </div>

                {/* Win Probability */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Activity className="w-4 h-4" />
                    <span>Live Win Probability</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400">Home</p>
                      <p className="text-lg font-bold text-green-400">{match.probability.home}%</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400">Draw</p>
                      <p className="text-lg font-bold text-amber-400">{match.probability.draw}%</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-gray-400">Away</p>
                      <p className="text-lg font-bold text-blue-400">{match.probability.away}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className="text-center py-12 bg-white/5 backdrop-blur-xl rounded-2xl">
            <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No live matches at the moment</p>
            <p className="text-sm text-gray-500">Check back later for live updates</p>
          </div>
        )}
      </div>
    </div>
  );
};