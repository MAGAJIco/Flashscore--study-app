"use client";

import React, { useState, useEffect } from 'react';
import { liveDataApi, LiveMatch } from '@/lib/api/liveData';
import { RefreshCw, Activity } from 'lucide-react';

export default function LivePage() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveMatches();
    const interval = setInterval(fetchLiveMatches, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const matches = await liveDataApi.fetchLiveMatches();
      setLiveMatches(matches);
    } catch (err) {
      console.error('Failed to fetch live matches:', err);
      setError('Failed to load live matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Activity className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Live Matches</h1>
              <p className="text-gray-400 mt-1">Real-time scores and updates</p>
            </div>
          </div>
          <button
            onClick={fetchLiveMatches}
            disabled={loading}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh matches"
          >
            <RefreshCw className={`w-6 h-6 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {loading && liveMatches.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-white/10 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : liveMatches.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveMatches.map((match) => (
              <div
                key={match.id}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-red-500/50 transition-all hover:scale-[1.02] shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{match.icon}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-red-400 uppercase">LIVE</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{match.time}</span>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-1">{match.title}</h3>
                  <p className="text-sm text-gray-400">{match.description}</p>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-400 mb-1">{match.homeTeam}</p>
                    <p className="text-3xl font-bold text-white">
                      {match.score.split('-')[0]}
                    </p>
                  </div>
                  <div className="px-4 text-2xl font-bold text-gray-500">-</div>
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-400 mb-1">{match.awayTeam}</p>
                    <p className="text-3xl font-bold text-white">
                      {match.score.split('-')[1]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-gray-500">{match.league}</span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <span className="text-xs">👁️</span>
                    <span className="text-xs">{match.watching}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-white text-center">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-xl text-gray-300 mb-2">No live matches at the moment</p>
            <p className="text-sm text-gray-400">Check back soon for live match coverage</p>
          </div>
        )}
      </div>
    </div>
  );
}
