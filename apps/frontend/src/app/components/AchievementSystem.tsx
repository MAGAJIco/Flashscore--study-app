"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@magajico/shared/utils';
import { piCoinManagerInstance } from '@magajico/shared/utils';
import { UserManager } from '@magajico/shared/utils';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  piCoins: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'prediction' | 'social' | 'engagement' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: string;
    target: number;
    current?: number;
  };
  reward: {
    piCoins: number;
    title?: string;
    badge?: boolean;
  };
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
}

interface AchievementSystemProps {
  currentUser: User | null;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({ 
  currentUser, 
  onAchievementUnlocked 
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNotification, setShowNotification] = useState<Achievement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize achievements
  useEffect(() => {
    initializeAchievements();
  }, [currentUser]);

  const initializeAchievements = () => {
    const defaultAchievements: Achievement[] = [
      // Prediction Achievements
      {
        id: 'first_prediction',
        title: 'First Steps',
        description: 'Make your first prediction',
        icon: '🎯',
        category: 'prediction',
        rarity: 'common',
        requirement: { type: 'predictions_made', target: 1 },
        reward: { piCoins: 25, badge: true },
        unlocked: false,
        progress: 0
      },
      {
        id: 'prediction_master',
        title: 'Prediction Master',
        description: 'Make 100 predictions',
        icon: '🏆',
        category: 'prediction',
        rarity: 'epic',
        requirement: { type: 'predictions_made', target: 100 },
        reward: { piCoins: 500, title: 'Master Predictor', badge: true },
        unlocked: false,
        progress: 0
      },
      {
        id: 'accuracy_expert',
        title: 'Accuracy Expert',
        description: 'Achieve 80% prediction accuracy',
        icon: '🎖️',
        category: 'prediction',
        rarity: 'rare',
        requirement: { type: 'accuracy_rate', target: 80 },
        reward: { piCoins: 300, badge: true },
        unlocked: false,
        progress: 0
      },

      // Streak Achievements
      {
        id: 'hot_streak',
        title: 'Hot Streak',
        description: 'Get 5 predictions correct in a row',
        icon: '🔥',
        category: 'streak',
        rarity: 'rare',
        requirement: { type: 'win_streak', target: 5 },
        reward: { piCoins: 200, badge: true },
        unlocked: false,
        progress: 0
      },
      {
        id: 'unstoppable',
        title: 'Unstoppable',
        description: 'Get 10 predictions correct in a row',
        icon: '⚡',
        category: 'streak',
        rarity: 'epic',
        requirement: { type: 'win_streak', target: 10 },
        reward: { piCoins: 500, title: 'Unstoppable Force', badge: true },
        unlocked: false,
        progress: 0
      },

      // Social Achievements
      {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: 'Join 10 challenges',
        icon: '🦋',
        category: 'social',
        rarity: 'common',
        requirement: { type: 'challenges_joined', target: 10 },
        reward: { piCoins: 150, badge: true },
        unlocked: false,
        progress: 0
      },
      {
        id: 'community_leader',
        title: 'Community Leader',
        description: 'Create 5 challenges',
        icon: '👑',
        category: 'social',
        rarity: 'rare',
        requirement: { type: 'challenges_created', target: 5 },
        reward: { piCoins: 300, badge: true },
        unlocked: false,
        progress: 0
      },

      // Engagement Achievements
      {
        id: 'daily_warrior',
        title: 'Daily Warrior',
        description: 'Login for 7 consecutive days',
        icon: '📅',
        category: 'engagement',
        rarity: 'common',
        requirement: { type: 'daily_login_streak', target: 7 },
        reward: { piCoins: 100, badge: true },
        unlocked: false,
        progress: 0
      },
      {
        id: 'quiz_master',
        title: 'Quiz Master',
        description: 'Complete 50 quizzes',
        icon: '🧠',
        category: 'engagement',
        rarity: 'rare',
        requirement: { type: 'quizzes_completed', target: 50 },
        reward: { piCoins: 250, badge: true },
        unlocked: false,
        progress: 0
      },

      // Special Achievements
      {
        id: 'pi_collector',
        title: 'Pi Collector',
        description: 'Earn 1000 Pi Coins',
        icon: '💰',
        category: 'special',
        rarity: 'epic',
        requirement: { type: 'pi_coins_earned', target: 1000 },
        reward: { piCoins: 200, badge: true },
        unlocked: false,
        progress: 0
      },
      {
        id: 'legendary_status',
        title: 'Legendary Status',
        description: 'Unlock all other achievements',
        icon: '⭐',
        category: 'special',
        rarity: 'legendary',
        requirement: { type: 'achievements_unlocked', target: 9 },
        reward: { piCoins: 1000, title: 'Legend', badge: true },
        unlocked: false,
        progress: 0
      }
    ];

    // Load saved achievements or use defaults
    const savedAchievements = ClientStorage.getItem('user_achievements', defaultAchievements);
    updateAchievementProgress(savedAchievements);
  };

  const updateAchievementProgress = (achievementList: Achievement[]) => {
    if (!currentUser) {
      setAchievements(achievementList);
      return;
    }

    // Get user stats (this would normally come from your user management system)
    const userStats = getUserStats();

    const updatedAchievements = achievementList.map(achievement => {
      const current = (userStats as any)[achievement.requirement.type] || 0;
      const progress = Math.min((current / achievement.requirement.target) * 100, 100);

      // Check if achievement should be unlocked
      if (!achievement.unlocked && current >= achievement.requirement.target) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();

        // Award Pi Coins
        PiCoinManager.getInstance().earnCoins('default', achievement.reward.piCoins, `Achievement: ${achievement.title}`);

        // Show notification
        setShowNotification(achievement);
        setTimeout(() => setShowNotification(null), 5000);

        // Callback
        onAchievementUnlocked?.(achievement);
      }

      return {
        ...achievement,
        requirement: { ...achievement.requirement, current },
        progress
      };
    });

    setAchievements(updatedAchievements);
    ClientStorage.setItem('user_achievements', updatedAchievements);
  };

