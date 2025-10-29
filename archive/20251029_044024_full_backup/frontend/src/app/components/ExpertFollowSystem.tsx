"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';
import { useAuth } from '@hooks/useAuth';

interface User {
  id: string;
  username: string;
  email?: string;
  createdAt?: Date;
  lastLogin?: Date;
  sessionToken?: string;
  loginAttempts?: number;
  lockedUntil?: Date;
  emailVerified?: boolean;
  role?: string;
}

interface Expert {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  verified: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legend';
  stats: {
    totalPredictions: number;
    correctPredictions: number;
    accuracy: number;
    streak: number;
    followers: number;
    piEarned: number;
  };
  specialties: string[];
  recentPredictions: ExpertPrediction[];
  joinedDate: Date;
}

interface ExpertPrediction {
  id: string;
  matchName: string;
  prediction: string;
  confidence: number;
  reasoning: string;
  sport: string;
  timestamp: Date;
  result?: 'correct' | 'incorrect' | 'pending';
  piStake: number;
}

interface Notification {
  id: string;
  expertId: string;
  expertName: string;
  type: 'new_prediction' | 'result' | 'milestone';
  message: string;
  timestamp: Date;
  read: boolean;
  predictionId?: string;
}

interface ExpertFollowSystemProps {
  currentUser: User | null;
}

