'use client';

import React, { useState, useEffect } from 'react';
import { FlashScoreMatchTracker } from '@/app/components/FlashScoreMatchTracker';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { LiveScoreCard } from '@/app/components/LiveScoreCard';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        <h1 className="text-3xl font-bold mt-6 mb-6" style={{ color: 'var(--text-primary)' }}>
          Live Matches
        </h1>

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
          <div className="grid gap-4">
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