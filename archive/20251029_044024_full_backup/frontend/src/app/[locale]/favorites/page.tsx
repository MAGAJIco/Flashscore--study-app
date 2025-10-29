'use client';

import React, { useState } from 'react';
import { Plus, Star, Trophy, User, Newspaper } from 'lucide-react';
import { LiveScoreCard } from '@/app/components/LiveScoreCard';
import { BottomNavigation } from '@/app/components/BottomNavigation';
import UserFavorites from '@/app/components/UserFavorites';

type FavTab = 'games' | 'teams' | 'players' | 'news';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<FavTab>('games');
  const [filter, setFilter] = useState<'all' | 'live'>('all');

  // Demo data
  const favoriteMatches = [
    {
      id: '1',
      competition: 'AFRICA: WORLD CUP - QUALIFICATION',
      homeTeam: { name: 'Nigeria', score: 0, flag: '🇳🇬' },
      awayTeam: { name: 'Benin', score: 0, flag: '🇧🇯' },
      time: '17:00',
      status: 'upcoming' as const,
      isFavorite: true
    },
    {
      id: '2',
      competition: 'FRANCE: LIGUE 1',
      homeTeam: { name: 'PSG', score: 0, flag: '🇫🇷' },
      awayTeam: { name: 'Strasbourg', score: 0, flag: '🇫🇷' },
      time: '19:45',
      status: 'upcoming' as const,
      isFavorite: true
    },
    {
      id: '3',
      competition: 'ITALY: SERIE A',
      homeTeam: { name: 'AS Roma', score: 0, flag: '🇮🇹' },
      awayTeam: { name: 'Inter', score: 0, flag: '🇮🇹' },
      time: '19:45',
      status: 'upcoming' as const,
      isFavorite: true
    }
  ];

  const tabs: Array<{ id: FavTab; label: string; icon: React.ReactNode }> = [
    { id: 'games', label: 'GAMES', icon: <Trophy className="w-4 h-4" /> },
    { id: 'teams', label: 'TEAMS', icon: <Star className="w-4 h-4" /> },
    { id: 'players', label: 'PLAYERS', icon: <User className="w-4 h-4" /> },
    { id: 'news', label: 'NEWS', icon: <Newspaper className="w-4 h-4" /> }
  ];

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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Favorites
          </h1>
          <button 
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--accent-color)',
              color: 'white'
            }}
            aria-label="Add favorite"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'var(--border-color)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors relative"
              style={{
                color: activeTab === tab.id ? 'var(--accent-color)' : 'var(--text-secondary)'
              }}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ backgroundColor: 'var(--accent-color)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {activeTab === 'games' && (
          <>
            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilter('all')}
                className="px-4 py-2 rounded-full text-sm font-bold transition-colors"
                style={{
                  backgroundColor: filter === 'all' ? '#EC4899' : 'var(--bg-secondary)',
                  color: filter === 'all' ? 'white' : 'var(--text-secondary)',
                  border: filter === 'all' ? 'none' : '1px solid var(--border-color)'
                }}
              >
                ALL GAMES
              </button>
              <button
                onClick={() => setFilter('live')}
                className="px-4 py-2 rounded-full text-sm font-bold transition-colors"
                style={{
                  backgroundColor: filter === 'live' ? '#EC4899' : 'var(--bg-secondary)',
                  color: filter === 'live' ? 'white' : 'var(--text-secondary)',
                  border: filter === 'live' ? 'none' : '1px solid var(--border-color)'
                }}
              >
                LIVE
              </button>
              <button 
                className="ml-auto p-2"
                aria-label="Filter settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
            </div>

            {/* Matches by Date */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Tomorrow 14.10.
                </h2>
                <div className="space-y-3">
                  {favoriteMatches.map((match) => (
                    <LiveScoreCard key={match.id} match={match} showPrediction />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'teams' && (
          <div className="text-center py-12">
            <Star className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No favorite teams yet
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Follow your favorite teams to see their matches here
            </p>
          </div>
        )}

        {activeTab === 'players' && (
          <div className="text-center py-12">
            <User className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No favorite players yet
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Follow players to track their performance and stats
            </p>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              No saved news yet
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Save articles to read them later
            </p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

