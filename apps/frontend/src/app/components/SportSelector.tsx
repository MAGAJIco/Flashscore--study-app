'use client';

import React, { useState, useEffect } from 'react';
import { 
  CircleDot, Star, TrendingUp, ChevronRight, Search,
  Dumbbell, 
  Bike,
  Trophy,
  Target
} from 'lucide-react';
import Link from 'next/link';

interface Sport {
  id: string;
  name: string;
  icon: string;
  liveCount: number;
  totalCount: number;
  isFavorite: boolean;
  category: 'popular' | 'other';
}

// Using emoji icons for better visual recognition
// Can be replaced with custom icon components later

export default function SportSelector() {
  const [sports, setSports] = useState<Sport[]>([
    { id: 'football', name: 'Football', icon: '⚽', liveCount: 121, totalCount: 1107, isFavorite: true, category: 'popular' },
    { id: 'tennis', name: 'Tennis', icon: '🎾', liveCount: 149, totalCount: 456, isFavorite: true, category: 'popular' },
    { id: 'basketball', name: 'Basketball', icon: '🏀', liveCount: 45, totalCount: 289, isFavorite: true, category: 'popular' },
    { id: 'hockey', name: 'Hockey', icon: '🏒', liveCount: 44, totalCount: 167, isFavorite: true, category: 'popular' },
    { id: 'baseball', name: 'Baseball', icon: '⚾', liveCount: 4, totalCount: 89, isFavorite: true, category: 'popular' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐', liveCount: 7, totalCount: 134, isFavorite: true, category: 'popular' },
    { id: 'golf', name: 'Golf', icon: '⛳', liveCount: 0, totalCount: 23, isFavorite: true, category: 'popular' },
    { id: 'darts', name: 'Darts', icon: '🎯', liveCount: 15, totalCount: 45, isFavorite: true, category: 'popular' },
    { id: 'snooker', name: 'Snooker', icon: '🎱', liveCount: 1, totalCount: 12, isFavorite: true, category: 'popular' },
    { id: 'tabletennis', name: 'Table tennis', icon: '🏓', liveCount: 32, totalCount: 98, isFavorite: true, category: 'popular' },
    { id: 'esports', name: 'eSports', icon: '🎮', liveCount: 2, totalCount: 34, isFavorite: false, category: 'other' },
    { id: 'handball', name: 'Handball', icon: '🤾', liveCount: 20, totalCount: 76, isFavorite: false, category: 'other' },
    { id: 'futsal', name: 'Futsal', icon: '⚽', liveCount: 4, totalCount: 23, isFavorite: false, category: 'other' },
    { id: 'cricket', name: 'Cricket', icon: '🏏', liveCount: 0, totalCount: 12, isFavorite: false, category: 'other' },
    { id: 'cycling', name: 'Cycling', icon: '🚴', liveCount: 0, totalCount: 8, isFavorite: false, category: 'other' },
    { id: 'mma', name: 'MMA', icon: '🥊', liveCount: 0, totalCount: 5, isFavorite: false, category: 'other' },
    { id: 'motorsport', name: 'Motorsport', icon: '🏎️', liveCount: 0, totalCount: 15, isFavorite: false, category: 'other' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const toggleFavorite = (sportId: string) => {
    setSports(prevSports =>
      prevSports.map(sport =>
        sport.id === sportId ? { ...sport, isFavorite: !sport.isFavorite } : sport
      )
    );
  };

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularSports = filteredSports.filter(s => s.category === 'popular');
  const otherSports = filteredSports.filter(s => s.category === 'other');

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4" style={{ 
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Select sport
        </h2>
        <button className="p-2" aria-label="Sort">
          <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search sports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* Popular Sports */}
      <div style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 py-2" style={{ 
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Popular Sports
          </h3>
        </div>

        {popularSports.map((sport) => (
          <Link href={`/sports/${sport.id}`} key={sport.id}>
            <div className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-opacity-50"
              style={{
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{sport.icon}</span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {sport.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {sport.liveCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-red-500">
                      {sport.liveCount}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {sport.totalCount}
                    </span>
                  </div>
                )}
                {sport.liveCount === 0 && (
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {sport.totalCount}
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(sport.id);
                  }}
                  className="p-1 transition-colors"
                  aria-label={sport.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    className={`w-5 h-5 ${sport.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Other Sports */}
      {otherSports.length > 0 && (
        <div className="mt-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="px-4 py-2" style={{ 
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Other Sports [A-Z]
            </h3>
          </div>

          {(showAll ? otherSports : otherSports.slice(0, 5)).map((sport) => (
            <Link href={`/sports/${sport.id}`} key={sport.id}>
              <div className="flex items-center justify-between px-4 py-3 transition-colors"
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{sport.icon}</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {sport.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {sport.liveCount > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-red-500">
                      {sport.liveCount}
                    </span>
                  )}
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {sport.totalCount}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(sport.id);
                    }}
                    className="p-1 transition-colors"
                    aria-label={sport.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star
                      className={`w-5 h-5 ${sport.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                    />
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {otherSports.length > 5 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full px-4 py-3 text-left font-medium transition-colors"
              style={{ 
                color: 'var(--accent-color)',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              {showAll ? 'Show less' : `Show ${otherSports.length - 5} more sports`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
