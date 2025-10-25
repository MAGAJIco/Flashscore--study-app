'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Circle } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'active' | 'halftime' | 'completed' | 'upcoming';
  league: string;
  timestamp: string;
}

const sampleMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Barcelona',
    awayTeam: 'Real Madrid',
    homeScore: 2,
    awayScore: 1,
    minute: 67,
    status: 'active',
    league: 'La Liga',
    timestamp: '18:00'
  },
  {
    id: '2',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeScore: 1,
    awayScore: 1,
    minute: 45,
    status: 'halftime',
    league: 'Premier League',
    timestamp: '17:30'
  },
  {
    id: '3',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Dortmund',
    homeScore: 3,
    awayScore: 2,
    minute: 90,
    status: 'completed',
    league: 'Bundesliga',
    timestamp: '15:00'
  },
  {
    id: '4',
    homeTeam: 'PSG',
    awayTeam: 'Monaco',
    homeScore: 0,
    awayScore: 0,
    minute: 0,
    status: 'upcoming',
    league: 'Ligue 1',
    timestamp: '20:45'
  }
];

export function FlashScoreMatchTracker() {
  const [matches, setMatches] = useState<Match[]>(sampleMatches);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prevMatches =>
        prevMatches.map(match => {
          if (match.status === 'active' && match.minute < 90) {
            return { ...match, minute: match.minute + 1 };
          }
          return match;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'halftime':
        return 'bg-amber-500';
      case 'completed':
        return 'bg-gray-400';
      case 'upcoming':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIndicator = (match: Match) => {
    if (match.status === 'active') {
      return (
        <div className="flex items-center gap-2">
          <Circle className="w-4 h-4 fill-emerald-500 text-emerald-500 animate-pulse" />
          <div className="flex gap-0.5">
            {Array.from({ length: Math.min(3, Math.floor(match.minute / 30)) }).map((_, i) => (
              <div key={i} className="w-1.5 h-4 bg-emerald-500 rounded-full" />
            ))}
          </div>
        </div>
      );
    }
    if (match.status === 'halftime') {
      return (
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
          <div className="flex gap-0.5">
            <div className="w-1.5 h-3 bg-amber-500 rounded-full" />
            <div className="w-1.5 h-3 bg-amber-300 rounded-full" />
          </div>
        </div>
      );
    }
    if (match.status === 'completed') {
      return (
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <div className="w-3 h-3 bg-gray-400 rounded-sm" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-blue-400" />
        <div className="flex gap-px">
          <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                <circle cx="12" cy="12" r="1.5" fill="white" opacity="0.5"/>
                <circle cx="8" cy="8" r="1" fill="white" opacity="0.7"/>
                <circle cx="16" cy="8" r="1" fill="white" opacity="0.7"/>
                <circle cx="8" cy="16" r="1" fill="white" opacity="0.7"/>
                <circle cx="16" cy="16" r="1" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">Match Center</h1>
              <p className="text-xs md:text-sm text-gray-500">Live • Today's Matches</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex md:hidden">
              <LanguageSwitcher />
            </div>
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />
              <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                <Circle className="w-4 h-4 fill-emerald-500 text-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-emerald-700">LIVE</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
              match.status === 'active' ? 'ring-2 ring-emerald-400' : ''
            }`}
          >
            <div className="p-4">
              {/* League & Status Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👟</span>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    {match.league}
                  </span>
                </div>
                {getStatusIndicator(match)}
              </div>

              {/* Match Details */}
              <div className="space-y-2">
                {/* Home Team */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-lg ${getStatusColor(match.status)} bg-opacity-20 flex items-center justify-center`}>
                      <span className="text-xs font-bold text-gray-700">H</span>
                    </div>
                    <span className="font-semibold text-gray-800">{match.homeTeam}</span>
                  </div>
                  <div className={`text-2xl font-bold ${
                    match.status === 'active' ? 'text-emerald-600' : 'text-gray-700'
                  }`}>
                    {match.status !== 'upcoming' ? match.homeScore : '-'}
                  </div>
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 rounded-lg ${getStatusColor(match.status)} bg-opacity-20 flex items-center justify-center`}>
                      <span className="text-xs font-bold text-gray-700">A</span>
                    </div>
                    <span className="font-semibold text-gray-800">{match.awayTeam}</span>
                  </div>
                  <div className={`text-2xl font-bold ${
                    match.status === 'active' ? 'text-emerald-600' : 'text-gray-700'
                  }`}>
                    {match.status !== 'upcoming' ? match.awayScore : '-'}
                  </div>
                </div>
              </div>

              {/* Progress Bar for Active Matches */}
              {match.status === 'active' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(match.minute / 90) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Legend */}
      <div className="mt-6 bg-white rounded-xl shadow-md p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center gap-2 p-3 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-1">
              <Circle className="w-4 h-4 fill-emerald-500 text-emerald-500 animate-pulse" />
              <div className="flex gap-0.5">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div className="w-full h-1 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="flex gap-0.5">
                <div className="w-1.5 h-3 bg-amber-500 rounded-full" />
                <div className="w-1.5 h-3 bg-amber-300 rounded-full" />
              </div>
            </div>
            <div className="w-1/2 h-1 bg-amber-500 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <div className="w-3 h-3 bg-gray-400 rounded-sm" />
            </div>
            <div className="w-full h-1 bg-gray-400 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-400" />
              <div className="flex gap-px">
                <div className="w-1 h-3 bg-blue-400 rounded-full" />
                <div className="w-1 h-3 bg-blue-400 rounded-full" />
                <div className="w-1 h-3 bg-blue-400 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
