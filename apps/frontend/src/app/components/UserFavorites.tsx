
"use client";

import React, { useState, useEffect } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface FavoriteItem {
  id: string;
  type: 'team' | 'league' | 'match' | 'prediction' | 'author';
  name: string;
  icon: string;
  metadata?: any;
  addedAt: Date;
}

interface UserFavoritesProps {
  onFavoriteSelect?: (item: FavoriteItem) => void;
}

const UserFavorites: React.FC<UserFavoritesProps> = ({ onFavoriteSelect }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | FavoriteItem['type']>('all');
  const [showAddModal, setShowAddModal] = useState(false);

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

  const filteredFavorites = activeFilter === 'all' 
    ? favorites 
    : favorites.filter(f => f.type === activeFilter);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>⭐ My Favorites</h3>
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
              onClick={() => onFavoriteSelect?.(fav)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '12px',
                border: `1px solid ${getTypeColor(fav.type)}40`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{fav.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: '600' }}>{fav.name}</div>
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
    </div>
  );
};

export default UserFavorites;
