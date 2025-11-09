"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  RefreshCw,
  Filter,
  Clock,
  Flame,
  Activity,
  Circle,
  Share2,
} from "lucide-react";
import { useSmartRetry } from "../../hook/useSmartRetry";
import StatCard from "../../components/StatCard";

interface LiveMatch {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  period: string;
  time: string;
  league: string;
  venue?: string;
}

type SportFilter = "all" | "NFL" | "NBA" | "MLB" | "Soccer";

export default function LiveMatchesPage() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sportFilter, setSportFilter] = useState<SportFilter>("all");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Smart retry hook
  const { executeWithRetry, isRetrying, retryCount } = useSmartRetry({
    maxRetries: 3,
    baseDelay: 1000,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt} for live matches:`, error.message);
    }
  });

  useEffect(() => {
    fetchLiveMatches();
    // Auto-refresh every 15 seconds for live updates
    const interval = setInterval(() => {
      fetchLiveMatches();
    }, 15000);
    return () => clearInterval(interval);
  }, [sportFilter]);

  const fetchLiveMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await executeWithRetry(async () => {
        let endpoint = "/api/matches"; // All sports

        // Fetch specific sport if filtered
        if (sportFilter !== "all") {
          endpoint = `/api/${sportFilter.toLowerCase()}`;
        }

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Live matches response:', data);

        // Extract matches from response
        let matchesData = [];
        if (Array.isArray(data.matches)) {
          matchesData = data.matches;
        } else if (Array.isArray(data)) {
          matchesData = data;
        }

        // Transform to our format
        return matchesData.map((match: any, idx: number) => ({
          id: match.id || `${idx}-${Date.now()}`,
          sport: match.sport || sportFilter || "Unknown",
          homeTeam: match.home_team || match.homeTeam || "TBD",
          awayTeam: match.away_team || match.awayTeam || "TBD",
          homeScore: match.home_score || match.homeScore || 0,
          awayScore: match.away_score || match.awayScore || 0,
          status: match.status || "scheduled",
          period: match.period || match.quarter || match.inning || "Q1",
          time: match.time || match.game_time || "TBD",
          league: match.league || match.competition || data.sport || "Unknown",
          venue: match.venue || match.stadium,
        }));
      });

      setMatches(result);
      setLastUpdate(new Date());
    } catch (err) {
      setError("Failed to load live matches after multiple retries");
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => 
    match.status.toLowerCase().includes('live') || 
    match.status.toLowerCase().includes('in progress') ||
    match.status === 'IN_PLAY'
  );

  const upcomingMatches = matches.filter(match => 
    !match.status.toLowerCase().includes('live') && 
    !match.status.toLowerCase().includes('in progress') &&
    !match.status.toLowerCase().includes('finished') &&
    match.status !== 'IN_PLAY'
  );

  const getSportIcon = (sport: string) => {
    switch(sport.toUpperCase()) {
      case 'NFL': return '🏈';
      case 'NBA': return '🏀';
      case 'MLB': return '⚾';
      case 'SOCCER': return '⚽';
      default: return '🏆';
    }
  };

  const getSportColor = (sport: string) => {
    switch(sport.toUpperCase()) {
      case 'NFL': return 'from-orange-500/20 to-orange-600/10 border-orange-500/30';
      case 'NBA': return 'from-blue-500/20 to-blue-600/10 border-blue-500/30';
      case 'MLB': return 'from-green-500/20 to-green-600/10 border-green-500/30';
      case 'SOCCER': return 'from-purple-500/20 to-purple-600/10 border-purple-500/30';
      default: return 'from-gray-500/20 to-gray-600/10 border-gray-500/30';
    }
  };

  const shareMatch = async (match: LiveMatch) => {
    const shareText = `🔴 LIVE: ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\n${match.period} - ${match.league}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${match.sport} Live Match`,
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Live score copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Flame className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Live Matches</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Real-time scores • Auto-updating
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right text-sm text-gray-400">
              <p>Last update</p>
              <p className="font-mono">{lastUpdate.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={fetchLiveMatches}
              disabled={loading}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors relative"
              title={isRetrying ? `Retrying... (${retryCount}/3)` : "Refresh"}
            >
              <RefreshCw className={`w-6 h-6 text-gray-400 ${loading ? "animate-spin" : ""}`} />
              {isRetrying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Retry Status */}
        {isRetrying && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              <div>
                <p className="text-amber-400 font-semibold">Retrying connection...</p>
                <p className="text-sm text-gray-400">Attempt {retryCount} of 3</p>
              </div>
            </div>
          </div>
        )}

        {/* Sport Filter */}
        <div className="bg-slate-800/50 p-4 rounded-2xl backdrop-blur-sm border border-white/10 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400 font-medium">Sport:</span>
            </div>
            {(['all', 'NFL', 'NBA', 'MLB', 'Soccer'] as SportFilter[]).map((sport) => (
              <button
                key={sport}
                onClick={() => setSportFilter(sport)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  sportFilter === sport
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {sport === 'all' ? '🌐 All Sports' : `${getSportIcon(sport)} ${sport}`}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<Circle className="w-5 h-5 text-red-400 fill-red-400 animate-pulse" />}
            label="Live Now"
            value={filteredMatches.length}
            gradient="from-red-500/20 to-red-600/10 border-red-500/30"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-blue-400" />}
            label="Upcoming"
            value={upcomingMatches.length}
            gradient="from-blue-500/20 to-blue-600/10 border-blue-500/30"
          />
          <StatCard
            icon={<Trophy className="w-5 h-5 text-purple-400" />}
            label="Total Matches"
            value={matches.length}
            gradient="from-purple-500/20 to-purple-600/10 border-purple-500/30"
          />
        </div>

        {/* Live Matches Section */}
        {filteredMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Circle className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              Live Now
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className={`bg-gradient-to-br ${getSportColor(match.sport)} rounded-xl p-6 border`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getSportIcon(match.sport)}</span>
                      <div>
                        <span className="text-xs text-gray-400">{match.league}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse flex items-center gap-1">
                            <Circle className="w-2 h-2 fill-white" />
                            LIVE
                          </span>
                          <span className="text-sm text-gray-300">{match.period}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {match.venue && (
                        <span className="text-xs text-gray-400">{match.venue}</span>
                      )}
                      <button
                        onClick={() => shareMatch(match)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Share live score"
                      >
                        <Share2 className="w-5 h-5 text-gray-400 hover:text-purple-400" />
                      </button>
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="bg-black/20 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      {/* Home Team */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{match.homeTeam}</p>
                      </div>

                      {/* Score */}
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl font-bold text-white">{match.homeScore}</span>
                        <span className="text-2xl text-gray-400">-</span>
                        <span className="text-4xl font-bold text-white">{match.awayScore}</span>
                      </div>

                      {/* Away Team */}
                      <div className="text-left">
                        <p className="text-lg font-bold text-white">{match.awayTeam}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Upcoming Matches
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-slate-800/50 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{getSportIcon(match.sport)}</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">{match.league}</p>
                      <p className="text-sm text-gray-300">{match.time}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">{match.homeTeam}</span>
                      <span className="text-gray-500">vs</span>
                      <span className="text-white font-semibold">{match.awayTeam}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12 bg-red-900/20 rounded-xl border border-red-500/30">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-400 text-lg font-semibold mb-2">{error}</p>
            <button
              onClick={fetchLiveMatches}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && matches.length === 0 && (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-white/5">
            <div className="text-6xl mb-4">🏆</div>
            <p className="text-gray-400 text-lg">No matches available right now</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for live updates</p>
          </div>
        )}

        {/* Loading State */}
        {loading && matches.length === 0 && (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-white/10 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}