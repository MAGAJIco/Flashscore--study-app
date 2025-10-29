"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';
import { UserManager } from '@magajico/shared/utils';
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

interface UserPreferences {
  sports: string[];
  teams: string[];
  leagues: string[];
  contentTypes: string[];
  difficulty: 'beginner' | 'intermediate' | 'expert';
  notifications: {
    matchUpdates: boolean;
    predictionReminders: boolean;
    newsAlerts: boolean;
  };
  personalizedFeed: boolean;
}

interface ContentItem {
  id: string;
  type: 'prediction' | 'news' | 'quiz' | 'analysis';
  title: string;
  content: string;
  sport: string;
  team?: string;
  league?: string;
  difficulty: string;
  relevanceScore: number;
  timestamp: Date;
}

interface ContentPersonalizationProps {
  currentUser: User | null;
  onPreferencesUpdate?: (preferences: UserPreferences) => void;
}

const ContentPersonalization: React.FC<ContentPersonalizationProps> = ({
  currentUser,
  onPreferencesUpdate
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    sports: [],
    teams: [],
    leagues: [],
    contentTypes: ['prediction', 'news', 'quiz'],
    difficulty: 'intermediate',
    notifications: {
      matchUpdates: true,
      predictionReminders: true,
      newsAlerts: false
    },
    personalizedFeed: true
  });

  const [personalizedContent, setPersonalizedContent] = useState<ContentItem[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'feed' | 'preferences'>('feed');

  const sportsOptions = [
    { id: 'football', name: '🏈 NFL', icon: '🏈' },
    { id: 'basketball', name: '🏀 NBA', icon: '🏀' },
    { id: 'soccer', name: '⚽ Soccer', icon: '⚽' },
    { id: 'baseball', name: '⚾ MLB', icon: '⚾' },
    { id: 'hockey', name: '🏒 NHL', icon: '🏒' },
    { id: 'tennis', name: '🎾 Tennis', icon: '🎾' }
  ];

  const contentTypesOptions = [
    { id: 'prediction', name: 'Predictions', icon: '🔮' },
    { id: 'news', name: 'News', icon: '📰' },
    { id: 'quiz', name: 'Quizzes', icon: '🧠' },
    { id: 'analysis', name: 'Analysis', icon: '📊' }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUserPreferences();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && preferences.personalizedFeed) {
      generatePersonalizedContent();
    }
  }, [preferences, currentUser]);

  const loadUserPreferences = () => {
    const saved = ClientStorage.getItem(`user_preferences_${currentUser?.id}`, preferences);
    setPreferences(saved);

    // Check if user needs onboarding
    if (saved.sports.length === 0) {
      setShowSetup(true);
    }
  };

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    if (currentUser) {
      ClientStorage.setItem(`user_preferences_${currentUser.id}`, newPreferences);
      onPreferencesUpdate?.(newPreferences);
    }
  };

  const generatePersonalizedContent = () => {
    // AI-powered content generation based on user preferences
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'prediction',
        title: 'AI Prediction: Chiefs vs Patriots',
        content: 'Our AI analysis suggests a 73% probability of Chiefs victory based on recent form and matchup history.',
        sport: 'football',
        team: 'Kansas City Chiefs',
        league: 'NFL',
        difficulty: 'intermediate',
        relevanceScore: 0.95,
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'news',
        title: 'Trade Deadline Approaching: Top Targets',
        content: 'Key players to watch as the trade deadline approaches. Impact on your favorite teams.',
        sport: 'basketball',
        league: 'NBA',
        difficulty: 'beginner',
        relevanceScore: 0.87,
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'quiz',
        title: 'Test Your Soccer Knowledge',
        content: 'Weekly quiz covering recent Premier League matches and player performances.',
        sport: 'soccer',
        league: 'Premier League',
        difficulty: 'expert',
        relevanceScore: 0.82,
        timestamp: new Date()
      }
    ];

    // Filter and score content based on user preferences
    const filtered = mockContent
      .filter(item => {
        // Filter by sport preference
        if (preferences.sports.length > 0 && !preferences.sports.includes(item.sport)) {
          return false;
        }

        // Filter by content type
        if (!preferences.contentTypes.includes(item.type)) {
          return false;
        }

        // Filter by difficulty
        const difficultyLevel = {
          'beginner': 1,
          'intermediate': 2,
          'expert': 3
        };

        const userLevel = difficultyLevel[preferences.difficulty];
        const contentLevel = difficultyLevel[item.difficulty as keyof typeof difficultyLevel];

        // Show content at user's level or one level below/above
        return Math.abs(userLevel - contentLevel) <= 1;
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    setPersonalizedContent(filtered);
  };

  const updateSportPreference = (sportId: string, selected: boolean) => {
    const updatedSports = selected
      ? [...preferences.sports, sportId]
      : preferences.sports.filter(s => s !== sportId);

    savePreferences({
      ...preferences,
      sports: updatedSports
    });
  };

  const updateContentTypePreference = (typeId: string, selected: boolean) => {
    const updatedTypes = selected
      ? [...preferences.contentTypes, typeId]
      : preferences.contentTypes.filter(t => t !== typeId);

    savePreferences({
      ...preferences,
      contentTypes: updatedTypes
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#22c55e';
      case 'intermediate': return '#f59e0b';
      case 'expert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getContentTypeIcon = (type: string) => {
    const typeData = contentTypesOptions.find(t => t.id === type);
    return typeData?.icon || '📄';
  };

  if (!currentUser) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderRadius: '20px',
        padding: '30px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ color: '#fff', marginBottom: '16px' }}>
          🎯 Personalized Content
        </h3>
        <p style={{ color: '#d1fae5', marginBottom: '24px' }}>
          Sign in to get personalized content recommendations based on your interests!
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('openLogin'))}
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Sign In for Personalization
        </button>
      </div>
    );
  }

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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <h2 style={{
          color: '#fff',
          fontSize: isMobile ? '1.5rem' : '2rem',
          margin: '0',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎯 Your Personalized Feed
        </h2>

        <button
          onClick={() => setShowSetup(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: isMobile ? '8px 16px' : '10px 20px',
            borderRadius: '20px',
            fontSize: isMobile ? '0.8rem' : '0.9rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ⚙️ Customize
        </button>
      </div>

      {/* Tab Navigation (Mobile) */}
      {isMobile && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'feed'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            📱 Feed
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'preferences'
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600'
            }}
          >
            ⚙️ Settings
          </button>
        </div>
      )}

      {/* Content Feed */}
      {(!isMobile || activeTab === 'feed') && (
        <div style={{
          display: 'grid',
          gap: '16px',
          marginBottom: isMobile ? '0' : '24px'
        }}>
          {personalizedContent.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#9ca3af',
              padding: '40px 20px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🎯</div>
              <h3>No personalized content yet</h3>
              <p style={{ marginBottom: '20px' }}>
                Set up your preferences to get content tailored to your interests!
              </p>
              <button
                onClick={() => setShowSetup(true)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Set Up Preferences
              </button>
            </div>
          ) : (
            personalizedContent.map(item => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>
                      {getContentTypeIcon(item.type)}
                    </span>
                    <span style={{
                      background: getDifficultyColor(item.difficulty),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.7rem',
                      fontWeight: '600'
                    }}>
                      {item.difficulty.toUpperCase()}
                    </span>
                    <span style={{
                      color: '#6366f1',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {Math.round(item.relevanceScore * 100)}% match
                    </span>
                  </div>

                  <span style={{
                    color: '#9ca3af',
                    fontSize: '0.8rem'
                  }}>
                    {item.timestamp.toLocaleDateString()}
                  </span>
                </div>

                <h3 style={{
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  {item.title}
                </h3>

                <p style={{
                  color: '#d1fae5',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  marginBottom: '12px'
                }}>
                  {item.content}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  color: '#9ca3af'
                }}>
                  <span>
                    {sportsOptions.find(s => s.id === item.sport)?.icon} {item.sport.toUpperCase()}
                    {item.league && ` • ${item.league}`}
                  </span>
                  <button style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>
                    Read More
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Quick Preferences (Desktop) or Settings Tab (Mobile) */}
      {(!isMobile || activeTab === 'preferences') && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{
            color: '#6366f1',
            marginBottom: '16px',
            fontSize: '1.1rem'
          }}>
            Quick Preferences
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '16px'
          }}>
            <div>
              <label style={{
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'block'
              }}>
                Personalized Feed
              </label>
              <button
                onClick={() => savePreferences({
                  ...preferences,
                  personalizedFeed: !preferences.personalizedFeed
                })}
                style={{
                  background: preferences.personalizedFeed
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {preferences.personalizedFeed ? '✅ Enabled' : '❌ Disabled'}
              </button>
            </div>

            <div>
              <label style={{
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '8px',
                display: 'block'
              }}>
                Difficulty Level
              </label>
              <select
                value={preferences.difficulty}
                onChange={(e) => savePreferences({
                  ...preferences,
                  difficulty: e.target.value as any
                })}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              >
                <option value="beginner">🟢 Beginner</option>
                <option value="intermediate">🟡 Intermediate</option>
                <option value="expert">🔴 Expert</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Setup Modal */}
      {showSetup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ color: '#fff', margin: 0 }}>
                🎯 Personalization Setup
              </h2>
              <button
                onClick={() => setShowSetup(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Sports Selection */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#6366f1', marginBottom: '12px' }}>
                Select Your Sports
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '8px'
              }}>
                {sportsOptions.map(sport => (
                  <button
                    key={sport.id}
                    onClick={() => updateSportPreference(
                      sport.id,
                      !preferences.sports.includes(sport.id)
                    )}
                    style={{
                      background: preferences.sports.includes(sport.id)
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    {sport.icon} {sport.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Types */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#6366f1', marginBottom: '12px' }}>
                Content Preferences
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '8px'
              }}>
                {contentTypesOptions.map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateContentTypePreference(
                      type.id,
                      !preferences.contentTypes.includes(type.id)
                    )}
                    style={{
                      background: preferences.contentTypes.includes(type.id)
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    {type.icon} {type.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowSetup(false)}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { ContentPersonalization };