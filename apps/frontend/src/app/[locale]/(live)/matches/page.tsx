
'use client';

import React, { useState, useEffect } from 'react';
import { FlashScoreMatchTracker } from '@/app/components/FlashScoreMatchTracker';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { LiveScoreCard } from '@/app/components/LiveScoreCard';
import { SwipeNavigationWrapper } from '@/app/components/SwipeNavigationWrapper';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    <SwipeNavigationWrapper routes={{ left: '/predictions', right: '/live' }}>
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-20">
        <Breadcrumbs items={[{ label: "Live" }, { label: "Matches" }]} />

        <div className="flex justify-between items-center gap-4 mt-6 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
              }`}
            >
              List
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
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'flex flex-col gap-4'}>
            {matches.map((match: any) => (
              <LiveScoreCard
                key={match.id || match._id}
                match={{
                  id: match.id || match._id,
                  competition: match.competition || 'Unknown League',
                  homeTeam: { name: match.homeTeam, score: match.score?.home || 0 },
                  awayTeam: { name: match.awayTeam, score: match.score?.away || 0 },
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
    </SwipeNavigationWrapper>
  );
}
"use client";

import React from 'react';
import { LiveMatchTracker } from '../components/LiveMatchTracker';

export default function LiveMatchesPage() {
  return (
    <div className="live-matches-page">
      <LiveMatchTracker />
    </div>
  );
}
