'use client';

import React, { useState, useEffect } from 'react';
import { FlashScoreMatchTracker } from '@/app/components/FlashScoreMatchTracker';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { LiveScoreCard } from '@/app/components/LiveScoreCard';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterSport, setFilterSport] = useState<string>('all');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/matches/live');
        if (!response.ok) throw new Error('Failed to fetch matches');
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
        <Breadcrumbs 
          items={[
            { label: "Matches" }
          ]}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Live Matches
          </h1>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Grid
              </span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                List
              </span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
            <p className="text-red-400">Error: {error}</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-8 text-center">
            <p className="text-yellow-400 text-lg mb-2">No live matches at the moment</p>
            <p className="text-gray-400">Check back later for live match updates</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
            {matches.map((match: any) => (
              <LiveScoreCard
                key={match.id || match._id}
                match={{
                  id: match.id || match._id,
                  competition: match.competition || 'Unknown League',
                  homeTeam: {
                    name: match.homeTeam,
                    score: match.score?.home || 0
                  },
                  awayTeam: {
                    name: match.awayTeam,
                    score: match.score?.away || 0
                  },
                  status: match.status || 'scheduled',
                  minute: match.minute,
                  time: match.time || new Date(match.date).toLocaleTimeString(),
                  isFavorite: false,
                  winProbability: match.winProbability
                }}
                showPrediction={true}
              />
            ))}
          </div>
        )}

        <div className="mt-8">
          <FlashScoreMatchTracker />
        </div>
      </div>
    </div>
  );
}