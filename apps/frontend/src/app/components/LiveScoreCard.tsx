'use client';

import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TeamScore {
  name: string;
  logo?: string;
  score: number;
  flag?: string;
}

interface LiveMatch {
  id: string;
  competition: string;
  competitionLogo?: string;
  homeTeam: TeamScore;
  awayTeam: TeamScore;
  minute?: string;
  status: 'live' | 'upcoming' | 'finished';
  time?: string;
  isFavorite: boolean;
  winProbability?: {
    home: number;
    draw: number;
    away: number;
  };
}

interface LiveScoreCardProps {
  match: LiveMatch;
  onToggleFavorite?: (matchId: string) => void;
  showPrediction?: boolean;
}

export default function LiveScoreCard({ match, onToggleFavorite, showPrediction = false }: LiveScoreCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (match.status === 'live') {
      const interval = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [match.status]);

  const getStatusColor = () => {
    if (match.status === 'live') return '#EF4444';
    if (match.status === 'finished') return 'var(--text-muted)';
    return 'var(--text-secondary)';
  };

  return (
    <Link href={`/match/${match.id}`}>
      <div 
        className="rounded-lg transition-all duration-200 overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Competition Header */}
        <div 
          className="flex items-center justify-between px-3 py-2 border-b"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-2">
            {match.competitionLogo && (
              <img src={match.competitionLogo} alt="" className="w-4 h-4 object-contain" />
            )}
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              {match.competition}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite?.(match.id);
            }}
            className="p-1 transition-colors"
            aria-label={match.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 ${match.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
            />
          </button>
        </div>

        {/* Match Info */}
        <div className="p-3">
          {/* Home Team */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {match.homeTeam.flag && (
                <span className="text-lg">{match.homeTeam.flag}</span>
              )}
              <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {match.homeTeam.name}
              </span>
            </div>
            <span 
              className={`text-xl font-bold ml-2 ${isAnimating && match.status === 'live' ? 'scale-110' : ''}`}
              style={{ 
                color: match.status === 'live' ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'transform 0.3s ease'
              }}
            >
              {match.homeTeam.score}
            </span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {match.awayTeam.flag && (
                <span className="text-lg">{match.awayTeam.flag}</span>
              )}
              <span className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                {match.awayTeam.name}
              </span>
            </div>
            <span 
              className={`text-xl font-bold ml-2 ${isAnimating && match.status === 'live' ? 'scale-110' : ''}`}
              style={{ 
                color: match.status === 'live' ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'transform 0.3s ease'
              }}
            >
              {match.awayTeam.score}
            </span>
          </div>

          {/* Status/Time */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2">
              {match.status === 'live' && match.minute && (
                <>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm font-bold" style={{ color: getStatusColor() }}>
                      {match.minute}'
                    </span>
                  </div>
                </>
              )}
              {match.status === 'upcoming' && match.time && (
                <span className="text-sm font-medium" style={{ color: getStatusColor() }}>
                  {match.time}
                </span>
              )}
              {match.status === 'finished' && (
                <span className="text-sm font-medium" style={{ color: getStatusColor() }}>
                  FT
                </span>
              )}
            </div>

            {showPrediction && match.winProbability && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" style={{ color: 'var(--accent-color)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--accent-color)' }}>
                  AI: {Math.max(match.winProbability.home, match.winProbability.draw, match.winProbability.away)}%
                </span>
              </div>
            )}

            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </div>
    </Link>
  );
}
