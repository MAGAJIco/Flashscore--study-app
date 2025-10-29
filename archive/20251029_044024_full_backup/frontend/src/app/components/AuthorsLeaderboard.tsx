"use client";
import React, { useState, useEffect } from 'react';
import { AuthorCard } from './AuthorCard';

interface Author {
  id: number;
  name: string;
  bio: string;
  expertise: string[];
  badges: any[];
  stats: any;
  winRate: number;
  level: number;
  isActive: boolean;
}

const AuthorsLeaderboard: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'winRate' | 'level' | 'followers'>('winRate');
  const [followedAuthors, setFollowedAuthors] = useState<number[]>([]);

  useEffect(() => {
    fetchTopAuthors();
    loadFollowedAuthors();
  }, [sortBy]);

  const fetchTopAuthors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/authors?top=10');
      const data = await response.json();
      
      // Sort based on selected criteria
      const sortedAuthors = [...data].sort((a, b) => {
        switch (sortBy) {
          case 'winRate':
            return b.winRate - a.winRate;
          case 'level':
            return b.level - a.level;
          case 'followers':
            return b.stats.followers - a.stats.followers;
          default:
            return 0;
        }
      });
      
      setAuthors(sortedAuthors);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowedAuthors = () => {
    const followed = JSON.parse(localStorage.getItem('followedAuthors') || '[]');
    setFollowedAuthors(followed);
  };

  const handleFollow = async (authorId: number) => {
    try {
      const response = await fetch(`/api/authors/${authorId}/follow`, {
        method: 'POST'
      });
      
      if (response.ok) {
        const newFollowed = followedAuthors.includes(authorId)
          ? followedAuthors.filter(id => id !== authorId)
          : [...followedAuthors, authorId];
        
        setFollowedAuthors(newFollowed);
        localStorage.setItem('followedAuthors', JSON.stringify(newFollowed));
        
        // Refresh authors to show updated follower count
        fetchTopAuthors();
      }
    } catch (error) {
      console.error('Error following author:', error);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `#${index + 1}`;
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          color: '#00FF88',
          fontSize: '1.2rem',
          fontWeight: '600'
        }}>
          Loading top authors... 🚀
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(13, 17, 23, 0.9) 100%)',
      borderRadius: '24px',
      padding: '30px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: '2.5rem',
          fontWeight: '800',
          margin: '0 0 10px 0',
          background: 'linear-gradient(135deg, #00FF88, #4ECDC4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏆 Authors Leaderboard
        </h2>
        <p style={{
          color: '#888',
          fontSize: '1.1rem',
          margin: 0
        }}>
          Top performing sports prediction experts
        </p>
      </div>

      {/* Sort Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '30px'
      }}>
        {[
          { key: 'winRate', label: '🎯 Win Rate', icon: '🎯' },
          { key: 'level', label: '⭐ Level', icon: '⭐' },
          { key: 'followers', label: '👥 Followers', icon: '👥' }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSortBy(key as any)}
            style={{
              background: sortBy === key 
                ? 'linear-gradient(135deg, #00FF88, #4ECDC4)'
                : 'rgba(255, 255, 255, 0.1)',
              color: sortBy === key ? '#000' : '#fff',
              border: 'none',
              borderRadius: '15px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div style={{
        display: 'grid',
        gap: '20px'
      }}>
        {authors.map((author, index) => (
          <div
            key={author.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              background: index < 3 
                ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 255, 255, 0.05))'
                : 'rgba(255, 255, 255, 0.02)',
              borderRadius: '20px',
              padding: '15px',
              border: index < 3 
                ? '2px solid rgba(255, 215, 0, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Rank */}
            <div style={{
              fontSize: '2rem',
              fontWeight: '800',
              minWidth: '60px',
              textAlign: 'center',
              color: index < 3 ? '#FFD700' : '#fff'
            }}>
              {getRankIcon(index)}
            </div>

            {/* Author Card */}
            <div style={{ flex: 1 }}>
              <AuthorCard
                author={author}
                onFollow={handleFollow}
                isFollowed={followedAuthors.includes(author.id)}
              />
            </div>

            {/* Trending indicator for top 3 */}
            {index < 3 && (
              <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                🔥 Hot
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { AuthorsLeaderboard };
