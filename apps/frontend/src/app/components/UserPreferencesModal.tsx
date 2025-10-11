"use client";

import React, { useState } from 'react';
import { useUserPreferences } from '../providers/UserPreferencesProvider';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_SPORTS = [
  { id: 'nfl', name: 'NFL', icon: '🏈' },
  { id: 'nba', name: 'NBA', icon: '🏀' },
  { id: 'mlb', name: 'MLB', icon: '⚾' },
  { id: 'soccer', name: 'Soccer', icon: '⚽' },
  { id: 'nhl', name: 'NHL', icon: '🏒' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
];

export default function UserPreferencesModal({ isOpen, onClose }: UserPreferencesModalProps) {
  const { preferences, updatePreferences } = useUserPreferences();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  if (!isOpen) return null;

  const handleSave = async () => {
    await updatePreferences(localPrefs);
    onClose();
  };

  const toggleSport = (sportId: string) => {
    const favoriteSports = localPrefs.favoriteSports.includes(sportId)
      ? localPrefs.favoriteSports.filter(s => s !== sportId)
      : [...localPrefs.favoriteSports, sportId];
    setLocalPrefs({ ...localPrefs, favoriteSports });
  };

  const toggleNotificationSport = (sportId: string) => {
    const sportsFilter = localPrefs.notificationSettings.sportsFilter.includes(sportId)
      ? localPrefs.notificationSettings.sportsFilter.filter(s => s !== sportId)
      : [...localPrefs.notificationSettings.sportsFilter, sportId];
    setLocalPrefs({
      ...localPrefs,
      notificationSettings: { ...localPrefs.notificationSettings, sportsFilter },
    });
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)',
        borderRadius: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{
          padding: '30px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
          }}>
            ⚙️ Personalize Your Experience
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              🏆 Favorite Sports
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '12px',
            }}>
              {AVAILABLE_SPORTS.map(sport => (
                <button
                  key={sport.id}
                  onClick={() => toggleSport(sport.id)}
                  style={{
                    background: localPrefs.favoriteSports.includes(sport.id)
                      ? 'linear-gradient(135deg, #00ff88, #00d4ff)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: localPrefs.favoriteSports.includes(sport.id)
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    color: localPrefs.favoriteSports.includes(sport.id) ? '#000' : '#fff',
                    padding: '12px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{sport.icon}</span>
                  {sport.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              marginBottom: '16px',
            }}>
              🎯 Prediction Style
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {(['conservative', 'balanced', 'aggressive'] as const).map(style => (
                <button
                  key={style}
                  onClick={() => setLocalPrefs({ ...localPrefs, predictionStyle: style })}
                  style={{
                    flex: 1,
                    minWidth: '120px',
                    background: localPrefs.predictionStyle === style
                      ? 'linear-gradient(135deg, #ff6b6b, #ff8e53)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: localPrefs.predictionStyle === style
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    color: localPrefs.predictionStyle === style ? '#fff' : '#aaa',
                    padding: '16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                    textTransform: 'capitalize',
                  }}
                >
                  {style === 'conservative' && '🛡️ '}
                  {style === 'balanced' && '⚖️ '}
                  {style === 'aggressive' && '🚀 '}
                  {style}
                </button>
              ))}
            </div>
            <p style={{
              color: '#888',
              fontSize: '0.85rem',
              marginTop: '12px',
              lineHeight: '1.5',
            }}>
              {localPrefs.predictionStyle === 'conservative' && '🛡️ Focus on high-confidence, lower-risk predictions'}
              {localPrefs.predictionStyle === 'balanced' && '⚖️ Mix of safe and opportunistic predictions'}
              {localPrefs.predictionStyle === 'aggressive' && '🚀 Higher risk, higher reward opportunities'}
            </p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.1rem',
              marginBottom: '16px',
            }}>
              🔔 Smart Notifications
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  checked={localPrefs.notificationSettings.enabled}
                  onChange={(e) => setLocalPrefs({
                    ...localPrefs,
                    notificationSettings: {
                      ...localPrefs.notificationSettings,
                      enabled: e.target.checked,
                    },
                  })}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                />
                <span style={{ color: '#fff', fontSize: '0.95rem' }}>
                  Enable Notifications
                </span>
              </label>

              {localPrefs.notificationSettings.enabled && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      color: '#aaa',
                      fontSize: '0.9rem',
                      display: 'block',
                      marginBottom: '8px',
                    }}>
                      Minimum Confidence: {localPrefs.notificationSettings.minConfidence}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      step="5"
                      value={localPrefs.notificationSettings.minConfidence}
                      onChange={(e) => setLocalPrefs({
                        ...localPrefs,
                        notificationSettings: {
                          ...localPrefs.notificationSettings,
                          minConfidence: parseInt(e.target.value),
                        },
                      })}
                      style={{
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      color: '#aaa',
                      fontSize: '0.9rem',
                      display: 'block',
                      marginBottom: '12px',
                    }}>
                      Notify me about:
                    </label>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}>
                      {AVAILABLE_SPORTS.map(sport => (
                        <button
                          key={sport.id}
                          onClick={() => toggleNotificationSport(sport.id)}
                          style={{
                            background: localPrefs.notificationSettings.sportsFilter.includes(sport.id)
                              ? 'rgba(0, 255, 136, 0.2)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: localPrefs.notificationSettings.sportsFilter.includes(sport.id)
                              ? '1px solid rgba(0, 255, 136, 0.5)'
                              : '1px solid rgba(255, 255, 255, 0.1)',
                            color: localPrefs.notificationSettings.sportsFilter.includes(sport.id)
                              ? '#00ff88'
                              : '#aaa',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                          }}
                        >
                          {sport.icon} {sport.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#aaa',
                padding: '14px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                border: 'none',
                color: '#000',
                padding: '14px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s',
              }}
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
