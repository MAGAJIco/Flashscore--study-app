"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Prediction {
  homeTeam: string;
  awayTeam: string;
  matchTime: string;
  prediction: string;
  confidence: number;
  odds?: number;
  league?: string;
  sport?: string;
}

interface FilteredMatch {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  gameTime: string;
  status: string;
  homeScore?: number;
  awayScore?: number;
}

export default function FilteredPredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [matches, setMatches] = useState<FilteredMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [sport, setSport] = useState('all');
  const [minConfidence, setMinConfidence] = useState(75);
  const [viewMode, setViewMode] = useState<'predictions' | 'matches'>('predictions');
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/predictions/sports/filtered?sport=${sport}&min_confidence=${minConfidence}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }
      
      const result = await response.json();
      if (result.success) {
        setPredictions(result.data.predictions || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching predictions');
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async (sportType: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      let endpoint = '/api/predictions/matches';
      
      if (sportType !== 'all') {
        endpoint = `/api/predictions/${sportType.toLowerCase()}`;
      }
      
      const response = await fetch(`${apiUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sportType} matches`);
      }
      
      const result = await response.json();
      if (result.success) {
        setMatches(result.data.matches || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching matches');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'predictions') {
      fetchPredictions();
    } else {
      fetchMatches(sport);
    }
  }, [sport, minConfidence, viewMode]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
    if (confidence >= 75) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
    return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
  };

  const getSportIcon = (sportName: string) => {
    const icons: Record<string, string> = {
      'NFL': '🏈',
      'NBA': '🏀',
      'MLB': '⚾',
      'Soccer': '⚽',
      'all': '🎯'
    };
    return icons[sportName] || '🎮';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                🎯 AI-Powered Predictions
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Smart predictions filtered by confidence and sport
              </p>
            </div>
            <Link
              href="/en"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              ← Back to Home
            </Link>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setViewMode('predictions')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === 'predictions'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              🔮 Predictions
            </button>
            <button
              onClick={() => setViewMode('matches')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                viewMode === 'matches'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              📊 Live Matches
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sport Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Sport
              </label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 outline-none transition-colors"
              >
                <option value="all">🎯 All Sports</option>
                <option value="Soccer">⚽ Soccer</option>
                <option value="NFL">🏈 NFL</option>
                <option value="NBA">🏀 NBA</option>
                <option value="MLB">⚾ MLB</option>
              </select>
            </div>

            {/* Confidence Filter (only for predictions) */}
            {viewMode === 'predictions' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Min Confidence: {minConfidence}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={() => viewMode === 'predictions' ? fetchPredictions() : fetchMatches(sport)}
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-400">⚠️ {error}</p>
          </div>
        )}

        {/* Results */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300 font-semibold">Loading {viewMode}...</p>
            </div>
          ) : viewMode === 'predictions' ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📋 Filtered Predictions ({predictions.length})
              </h2>
              
              {predictions.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-xl font-semibold">No predictions found</p>
                  <p className="mt-2">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predictions.map((pred, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{getSportIcon(pred.sport || 'Soccer')}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(pred.confidence)}`}>
                          {pred.confidence}%
                        </span>
                      </div>
                      
                      <div className="text-center mb-3">
                        <div className="font-bold text-gray-900 dark:text-white text-lg">{pred.homeTeam}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-sm my-1">vs</div>
                        <div className="font-bold text-gray-900 dark:text-white text-lg">{pred.awayTeam}</div>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prediction:</div>
                        <div className="font-bold text-purple-600 dark:text-purple-400">{pred.prediction}</div>
                      </div>
                      
                      {pred.odds && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Odds: <span className="font-semibold">{pred.odds}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        ⏰ {pred.matchTime}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                🏆 Live Matches ({matches.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl">{getSportIcon(match.sport)}</span>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                          {match.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 dark:text-white">{match.homeTeam}</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mx-4">
                          {match.homeScore ?? '-'}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 dark:text-white">{match.awayTeam}</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white mx-4">
                          {match.awayScore ?? '-'}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                        ⏰ {new Date(match.gameTime).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">💡</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                How Predictions Work
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">🤖</span>
                  <span>AI analyzes historical data, team stats, and current form</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">📊</span>
                  <span>Confidence scores show prediction reliability (higher is better)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">⚡</span>
                  <span>Live matches show real-time scores from ESPN and other sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 font-bold">🎯</span>
                  <span>Filter by sport and confidence to find the best predictions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