  const getUserStats = () => {
    // This would integrate with your actual user stats system
    return {
      predictions_made: ClientStorage.getItem('user_predictions_count', 0),
      accuracy_rate: ClientStorage.getItem('user_accuracy_rate', 0),
      win_streak: ClientStorage.getItem('user_win_streak', 0),
      challenges_joined: ClientStorage.getItem('user_challenges_joined', 0),
      challenges_created: ClientStorage.getItem('user_challenges_created', 0),
      daily_login_streak: ClientStorage.getItem('user_daily_streak', 0),
      quizzes_completed: ClientStorage.getItem('user_quizzes_completed', 0),
      pi_coins_earned: PiCoinManager.getInstance().getWallet('default')?.totalEarned || 0,
      achievements_unlocked: achievements.filter(a => a.unlocked).length
    };
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#22c55e';
      case 'rare': return '#3b82f6';
      case 'epic': return '#a855f7';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '0 0 20px rgba(245, 158, 11, 0.5)';
      case 'epic': return '0 0 15px rgba(168, 85, 247, 0.4)';
      case 'rare': return '0 0 10px rgba(59, 130, 246, 0.3)';
      default: return 'none';
    }
  };

  const categories = ['all', 'prediction', 'social', 'engagement', 'streak', 'special'];
  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPiCoinsFromAchievements = achievements
    .filter(a => a.unlocked)
    .reduce((total, a) => total + a.reward.piCoins, 0);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: isMobile ? '16px' : '20px',
      padding: isMobile ? '20px' : '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      margin: isMobile ? '10px' : '0'
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: isMobile ? '1.8rem' : '2rem',
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏆 Achievement Center
        </h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '8px' : '20px',
          alignItems: isMobile ? 'center' : 'flex-start',
          color: '#d1fae5',
          fontSize: '0.9rem'
        }}>
          <span>📊 {unlockedCount}/{achievements.length} Unlocked</span>
          <span>💰 {totalPiCoinsFromAchievements} Pi Coins Earned</span>
          <span>⭐ {Math.round((unlockedCount / achievements.length) * 100)}% Complete</span>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ 
        marginBottom: '24px',
        overflowX: isMobile ? 'auto' : 'visible'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          flexWrap: isMobile ? 'nowrap' : 'wrap',
          minWidth: isMobile ? 'max-content' : 'auto'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: selectedCategory === category ? 'white' : '#d1fae5',
                border: 'none',
                borderRadius: '20px',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: isMobile ? '16px' : '20px'
      }}>
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            style={{
              background: achievement.unlocked 
                ? 'rgba(245, 158, 11, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              padding: isMobile ? '16px' : '20px',
              borderRadius: '16px',
              border: `2px solid ${achievement.unlocked 
                ? getRarityColor(achievement.rarity) 
                : 'rgba(255, 255, 255, 0.1)'}`,
              transition: 'all 0.3s ease',
              position: 'relative',
              boxShadow: achievement.unlocked ? getRarityGlow(achievement.rarity) : 'none',
              opacity: achievement.unlocked ? 1 : 0.8
            }}
          >
            {/* Rarity Indicator */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: getRarityColor(achievement.rarity),
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}>
              {achievement.rarity}
            </div>

            {/* Achievement Icon */}
            <div style={{ 
              fontSize: isMobile ? '2.5rem' : '3rem', 
              marginBottom: '12px',
              filter: achievement.unlocked ? 'none' : 'grayscale(1)'
            }}>
              {achievement.icon}
            </div>

            {/* Achievement Info */}
            <h3 style={{
              color: achievement.unlocked ? '#fff' : '#9ca3af',
              fontSize: isMobile ? '1.1rem' : '1.2rem',
              fontWeight: '700',
              marginBottom: '8px'
            }}>
              {achievement.title}
            </h3>

            <p style={{
              color: achievement.unlocked ? '#d1fae5' : '#6b7280',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              marginBottom: '16px'
            }}>
              {achievement.description}
            </p>

            {/* Progress Bar */}
            {!achievement.unlocked && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: `linear-gradient(135deg, ${getRarityColor(achievement.rarity)}, ${getRarityColor(achievement.rarity)}dd)`,
                    height: '100%',
                    width: `${achievement.progress}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '4px',
                  fontSize: '0.8rem',
                  color: '#9ca3af'
                }}>
                  <span>{achievement.requirement.current || 0} / {achievement.requirement.target}</span>
                  <span>{Math.round(achievement.progress)}%</span>
                </div>
              </div>
            )}

            {/* Reward Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{
                color: '#ffd700',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                π{achievement.reward.piCoins}
              </span>
              {achievement.unlocked && (
                <span style={{
                  color: '#22c55e',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  ✅ Unlocked
                </span>
              )}
            </div>

            {achievement.unlocked && achievement.unlockedAt && (
              <div style={{
                fontSize: '0.7rem',
                color: '#9ca3af',
                marginTop: '8px'
              }}>
                Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Achievement Notification */}
      {showNotification && (
        <div 
          style={{
            position: 'fixed',
            top: isMobile ? '20px' : '30px',
            right: isMobile ? '20px' : '30px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            padding: isMobile ? '16px' : '20px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
            zIndex: 1000,
            maxWidth: isMobile ? '280px' : '350px',
            animation: 'slideInRight 0.5s ease',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            touchAction: 'manipulation'
          }}
          onClick={() => setShowNotification(null)}
          onTouchEnd={(e) => {
            e.preventDefault();
            setShowNotification(null);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Tap to dismiss"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
            <span style={{ fontSize: '2rem' }}>{showNotification.icon}</span>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>
                Achievement Unlocked!
              </h4>
              <p style={{ margin: '0', fontSize: '0.9rem', opacity: 0.9 }}>
                {showNotification.title}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', opacity: 0.8 }}>
                +π{showNotification.reward.piCoins} Pi Coins
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotification(null);
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export { AchievementSystem };