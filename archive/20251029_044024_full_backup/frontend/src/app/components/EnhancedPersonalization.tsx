"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';

interface UserProfile {
  favoriteTeams: string[];
  favoriteSports: string[];
  predictionStyle: 'conservative' | 'balanced' | 'aggressive';
  activityLevel: 'casual' | 'regular' | 'expert';
  interests: string[];
  engagementScore: number;
}

interface PersonalizedContent {
  predictions: any[];
  news: any[];
  recommendations: string[];
  insights: string[];
}

function EnhancedPersonalization() {
  const [profile, setProfile] = useState<UserProfile>({
    favoriteTeams: [],
    favoriteSports: [],
    predictionStyle: 'balanced',
    activityLevel: 'regular',
    interests: [],
    engagementScore: 0
  });

  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent>({
    predictions: [],
    news: [],
    recommendations: [],
    insights: []
  });

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadUserProfile();
    generatePersonalizedContent();
  }, []);

  const loadUserProfile = () => {
    const savedProfile = ClientStorage.getItem('user_profile', profile);
    setProfile(savedProfile);

    if (savedProfile.favoriteTeams.length === 0) {
      setShowOnboarding(true);
    }
  };

  const generatePersonalizedContent = async () => {
    try {
      const response = await fetch('/api/predictions?limit=20');
      const data = await response.json();

      if (data.success && data.predictions) {
        const filtered = data.predictions.filter((pred: any) => {
          if (profile.favoriteSports.length > 0) {
            return profile.favoriteSports.includes(pred.sport?.toLowerCase() || '');
          }
          return true;
        });

        setPersonalizedContent({
          predictions: filtered.slice(0, 10),
          news: [],
          recommendations: [
            'Based on your activity, try our AI Coach for better predictions',
            'Join prediction leagues to compete with similar users',
            'Your accuracy is improving - unlock expert level content'
          ],
          insights: [
            `Your prediction style: ${profile.predictionStyle}`,
            `Engagement level: ${profile.activityLevel}`,
            `Active in ${profile.favoriteSports.length} sports`
          ]
        });
      }
    } catch (error) {
      console.error('Failed to generate personalized content:', error);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    ClientStorage.setItem('user_profile', newProfile);
    generatePersonalizedContent();
  };

  const handleSearchTeams = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const allTeams = [
      'Lakers', 'Warriors', 'Chiefs', 'Arsenal', 'Real Madrid', 'Yankees',
      'Manchester United', 'Liverpool', 'Barcelona', 'Chelsea', 'Bayern Munich',
      'Bulls', 'Celtics', 'Heat', 'Knicks', 'Nets', 'Clippers',
      'Patriots', 'Cowboys', 'Packers', '49ers', 'Eagles', 'Steelers',
      'Red Sox', 'Dodgers', 'Cubs', 'Mets', 'Giants', 'Astros'
    ];

    const results = allTeams.filter(team => 
      team.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
    setShowSearchResults(true);
  };

  const addTeamFromSearch = (team: string) => {
    if (!profile.favoriteTeams.includes(team)) {
      updateProfile({ favoriteTeams: [...profile.favoriteTeams, team] });
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const sports = ['Football', 'Basketball', 'Soccer', 'Tennis', 'Baseball', 'Hockey'];
  const teams = ['Lakers', 'Warriors', 'Chiefs', 'Arsenal', 'Real Madrid', 'Yankees'];

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      borderRadius: '20px',
      padding: isMobile ? '20px' : '30px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      margin: '20px 0'
    }}>
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
          margin: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎯 Your Personalized Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="🔍 Search teams..."
              value={searchQuery}
              onChange={(e) => handleSearchTeams(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '20px',
                outline: 'none',
                width: isMobile ? '150px' : '200px',
                fontSize: '0.9rem'
              }}
            />
            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(17, 24, 39, 0.98)',
                borderRadius: '12px',
                marginTop: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000,
                border: '1px solid rgba(99, 102, 241, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}>
                {searchResults.map((team) => (
                  <div
                    key={team}
                    onClick={() => addTeamFromSearch(team)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      color: '#d1d5db',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {team}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowOnboarding(true)}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            ⚙️ Customize
          </button>
        </div>
      </div>

      {/* Insights Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {personalizedContent.insights.map((insight, idx) => (
          <div key={idx} style={{
            background: 'rgba(99, 102, 241, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.9rem' }}>{insight}</p>
          </div>
        ))}
      </div>

      {/* Personalized Predictions */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#6366f1', marginBottom: '16px' }}>
          🔮 Predictions For You
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {personalizedContent.predictions.slice(0, 3).map((pred, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <h4 style={{ color: '#fff', margin: 0 }}>
                  {pred.homeTeam} vs {pred.awayTeam}
                </h4>
                <span style={{
                  background: pred.confidence > 75 ? '#22c55e' : '#f59e0b',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem'
                }}>
                  {pred.confidence}%
                </span>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>
                Prediction: {pred.prediction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={{
        background: 'rgba(139, 92, 246, 0.1)',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <h3 style={{ color: '#8b5cf6', marginBottom: '12px' }}>
          💡 Smart Recommendations
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          {personalizedContent.recommendations.map((rec, idx) => (
            <li key={idx} style={{ color: '#d1d5db', marginBottom: '8px' }}>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
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
            background: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ color: '#fff', margin: 0 }}>
                🎯 Personalize Your Experience
              </h2>
              <button
                onClick={() => setShowOnboarding(false)}
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

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#6366f1', marginBottom: '12px' }}>
                Favorite Sports
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sports.map(sport => (
                  <button
                    key={sport}
                    onClick={() => {
                      const newSports = profile.favoriteSports.includes(sport)
                        ? profile.favoriteSports.filter(s => s !== sport)
                        : [...profile.favoriteSports, sport];
                      updateProfile({ favoriteSports: newSports });
                    }}
                    style={{
                      background: profile.favoriteSports.includes(sport)
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#6366f1', marginBottom: '12px' }}>
                Favorite Teams
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {teams.map(team => (
                  <button
                    key={team}
                    onClick={() => {
                      const newTeams = profile.favoriteTeams.includes(team)
                        ? profile.favoriteTeams.filter(t => t !== team)
                        : [...profile.favoriteTeams, team];
                      updateProfile({ favoriteTeams: newTeams });
                    }}
                    style={{
                      background: profile.favoriteTeams.includes(team)
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    {team}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#6366f1', marginBottom: '12px' }}>
                Prediction Style
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['conservative', 'balanced', 'aggressive'].map(style => (
                  <button
                    key={style}
                    onClick={() => updateProfile({ predictionStyle: style as any })}
                    style={{
                      flex: 1,
                      background: profile.predictionStyle === style
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowOnboarding(false);
                generatePersonalizedContent();
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { EnhancedPersonalization };