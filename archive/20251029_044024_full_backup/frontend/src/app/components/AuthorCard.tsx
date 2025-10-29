"use client";
import React, { useState } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface AuthorStats {
  totalPredictions: number;
  correctPredictions: number;
  winStreak: number;
  maxWinStreak: number;
  followers: number;
  engagement: number;
}

interface Author {
  id: number;
  name: string;
  bio: string;
  expertise: string[];
  badges: Badge[];
  stats: AuthorStats;
  winRate: number;
  level: number;
  isActive: boolean;
}

interface AuthorCardProps {
  author: Author;
  onFollow?: (id: number) => void;
  isFollowed?: boolean;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, onFollow, isFollowed = false }) => {
  const [followed, setFollowed] = useState(isFollowed);
  const [showBadges, setShowBadges] = useState(false);

  const handleFollow = () => {
    if (onFollow) {
      onFollow(author.id);
      setFollowed(!followed);
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return '#FFD700';
    if (level >= 5) return '#C0C0C0';
    return '#CD7F32';
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 80) return '#00FF88';
    if (winRate >= 60) return '#FFA500';
    return '#FF6B6B';
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '25px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${getLevelColor(author.level)}, transparent)`
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            color: '#fff',
            margin: '0 0 8px 0',
            fontSize: '1.4rem',
            fontWeight: '700'
          }}>
            {author.name}
          </h3>
          
          {/* Level and Win Rate */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '10px' }}>
            <span style={{
              background: getLevelColor(author.level),
              color: '#000',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              Level {author.level}
            </span>
            <span style={{
              background: getWinRateColor(author.winRate),
              color: '#000',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: '600'
            }}>
              {author.winRate}% Win Rate
            </span>
          </div>
        </div>

        <button
          onClick={handleFollow}
          style={{
            background: followed ? '#4CAF50' : 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
        >
          {followed ? '✓ Following' : '+ Follow'}
        </button>
      </div>

      {/* Bio */}
      <p style={{
        color: '#a0a0a0',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        marginBottom: '15px'
      }}>
        {author.bio}
      </p>

      {/* Expertise Tags */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '15px'
      }}>
        {author.expertise.map((sport, index) => (
          <span
            key={index}
            style={{
              background: 'rgba(0, 255, 136, 0.2)',
              color: '#00FF88',
              padding: '4px 10px',
              borderRadius: '10px',
              fontSize: '0.8rem',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            {sport}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: '#00FF88',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {author.stats.totalPredictions}
          </div>
          <div style={{
            color: '#888',
            fontSize: '0.75rem'
          }}>
            Predictions
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: '#4ECDC4',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {author.stats.winStreak}
          </div>
          <div style={{
            color: '#888',
            fontSize: '0.75rem'
          }}>
            Win Streak
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            color: '#FF6B6B',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {author.stats.followers}
          </div>
          <div style={{
            color: '#888',
            fontSize: '0.75rem'
          }}>
            Followers
          </div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <div
          onClick={() => setShowBadges(!showBadges)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            marginBottom: showBadges ? '10px' : '0'
          }}
        >
          <span style={{
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Badges ({author.badges.length})
          </span>
          <div style={{
            display: 'flex',
            gap: '5px'
          }}>
            {author.badges.slice(0, 3).map((badge, index) => (
              <span
                key={index}
                style={{
                  fontSize: '1.2rem',
                  filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))'
                }}
                title={`${badge.name}: ${badge.description}`}
              >
                {badge.icon}
              </span>
            ))}
            {author.badges.length > 3 && (
              <span style={{
                color: '#888',
                fontSize: '0.8rem',
                alignSelf: 'center'
              }}>
                +{author.badges.length - 3}
              </span>
            )}
          </div>
        </div>

        {showBadges && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '10px'
          }}>
            {author.badges.map((badge, index) => (
              <div
                key={index}
                style={{
                  background: `${badge.color}20`,
                  border: `1px solid ${badge.color}40`,
                  borderRadius: '8px',
                  padding: '6px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title={badge.description}
              >
                <span style={{ fontSize: '1rem' }}>{badge.icon}</span>
                <span style={{
                  color: badge.color,
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { AuthorCard };
