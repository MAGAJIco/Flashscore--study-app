"use client";
import React, { useState } from "react";

interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  winRate: number;
  piCoinsEarned: number;
  level: number;
  experience: number;
  nextLevelExp: number;
  streak: number;
  joinDate: string;
}

interface UserBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export default function UserProfile() {
  const [userStats] = useState<UserStats>({
    totalPredictions: 247,
    correctPredictions: 189,
    winRate: 76.5,
    piCoinsEarned: 1847,
    level: 12,
    experience: 3450,
    nextLevelExp: 5000,
    streak: 15,
    joinDate: "2024-03-15"
  });

  const [badges] = useState<UserBadge[]>([
    { id: '1', name: 'First Prediction', icon: '🎯', description: 'Made your first prediction', earned: true, earnedDate: '2024-03-15' },
    { id: '2', name: 'Winning Streak', icon: '🔥', description: 'Achieved 10-day winning streak', earned: true, earnedDate: '2024-09-20' },
    { id: '3', name: 'Pi Master', icon: '🪙', description: 'Earned 1000+ Pi Coins', earned: true, earnedDate: '2024-10-01' },
    { id: '4', name: 'Prediction Expert', icon: '⭐', description: 'Reached 75% win rate', earned: true, earnedDate: '2024-10-05' },
    { id: '5', name: 'Century Club', icon: '💯', description: 'Made 100+ predictions', earned: true, earnedDate: '2024-08-10' },
    { id: '6', name: 'Legend', icon: '👑', description: 'Reach level 20', earned: false }
  ]);

  const experiencePercentage = (userStats.experience / userStats.nextLevelExp) * 100;

  const getLevelColor = (level: number) => {
    if (level >= 15) return '#FFD700';
    if (level >= 10) return '#00ff88';
    if (level >= 5) return '#00a2ff';
    return '#8B8B8B';
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.1), rgba(0, 162, 255, 0.1))',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(0, 255, 136, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${getLevelColor(userStats.level)}, rgba(0, 162, 255, 0.8))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            border: '3px solid rgba(255, 255, 255, 0.3)'
          }}>
            👤
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '10px'
            }}>
              Sports Analyst
            </h1>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                background: getLevelColor(userStats.level),
                color: '#000',
                padding: '6px 16px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                Level {userStats.level}
              </span>
              <span style={{ color: '#ccc', fontSize: '0.95rem' }}>
                Member since {new Date(userStats.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Experience Bar */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            color: '#fff',
            fontSize: '0.9rem'
          }}>
            <span>Experience</span>
            <span>{userStats.experience} / {userStats.nextLevelExp} XP</span>
          </div>
          <div style={{
            width: '100%',
            height: '12px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${experiencePercentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${getLevelColor(userStats.level)}, rgba(0, 162, 255, 0.8))`,
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📊</div>
          <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '5px' }}>Total Predictions</div>
          <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 'bold' }}>{userStats.totalPredictions}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(0, 255, 136, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>✅</div>
          <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '5px' }}>Win Rate</div>
          <div style={{ color: '#00ff88', fontSize: '2rem', fontWeight: 'bold' }}>{userStats.winRate}%</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(255, 215, 0, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🪙</div>
          <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '5px' }}>Pi Coins Earned</div>
          <div style={{ color: '#ffd700', fontSize: '2rem', fontWeight: 'bold' }}>{userStats.piCoinsEarned}</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '25px',
          border: '1px solid rgba(255, 107, 107, 0.3)'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔥</div>
          <div style={{ color: '#999', fontSize: '0.9rem', marginBottom: '5px' }}>Current Streak</div>
          <div style={{ color: '#ff6b6b', fontSize: '2rem', fontWeight: 'bold' }}>{userStats.streak} days</div>
        </div>
      </div>

      {/* Achievements */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: '20px'
        }}>
          🏆 Achievements
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {badges.map(badge => (
            <div
              key={badge.id}
              style={{
                background: badge.earned 
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 140, 0, 0.1))'
                  : 'rgba(255, 255, 255, 0.03)',
                border: badge.earned 
                  ? '1px solid rgba(255, 215, 0, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                padding: '20px',
                textAlign: 'center',
                opacity: badge.earned ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                {badge.icon}
              </div>
              <div style={{
                color: badge.earned ? '#ffd700' : '#999',
                fontWeight: '600',
                marginBottom: '5px',
                fontSize: '0.95rem'
              }}>
                {badge.name}
              </div>
              <div style={{
                color: '#888',
                fontSize: '0.8rem',
                marginBottom: '8px'
              }}>
                {badge.description}
              </div>
              {badge.earned && badge.earnedDate && (
                <div style={{
                  color: '#666',
                  fontSize: '0.75rem'
                }}>
                  Earned {new Date(badge.earnedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