const ExpertFollowSystem: React.FC<ExpertFollowSystemProps> = ({ currentUser }) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [followedExperts, setFollowedExperts] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filter, setFilter] = useState<'all' | 'following'>('all');

  useEffect(() => {
    loadExperts();
    loadFollowedExperts();
    loadNotifications();
  }, [currentUser]);

  const loadExperts = () => {
    // Mock expert data - would come from API in production
    const mockExperts: Expert[] = [
      {
        id: 'expert_1',
        username: 'footballguru',
        displayName: 'Football Guru',
        bio: 'Premier League specialist with 15 years of analysis experience',
        avatar: '⚽',
        verified: true,
        tier: 'legend',
        stats: {
          totalPredictions: 450,
          correctPredictions: 385,
          accuracy: 85.6,
          streak: 12,
          followers: 2847,
          piEarned: 45600
        },
        specialties: ['Premier League', 'Champions League', 'La Liga'],
        recentPredictions: [],
        joinedDate: new Date('2023-01-15')
      },
      {
        id: 'expert_2',
        username: 'nbaanalytics',
        displayName: 'NBA Analytics Pro',
        bio: 'Data-driven NBA predictions using advanced statistics',
        avatar: '🏀',
        verified: true,
        tier: 'platinum',
        stats: {
          totalPredictions: 320,
          correctPredictions: 272,
          accuracy: 85.0,
          streak: 8,
          followers: 1923,
          piEarned: 32400
        },
        specialties: ['NBA', 'NCAA Basketball'],
        recentPredictions: [],
        joinedDate: new Date('2023-03-20')
      },
      {
        id: 'expert_3',
        username: 'soccertactician',
        displayName: 'Tactical Mastermind',
        bio: 'Focus on tactical analysis and formation predictions',
        avatar: '⚽',
        verified: true,
        tier: 'gold',
        stats: {
          totalPredictions: 280,
          correctPredictions: 224,
          accuracy: 80.0,
          streak: 5,
          followers: 1456,
          piEarned: 22400
        },
        specialties: ['Bundesliga', 'Serie A', 'Ligue 1'],
        recentPredictions: [],
        joinedDate: new Date('2023-05-10')
      }
    ];

    setExperts(mockExperts);
  };

  const loadFollowedExperts = () => {
    if (!currentUser) return;
    const followed = ClientStorage.getItem(`followed_experts_${currentUser.id}`, []);
    setFollowedExperts(new Set(followed));
  };

  const loadNotifications = () => {
    if (!currentUser) return;
    const stored = ClientStorage.getItem(`expert_notifications_${currentUser.id}`, []);
    setNotifications(stored);
  };

  const saveFollowedExperts = (followed: Set<string>) => {
    if (!currentUser) return;
    ClientStorage.setItem(`followed_experts_${currentUser.id}`, Array.from(followed));
    setFollowedExperts(followed);
  };

  const saveNotifications = (notifs: Notification[]) => {
    if (!currentUser) return;
    ClientStorage.setItem(`expert_notifications_${currentUser.id}`, notifs);
    setNotifications(notifs);
  };

  const toggleFollow = (expertId: string) => {
    if (!currentUser) return;

    const newFollowed = new Set(followedExperts);
    if (newFollowed.has(expertId)) {
      newFollowed.delete(expertId);
    } else {
      newFollowed.add(expertId);

      // Create welcome notification
      const expert = experts.find(e => e.id === expertId);
      if (expert) {
        const notification: Notification = {
          id: `notif_${Date.now()}`,
          expertId: expert.id,
          expertName: expert.displayName,
          type: 'milestone',
          message: `You are now following ${expert.displayName}. You'll get notified of their predictions!`,
          timestamp: new Date(),
          read: false
        };
        saveNotifications([notification, ...notifications]);
      }
    }

    saveFollowedExperts(newFollowed);

    // Update expert followers count
    const updatedExperts = experts.map(expert => {
      if (expert.id === expertId) {
        return {
          ...expert,
          stats: {
            ...expert.stats,
            followers: expert.stats.followers + (newFollowed.has(expertId) ? 1 : -1)
          }
        };
      }
      return expert;
    });
    setExperts(updatedExperts);
  };

  const markNotificationAsRead = (notifId: string) => {
    const updated = notifications.map(n =>
      n.id === notifId ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'legend': return '#ff6b6b';
      case 'platinum': return '#b9f2ff';
      case 'gold': return '#ffd700';
      case 'silver': return '#c0c0c0';
      case 'bronze': return '#cd7f32';
      default: return '#888';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'legend': return '👑';
      case 'platinum': return '💎';
      case 'gold': return '🥇';
      case 'silver': return '🥈';
      case 'bronze': return '🥉';
      default: return '⭐';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredExperts = filter === 'following'
    ? experts.filter(e => followedExperts.has(e.id))
    : experts;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{
          color: '#fff',
          fontSize: '2rem',
          margin: 0,
          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ⭐ Expert Follow System
        </h2>

        {currentUser && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'following')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Experts</option>
              <option value="following">Following ({followedExperts.size})</option>
            </select>
          </div>
        )}
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '20px',
          borderRadius: '16px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ color: '#3b82f6', margin: 0 }}>Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'transparent',
                  color: '#3b82f6',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
              No notifications yet. Follow experts to get updates!
            </p>
          ) : (
            <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  style={{
                    background: notif.read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: `1px solid ${notif.read ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.3)'}`,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#fff', fontWeight: '600' }}>{notif.expertName}</span>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                      {new Date(notif.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.9rem' }}>
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Experts Grid */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {filteredExperts.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#ccc', padding: '40px' }}>
            <h3>No experts found!</h3>
            <p>{filter === 'following' ? 'Start following experts to see them here.' : 'Check back later for expert predictors.'}</p>
          </div>
        ) : (
          filteredExperts.map(expert => (
            <div
              key={expert.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    fontSize: '3rem',
                    background: getTierColor(expert.tier),
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {expert.avatar}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
                        {expert.displayName}
                      </h3>
                      {expert.verified && <span style={{ color: '#3b82f6' }}>✓</span>}
                      <span style={{
                        background: getTierColor(expert.tier),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {getTierIcon(expert.tier)} {expert.tier.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ color: '#d1d5db', margin: '0 0 12px 0', fontSize: '0.95rem' }}>
                      @{expert.username}
                    </p>

                    <p style={{ color: '#9ca3af', margin: '0 0 12px 0', maxWidth: '500px' }}>
                      {expert.bio}
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {expert.specialties.map(specialty => (
                        <span
                          key={specialty}
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '0.8rem'
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {currentUser && (
                  <button
                    onClick={() => toggleFollow(expert.id)}
                    style={{
                      background: followedExperts.has(expert.id)
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                      color: followedExperts.has(expert.id) ? '#22c55e' : 'white',
                      border: followedExperts.has(expert.id) ? '1px solid #22c55e' : 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {followedExperts.has(expert.id) ? '✓ Following' : '+ Follow'}
                  </button>
                )}
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '16px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {expert.stats.accuracy}%
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Accuracy</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3b82f6', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {expert.stats.totalPredictions}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Predictions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {expert.stats.streak}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Win Streak</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {expert.stats.followers.toLocaleString()}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    π{expert.stats.piEarned.toLocaleString()}
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Earned</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { ExpertFollowSystem };