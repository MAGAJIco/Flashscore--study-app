'use client';

import React, { useState } from 'react';
import { Search, Star, ChevronRight } from 'lucide-react';
import { BottomNavigation } from '@/app/components/BottomNavigation';

interface Competition {
  id: string;
  name: string;
  country: string;
  flag: string;
  matchCount: number;
  isFavorite: boolean;
  category: 'favorite' | 'other';
}

export default function LeaguesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [competitions, setCompetitions] = useState<Competition[]>([
    // Favorites
    { id: '1', name: 'Copa Libertadores Women', country: 'SOUTH AMERICA', flag: '🌎', matchCount: 2, isFavorite: true, category: 'favorite' },
    { id: '2', name: 'World Cup U20', country: 'WORLD', flag: '🌍', matchCount: 2, isFavorite: true, category: 'favorite' },

    // Africa
    { id: '3', name: 'World Cup', country: 'AFRICA', flag: '🇦🇴', matchCount: 7, isFavorite: false, category: 'other' },

    // Andorra
    { id: '4', name: 'Primera Divisió', country: 'ANDORRA', flag: '🇦🇩', matchCount: 1, isFavorite: false, category: 'other' },

    // Argentina
    { id: '5', name: 'Torneo Betano', country: 'ARGENTINA', flag: '🇦🇷', matchCount: 6, isFavorite: false, category: 'other' },
    { id: '6', name: 'Primera Nacional', country: 'ARGENTINA', flag: '🇦🇷', matchCount: 5, isFavorite: false, category: 'other' },
    { id: '7', name: 'Torneo Federal', country: 'ARGENTINA', flag: '🇦🇷', matchCount: 9, isFavorite: false, category: 'other' },
    { id: '8', name: 'Primera B', country: 'ARGENTINA', flag: '🇦🇷', matchCount: 4, isFavorite: false, category: 'other' },
    { id: '9', name: 'Primera C', country: 'ARGENTINA', flag: '🇦🇷', matchCount: 1, isFavorite: false, category: 'other' },

    // Belarus
    { id: '10', name: 'Vysshaya Liga Women', country: 'BELARUS', flag: '🇧🇾', matchCount: 2, isFavorite: false, category: 'other' },

    // Belgium
    { id: '11', name: 'National Division 1 - ACFF', country: 'BELGIUM', flag: '🇧🇪', matchCount: 3, isFavorite: false, category: 'other' },
    { id: '12', name: 'National Division 1 - VV', country: 'BELGIUM', flag: '🇧🇪', matchCount: 2, isFavorite: false, category: 'other' },

    // Benin
    { id: '13', name: 'Ligue 1', country: 'BENIN', flag: '🇧🇯', matchCount: 4, isFavorite: false, category: 'other' },
  ]);

  const toggleFavorite = (competitionId: string) => {
    setCompetitions(prev =>
      prev.map(comp =>
        comp.id === competitionId 
          ? { ...comp, isFavorite: !comp.isFavorite, category: !comp.isFavorite ? 'favorite' : 'other' }
          : comp
      )
    );
  };

  const filteredCompetitions = competitions.filter(comp =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comp.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteCompetitions = filteredCompetitions.filter(c => c.category === 'favorite');
  const otherCompetitions = filteredCompetitions.filter(c => c.category === 'other');

  // Group other competitions by country
  const competitionsByCountry = otherCompetitions.reduce((acc, comp) => {
    if (!acc[comp.country]) {
      acc[comp.country] = [];
    }
    acc[comp.country].push(comp);
    return acc;
  }, {} as Record<string, Competition[]>);

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
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Leagues & Competitions
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        {/* Favorite Competitions */}
        {favoriteCompetitions.length > 0 && (
          <div className="mb-4">
            <div 
              className="px-4 py-2"
              style={{ 
                backgroundColor: '#FEF3C7',
                borderBottom: '1px solid #FDE68A'
              }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#92400E' }}>
                Favorite Competitions
              </h3>
            </div>

            {favoriteCompetitions.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center justify-between px-4 py-3 border-b transition-colors"
                style={{ borderColor: 'var(--border-color)', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl">{comp.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {comp.country}
                    </p>
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {comp.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {comp.matchCount}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(comp.id);
                    }}
                    className="p-1"
                    aria-label="Remove from favorites"
                  >
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Other Competitions by Country */}
        <div 
          className="px-4 py-2 sticky top-[140px] z-20"
          style={{ 
            backgroundColor: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Other Competitions [A-Z]
          </h3>
        </div>

        {Object.entries(competitionsByCountry).map(([country, comps]) => (
          <div key={country}>
            {comps.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center justify-between px-4 py-3 border-b transition-colors"
                style={{ borderColor: 'var(--border-color)', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl">{comp.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {comp.country}
                    </p>
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {comp.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {comp.matchCount}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(comp.id);
                    }}
                    className="p-1"
                    aria-label="Add to favorites"
                  >
                    <Star className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <BottomNavigation />
    </div>
  );
}

