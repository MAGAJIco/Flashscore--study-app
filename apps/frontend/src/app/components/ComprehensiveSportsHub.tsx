
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useMobile } from '@hooks/useMobile';

interface EnhancedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  time: string;
  league: string;
  statistics?: any;
  events?: any[];
  socialData?: any;
  news?: any[];
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  tags: string[];
  source: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface SocialComment {
  id: string;
  user: string;
  message: string;
  timestamp: Date;
  likes: number;
  replies?: SocialComment[];
}

const ComprehensiveSportsHub: React.FC = () => {
  const isMobile = useMobile();
  const [activeTab, setActiveTab] = useState('live');
  const [matches, setMatches] = useState<EnhancedMatch[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [socialComments, setSocialComments] = useState<SocialComment[]>([]);
  const [leagueTable, setLeagueTable] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
    setupLiveUpdates();
    
    return () => {
      // Cleanup intervals
    };
  }, []);

  const loadInitialData = async () => {
    try {
      // Load all data types
      const [matchesData, newsData, tableData, transferData] = await Promise.allSettled([
        fetchLiveMatches(),
        fetchSportsNews(),
        fetchLeagueTable('PL'),
        fetchTransferNews()
      ]);

      if (matchesData.status === 'fulfilled') setMatches(matchesData.value);
      if (newsData.status === 'fulfilled') setNews(newsData.value);
      if (tableData.status === 'fulfilled') setLeagueTable(tableData.value);
      if (transferData.status === 'fulfilled') setTransfers(transferData.value);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const setupLiveUpdates = () => {
    // Simulate live updates every 30 seconds
    const interval = setInterval(() => {
      updateLiveScores();
      checkForNotifications();
    }, 30000);

    return () => clearInterval(interval);
  };

  const fetchLiveMatches = async (): Promise<EnhancedMatch[]> => {
    // Simulated data - replace with actual API call
    return [
      {
        id: '1',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        homeScore: 2,
        awayScore: 1,
        status: 'Live',
        time: "75'",
        league: 'Premier League',
        statistics: {
          possession: { home: 58, away: 42 },
          shots: { home: 14, away: 9 },
          corners: { home: 7, away: 3 }
        },
        events: [
          { id: '1', type: 'goal', minute: 23, player: 'Rashford', team: 'home', icon: '⚽' },
          { id: '2', type: 'goal', minute: 45, player: 'Salah', team: 'away', icon: '⚽' },
          { id: '3', type: 'goal', minute: 67, player: 'Bruno', team: 'home', icon: '⚽' }
        ],
        socialData: {
          reactions: { '⚽': 234, '🔥': 156, '👏': 89 },
          liveViewers: 12543,
          trending: true
        }
      },
      {
        id: '2',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: 0,
        awayScore: 0,
        status: 'Live',
        time: "32'",
        league: 'Premier League',
        statistics: {
          possession: { home: 52, away: 48 },
          shots: { home: 6, away: 4 },
          corners: { home: 3, away: 2 }
        },
        socialData: {
          reactions: { '😴': 45, '⚽': 12 },
          liveViewers: 8932,
          trending: false
        }
      }
    ];
  };

  const fetchSportsNews = async (): Promise<NewsItem[]> => {
    return [
      {
        id: '1',
        title: 'Mbappé to Real Madrid: Deal Almost Complete',
        summary: 'French superstar close to sealing his dream move to the Spanish capital',
        author: 'Transfer Expert',
        publishDate: new Date().toISOString(),
        tags: ['transfers', 'real-madrid', 'psg'],
        source: 'goal',
        imageUrl: '/news/mbappe.jpg'
      },
      {
        id: '2',
        title: 'Premier League Title Race Heating Up',
        summary: 'Manchester City and Arsenal locked in fierce battle for the crown',
        author: 'Sports Writer',
        publishDate: new Date().toISOString(),
        tags: ['premier-league', 'title-race'],
        source: 'internal'
      }
    ];
  };

  const fetchLeagueTable = async (leagueId: string) => {
    return [
      { position: 1, team: 'Manchester City', points: 26, played: 10, form: ['W', 'W', 'W', 'D', 'W'] },
      { position: 2, team: 'Arsenal', points: 24, played: 10, form: ['W', 'L', 'W', 'W', 'W'] },
      { position: 3, team: 'Liverpool', points: 22, played: 10, form: ['W', 'W', 'D', 'W', 'L'] }
    ];
  };

  const fetchTransferNews = async () => {
    return [
      {
        player: 'Kylian Mbappé',
        from: 'PSG',
        to: 'Real Madrid',
        fee: '€180M',
        status: 'rumored',
        reliability: 8
      },
      {
        player: 'Erling Haaland',
        from: 'Manchester City',
        to: 'Barcelona',
        fee: '€200M',
        status: 'rumored',
        reliability: 4
      }
    ];
  };

  const updateLiveScores = async () => {
    // Simulate score updates
    setMatches(prev => prev.map(match => {
      if (match.status === 'Live' && Math.random() > 0.8) {
        const scoreUpdate = Math.random() > 0.5 ? 'home' : 'away';
        return {
          ...match,
          [scoreUpdate + 'Score']: match[scoreUpdate + 'Score' as keyof typeof match] + 1,
          events: [
            ...match.events || [],
            {
              id: Date.now().toString(),
              type: 'goal',
              minute: parseInt(match.time.replace("'", "")),
              player: 'Player Name',
              team: scoreUpdate,
              icon: '⚽'
            }
          ]
        };
      }
      return match;
    }));
  };

  const checkForNotifications = () => {
    // Add random notifications
    if (Math.random() > 0.7) {
      const newNotification = {
        id: Date.now(),
        type: 'goal',
        message: '⚽ GOAL! Manchester United 3-1 Liverpool',
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 5000);
    }
  };

  const addComment = (matchId: string) => {
    if (!newComment.trim()) return;

    const comment: SocialComment = {
      id: Date.now().toString(),
      user: 'Current User',
      message: newComment,
      timestamp: new Date(),
      likes: 0
    };

    setSocialComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const TabButton = ({ id, label, icon, count }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={activeTab === id ? 'ios-button' : 'ios-button-secondary'}
      style={{
        padding: isMobile ? '8px 12px' : '10px 16px',
        fontSize: isMobile ? '12px' : '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <span>{icon}</span>
      {!isMobile && <span>{label}</span>}
      {count > 0 && (
        <span style={{
          background: 'var(--ios-red)',
          color: 'white',
          borderRadius: '10px',
          padding: '2px 6px',
          fontSize: '10px',
          minWidth: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {count}
        </span>
      )}
    </button>
  );

  const MatchCard = ({ match }: { match: EnhancedMatch }) => (
    <div 
      className="ios-card hover-lift"
      style={{
        padding: '20px',
        margin: '12px',
        cursor: 'pointer'
      }}
      onClick={() => setSelectedMatch(match.id)}
    >
      {/* Match Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <div style={{
          background: match.status === 'Live' ? '#ff4444' : '#666',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {match.status === 'Live' ? `🔴 ${match.time}` : match.status}
        </div>
        
        <div style={{
          fontSize: '12px',
          color: '#aaa'
        }}>
          {match.league}
        </div>
      </div>

      {/* Teams and Score */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 80px 1fr',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: '600', fontSize: '16px' }}>{match.homeTeam}</div>
        </div>
        
        <div style={{
          textAlign: 'center',
          background: 'rgba(0, 255, 136, 0.1)',
          borderRadius: '8px',
          padding: '8px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#00ff88'
          }}>
            {match.homeScore} - {match.awayScore}
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: '600', fontSize: '16px' }}>{match.awayTeam}</div>
        </div>
      </div>

      {/* Match Events */}
      {match.events && match.events.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px',
          overflowX: 'auto'
        }}>
          {match.events.slice(-5).map(event => (
            <div key={event.id} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              {event.icon} {event.minute}' {event.player}
            </div>
          ))}
        </div>
      )}

      {/* Social Reactions */}
      {match.socialData && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.entries(match.socialData.reactions).map(([emoji, count]) => (
              <span key={emoji} style={{ fontSize: '12px' }}>
                {emoji} {String(count)}
              </span>
            ))}
          </div>
          
          <div style={{ fontSize: '12px', color: '#aaa' }}>
            👥 {match.socialData.liveViewers?.toLocaleString()} watching
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="sports" style={{ minHeight: '100vh' }}>
      {/* Floating Notifications */}
      <div ref={notificationRef} style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {notifications.map(notification => (
          <div key={notification.id} style={{
            background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
            color: '#000',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 16px rgba(0, 255, 136, 0.3)',
            animation: 'slideIn 0.3s ease'
          }}>
            {notification.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="ios-nav-bar" style={{ padding: '16px' }}>
        <h1 className="ios-nav-title gradient-text" style={{
          fontSize: isMobile ? '20px' : '24px',
          textAlign: 'center'
        }}>
          ⚽ Sports Central
        </h1>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        padding: '16px',
        gap: '8px',
        overflowX: 'auto',
        scrollbarWidth: 'none'
      }}>
        <TabButton id="live" label="Live" icon="🔴" count={matches.filter(m => m.status === 'Live').length} />
        <TabButton id="news" label="News" icon="📰" count={news.length} />
        <TabButton id="table" label="Table" icon="📊" />
        <TabButton id="transfers" label="Transfers" icon="🔄" count={transfers.length} />
        <TabButton id="social" label="Social" icon="💬" count={socialComments.length} />
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 4px 100px 4px' }}>
        {activeTab === 'live' && (
          <div>
            {matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            {news.map(article => (
              <div key={article.id} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                margin: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#fff' }}>
                  {article.title}
                </h3>
                <p style={{ margin: '0 0 12px 0', color: '#aaa', fontSize: '14px' }}>
                  {article.summary}
                </p>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  <span>By {article.author}</span>
                  <span>{article.source.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'table' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            margin: '12px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Premier League Table</h3>
            {leagueTable.map((team, index) => (
              <div key={team.team} style={{
                display: 'grid',
                gridTemplateColumns: '30px 1fr 50px auto',
                alignItems: 'center',
                padding: '8px',
                borderBottom: index < leagueTable.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}>
                <span style={{ color: '#00ff88', fontWeight: '600' }}>{team.position}</span>
                <span>{team.team}</span>
                <span style={{ textAlign: 'center' }}>{team.points}</span>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {team.form.map((result: string, idx: number) => (
                    <span key={idx} style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: result === 'W' ? '#22c55e' : result === 'D' ? '#f59e0b' : '#ef4444',
                      color: 'white'
                    }}>
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transfers' && (
          <div>
            {transfers.map((transfer, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                margin: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ margin: 0, color: '#fff' }}>{transfer.player}</h4>
                  <div style={{
                    background: transfer.status === 'completed' ? '#22c55e' : transfer.status === 'agreed' ? '#f59e0b' : '#6b7280',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    textTransform: 'uppercase'
                  }}>
                    {transfer.status}
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#aaa' }}>
                  {transfer.from} → {transfer.to} | {transfer.fee}
                </div>
                <div style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  Reliability: {'★'.repeat(Math.floor(transfer.reliability / 2))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            margin: '12px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Match Discussion</h3>
            
            {/* Comment Input */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: '#fff',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={() => addComment(selectedMatch || '1')}
                style={{
                  background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  color: '#000',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Post
              </button>
            </div>

            {/* Comments List */}
            {socialComments.map(comment => (
              <div key={comment.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px'
                }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>{comment.user}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {comment.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                  {comment.message}
                </p>
                <button style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  👍 {comment.likes} | Reply
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ComprehensiveSportsHub;
