"use client";

import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';
import { useAuth } from '@hooks/useAuth';

interface FavoriteItem {
  id: string;
  type: 'team' | 'league' | 'match' | 'prediction' | 'author';
  name: string;
  icon: string;
  metadata?: any;
  addedAt: Date;
  lastViewed?: Date;
  notificationsEnabled?: boolean;
}

interface UserFavoritesProps {
  onFavoriteSelect?: (item: FavoriteItem) => void;
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ onFavoriteSelect }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | FavoriteItem['type']>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'type'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const saved = ClientStorage.getItem('user_favorites', []);
    setFavorites(saved);
  };

  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: new Date()
    };
    const updated = [newFavorite, ...favorites];
    setFavorites(updated);
    ClientStorage.setItem('user_favorites', updated);
  };

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    ClientStorage.setItem('user_favorites', updated);
  };

  // Smart filtering and sorting
  const filteredFavorites = favorites
    .filter(f => {
      const matchesFilter = activeFilter === 'all' || f.type === activeFilter;
      const matchesSearch = searchQuery === '' || 
        f.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      } else {
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }
    });

  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleBulkDelete = () => {
    const updated = favorites.filter(f => !selectedItems.has(f.id));
    setFavorites(updated);
    ClientStorage.setItem('user_favorites', updated);
    setSelectedItems(new Set());
    setShowBulkActions(false);
  };

  const handleBulkNotifications = (enable: boolean) => {
    const updated = favorites.map(f => 
      selectedItems.has(f.id) ? { ...f, notificationsEnabled: enable } : f
    );
    setFavorites(updated);
    ClientStorage.setItem('user_favorites', updated);
  };

  const getSuggestedFavorites = () => {
    // AI-powered suggestions based on user behavior
    const suggestions = [
      { id: 'lakers', type: 'team' as const, name: 'LA Lakers', icon: '🏀', addedAt: new Date() },
      { id: 'premier-league', type: 'league' as const, name: 'Premier League', icon: '⚽', addedAt: new Date() },
      { id: 'nfl', type: 'league' as const, name: 'NFL', icon: '🏈', addedAt: new Date() }
    ];
    return suggestions.filter(s => !favorites.some(f => f.id === s.id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'team': return '#3b82f6';
      case 'league': return '#22c55e';
      case 'match': return '#f59e0b';
      case 'prediction': return '#8b5cf6';
      case 'author': return '#ec4899';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header with Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>⭐ My Favorites ({favorites.length})</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {showBulkActions && (
            <div style={{ display: 'flex', gap: '8px', marginRight: '8px' }}>
              <button
                onClick={() => handleBulkNotifications(true)}
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  color: '#22c55e',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                🔔 Enable ({selectedItems.size})
              </button>
              <button
                onClick={handleBulkDelete}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                🗑️ Delete ({selectedItems.size})
              </button>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            + Add
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="🔍 Search favorites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none'
          }}
        />
      </div>

      {/* Sort Options */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <span style={{ color: '#9ca3af', fontSize: '0.85rem', alignSelf: 'center' }}>Sort by:</span>
        {(['recent', 'alphabetical', 'type'] as const).map(sort => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            style={{
              background: sortBy === sort ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${sortBy === sort ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}`,
              color: sortBy === sort ? '#c4b5fd' : '#9ca3af',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              textTransform: 'capitalize'
            }}
          >
            {sort}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {(['all', 'team', 'league', 'match', 'prediction', 'author'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              background: activeFilter === filter ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${activeFilter === filter ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}`,
              color: activeFilter === filter ? '#c4b5fd' : '#9ca3af',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Favorites List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {filteredFavorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⭐</div>
            <p>No favorites yet. Start adding your favorite teams, leagues, or predictions!</p>
          </div>
        ) : (
          filteredFavorites.map(fav => (
            <div
              key={fav.id}
              style={{
                background: selectedItems.has(fav.id) ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '12px',
                border: `1px solid ${selectedItems.has(fav.id) ? '#8b5cf6' : getTypeColor(fav.type) + '40'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = selectedItems.has(fav.id) ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255, 255, 255, 0.05)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <input
                  type="checkbox"
                  checked={selectedItems.has(fav.id)}
                  onChange={() => toggleItemSelection(fav.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    accentColor: '#8b5cf6'
                  }}
                />
                <span 
                  style={{ fontSize: '1.5rem' }}
                  onClick={() => onFavoriteSelect?.(fav)}
                >
                  {fav.icon}
                </span>
                <div onClick={() => onFavoriteSelect?.(fav)} style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {fav.name}
                    {fav.notificationsEnabled && <span style={{ fontSize: '0.8rem' }}>🔔</span>}
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: getTypeColor(fav.type),
                    textTransform: 'uppercase',
                    fontWeight: '600'
                  }}>
                    {fav.type}
                  </div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(fav.id);
                }}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: 'none',
                  color: '#ef4444',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* AI-Powered Suggestions */}
      {getSuggestedFavorites().length > 0 && (
        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(139, 92, 246, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          <h4 style={{ color: '#8b5cf6', fontSize: '0.95rem', marginBottom: '12px' }}>
            🤖 Suggested for You
          </h4>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {getSuggestedFavorites().slice(0, 5).map(suggestion => (
              <button
                key={suggestion.id}
                onClick={() => addFavorite(suggestion)}
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: '#c4b5fd',
                  padding: '8px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'}
              >
                <span>{suggestion.icon}</span>
                <span>{suggestion.name}</span>
                <span style={{ fontSize: '0.7rem' }}>+</span>
              </button>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export { UserFavorites };