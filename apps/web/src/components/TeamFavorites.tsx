
"use client";

import React, { useState, useEffect } from 'react';

interface TeamFavoritesProps {
  userId: string;
}

export function TeamFavorites({ userId }: TeamFavoritesProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(`favorites_${userId}`);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (favorites.length === 0) return;
      
      try {
        const response = await fetch('/api/matches/live');
        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const relevantMatches = data.data.filter((match: any) =>
            favorites.some(fav => 
              match.homeTeam?.toLowerCase().includes(fav.toLowerCase()) ||
              match.awayTeam?.toLowerCase().includes(fav.toLowerCase())
            )
          );
          setMatches(relevantMatches);
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      }
    };

    fetchMatches();
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, [favorites]);

  const addFavorite = () => {
    if (newTeam.trim() && !favorites.includes(newTeam.trim())) {
      const updated = [...favorites, newTeam.trim()];
      setFavorites(updated);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updated));
      setNewTeam('');
    }
  };

  const removeFavorite = (team: string) => {
    const updated = favorites.filter(f => f !== team);
    setFavorites(updated);
    localStorage.setItem(`favorites_${userId}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 animate-pulse">
        <div className="h-6 bg-green-200 dark:bg-green-700 rounded w-40 mb-4"></div>
        <div className="h-10 bg-green-200 dark:bg-green-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
      <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
        ⭐ Favorite Teams
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addFavorite()}
          placeholder="Add a team..."
          className="flex-1 px-4 py-2 rounded-lg border border-green-300 dark:border-green-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={addFavorite}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
      
      {favorites.length === 0 ? (
        <p className="text-sm text-green-600 dark:text-green-400 text-center py-4">
          No favorite teams yet. Add one to get match notifications! 🔔
        </p>
      ) : (
        <div className="space-y-2">
          {favorites.map((team, index) => (
            <div key={index} className="flex items-center justify-between bg-white/50 dark:bg-black/20 rounded-lg p-3">
              <span className="font-semibold text-green-900 dark:text-green-100">{team}</span>
              <button
                onClick={() => removeFavorite(team)}
                className="text-red-500 hover:text-red-700 text-sm font-bold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      
      {matches.length > 0 && (
        <div className="mt-4 pt-4 border-t border-green-300 dark:border-green-600">
          <h4 className="text-sm font-bold text-green-900 dark:text-green-100 mb-2">
            🔔 Upcoming Matches
          </h4>
          <div className="space-y-2">
            {matches.slice(0, 3).map((match, idx) => (
              <div key={idx} className="text-sm bg-green-100 dark:bg-green-800/30 rounded-lg p-2">
                <div className="font-semibold text-green-900 dark:text-green-100">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">
                  {new Date(match.date).toLocaleDateString()} - {match.competition}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
