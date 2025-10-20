'use client';

import React, { useState, useEffect } from 'react';
import { Circle, Filter, TrendingUp } from 'lucide-react';
import LiveScoreCard from '../components/LiveScoreCard';
import BottomNavigation from '../components/BottomNavigation';
import DateSelector from '../components/DateSelector';

export default function LivePage() {
  const [liveMatches, setLiveMatches] = useState([
    {
      id: '1',
      competition: 'WE LEAGUE WOMEN - JAPAN',
      homeTeam: { name: 'Inac Kobe Leonesa W', score: 2, flag: '🇯🇵' },
      awayTeam: { name: 'Mynavi Sendai W', score: 0, flag: '🇯🇵' },
      minute: '81',
      status: 'live' as const,
      isFavorite: false,
      winProbability: { home: 85, draw: 10, away: 5 }
    },
    {
      id: '2',
      competition: 'NPFL - NIGERIA',
      homeTeam: { name: 'Rivers United', score: 0, flag: '🇳🇬' },
      awayTeam: { name: 'Bayelsa United', score: 0, flag: '🇳🇬' },
      minute: '27',
      status: 'live' as const,
      isFavorite: false,
      winProbability: { home: 45, draw: 30, away: 25 }
    },
  ]);

  const handleToggleFavorite = (matchId: string) => {
    setLiveMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, isFavorite: !match.isFavorite }
          : match
      )
    );
  };

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg-primary)', paddingTop: '60px' }}>
      {/* Header */}
      <div 
        className="fixed top-0 left-0 right-0 z-30 border-b"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Circle className="w-6 h-6 text-red-500 fill-red-500 animate-pulse" />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                LIVE
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {liveMatches.length} matches in progress
              </p>
            </div>
          </div>
          <button 
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)'
            }}
            aria-label="Filter"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <DateSelector />
      </div>

      {/* Live Matches */}
      <div className="px-4 pt-4">
        {liveMatches.length > 0 ? (
          <div className="space-y-3">
            {liveMatches.map((match) => (
              <LiveScoreCard 
                key={match.id} 
                match={match} 
                onToggleFavorite={handleToggleFavorite}
                showPrediction
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Circle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No live matches
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Check back later for live scores and real-time updates
            </p>
          </div>
        )}

        {/* AI Insights Banner */}
        {liveMatches.length > 0 && (
          <div 
            className="mt-6 p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--accent-color)'
            }}
          >
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 mt-0.5" style={{ color: 'var(--accent-color)' }} />
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  AI-Powered Insights
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Our ML model analyzes live match data to provide real-time win probability predictions.
                  Tap any match to see detailed analytics and insights.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}