
"use client";
import React, { useState, useEffect } from 'react';

interface LiveStream {
  id: string;
  title: string;
  host: string;
  viewers: number;
  sport: string;
  isLive: boolean;
  thumbnail: string;
}

interface SocialPost {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  likes: number;
  prediction?: {
    match: string;
    choice: string;
    confidence: number;
  };
  media?: string;
}

const SocialHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'feed' | 'groups'>('live');
  const [liveStreams] = useState<LiveStream[]>([
    {
      id: '1',
      title: 'NBA Game Analysis Live',
      host: 'SportsGuru_Mike',
      viewers: 1247,
      sport: 'NBA',
      isLive: true,
      thumbnail: '🏀'
    },
    {
      id: '2',
      title: 'Premier League Predictions',
      host: 'FootballMaster',
      viewers: 892,
      sport: 'Soccer',
      isLive: true,
      thumbnail: '⚽'
    }
  ]);

  const [socialFeed] = useState<SocialPost[]>([
    {
      id: '1',
      user: 'PredictionPro',
      content: 'My streak continues! 🔥 Just nailed another Lakers prediction',
      timestamp: new Date(),
      likes: 23,
      prediction: {
        match: 'Lakers vs Warriors',
        choice: 'Lakers Win',
        confidence: 87
      }
    }
  ]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🌟 Social Sports Hub
      </h2>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        paddingBottom: '16px'
      }}>
        {[
          { id: 'live', label: '📺 Live Streams', icon: '🔴' },
          { id: 'feed', label: '📱 Social Feed', icon: '💬' },
          { id: 'groups', label: '👥 Groups', icon: '🏟️' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #3b82f6, #9333ea)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Live Streams Tab */}
      {activeTab === 'live' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#3b82f6', margin: 0 }}>🔴 Live Now</h3>
            <button style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              🎥 Go Live
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {liveStreams.map(stream => (
              <div key={stream.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative'
              }}>
                {/* Live Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: '#ef4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  zIndex: 2
                }}>
                  🔴 LIVE
                </div>

                {/* Thumbnail */}
                <div style={{
                  height: '150px',
                  background: 'linear-gradient(135deg, #1f2937, #374151)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem'
                }}>
                  {stream.thumbnail}
                </div>

                <div style={{ padding: '16px' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 8px 0' }}>
                    {stream.title}
                  </h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      by {stream.host}
                    </span>
                    <span style={{ color: '#3b82f6', fontSize: '0.9rem' }}>
                      👥 {stream.viewers}
                    </span>
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    width: '100%'
                  }}>
                    📺 Watch Stream
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Create Stream Prompt */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginTop: '20px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>
              🎬 Start Your Own Stream
            </h4>
            <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
              Share your predictions live, build your following, earn Pi coins from tips!
            </p>
            <button style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              🚀 Start Streaming
            </button>
          </div>
        </div>
      )}

      {/* Social Feed Tab */}
      {activeTab === 'feed' && (
        <div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <textarea
              placeholder="Share your prediction insights... 🎯"
              style={{
                width: '100%',
                minHeight: '80px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                resize: 'vertical',
                fontSize: '16px'
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  color: '#22c55e',
                  border: '1px solid #22c55e',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}>
                  📊 Add Prediction
                </button>
                <button style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  border: '1px solid #3b82f6',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}>
                  📷 Add Media
                </button>
              </div>
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                color: 'white',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                📤 Post
              </button>
            </div>
          </div>

          {/* Social Posts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {socialFeed.map(post => (
              <div key={post.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {post.user[0]}
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: '600' }}>{post.user}</div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      {post.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <p style={{ color: '#d1d5db', marginBottom: '12px' }}>
                  {post.content}
                </p>

                {post.prediction && (
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    marginBottom: '12px'
                  }}>
                    <div style={{ color: '#22c55e', fontWeight: '600', marginBottom: '4px' }}>
                      🎯 Prediction: {post.prediction.match}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: '#86efac' }}>{post.prediction.choice}</span>
                      <span style={{ color: '#22c55e', fontWeight: 'bold' }}>
                        {post.prediction.confidence}% confidence
                      </span>
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ❤️ {post.likes}
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#3b82f6',
                      cursor: 'pointer'
                    }}>
                      💬 Comment
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: '#9ca3af',
                      cursor: 'pointer'
                    }}>
                      🔄 Share
                    </button>
                  </div>
                  <button style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    border: '1px solid #22c55e',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}>
                    📋 Copy Prediction
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialHub;
