
"use client";
import React, { useState, useEffect } from 'react';
import { useMobile } from '@hooks/useMobile';

interface League {
  id: string;
  name: string;
  sport: string;
  country: string;
  icon: string;
  color: string;
  enabled: boolean;
}

interface Match {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'live' | 'upcoming' | 'finished';
  time: string;
}

const AVAILABLE_LEAGUES: League[] = [
  { id: 'serie-a', name: 'Serie A', sport: 'Football', country: 'Italy', icon: '🇮🇹', color: '#008FD7', enabled: false },
  { id: 'ligue-1', name: 'Ligue 1', sport: 'Football', country: 'France', icon: '🇫🇷', color: '#E4002B', enabled: false },
  { id: 'eredivisie', name: 'Eredivisie', sport: 'Football', country: 'Netherlands', icon: '🇳🇱', color: '#FF6C00', enabled: false },
  { id: 'mls', name: 'MLS', sport: 'Football', country: 'USA', icon: '🇺🇸', color: '#002B5C', enabled: false },
  { id: 'j-league', name: 'J-League', sport: 'Football', country: 'Japan', icon: '🇯🇵', color: '#E60012', enabled: false },
  { id: 'super-lig', name: 'Süper Lig', sport: 'Football', country: 'Turkey', icon: '🇹🇷', color: '#E30A17', enabled: false },
  { id: 'championship', name: 'Championship', sport: 'Football', country: 'England', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#012169', enabled: false },
  { id: 'liga-mx', name: 'Liga MX', sport: 'Football', country: 'Mexico', icon: '🇲🇽', color: '#006847', enabled: false },
  { id: 'euroleague', name: 'EuroLeague', sport: 'Basketball', country: 'Europe', icon: '🏀', color: '#FF6900', enabled: false },
  { id: 'nhl', name: 'NHL', sport: 'Hockey', country: 'USA/Canada', icon: '🏒', color: '#000000', enabled: false },
];

export default function ExtraSportsCoverage() {
  const isMobile = useMobile();
  const [mounted, setMounted] = useState(false);
  const [leagues, setLeagues] = useState<League[]>(AVAILABLE_LEAGUES);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'leagues' | 'matches'>('leagues');

  useEffect(() => {
    setMounted(true);
    loadSavedPreferences();
  }, []);

  useEffect(() => {
    if (selectedLeagues.length > 0) {
      fetchMatchesForLeagues();
    }
  }, [selectedLeagues]);

  const loadSavedPreferences = () => {
    try {
      const saved = localStorage.getItem('extra_sports_leagues');
      if (saved) {
        setSelectedLeagues(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load preferences:', e);
    }
  };

  const toggleLeague = (leagueId: string) => {
    const updated = selectedLeagues.includes(leagueId)
      ? selectedLeagues.filter(id => id !== leagueId)
      : [...selectedLeagues, leagueId];
    
    setSelectedLeagues(updated);
    localStorage.setItem('extra_sports_leagues', JSON.stringify(updated));
  };

  const fetchMatchesForLeagues = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual sports API integration
      const mockMatches: Match[] = selectedLeagues.flatMap(leagueId => {
        const league = leagues.find(l => l.id === leagueId);
        return [
          {
            id: `${leagueId}-1`,
            league: league?.name || '',
            homeTeam: 'Team A',
            awayTeam: 'Team B',
            homeScore: 2,
            awayScore: 1,
            status: 'live',
            time: "67'"
          },
          {
            id: `${leagueId}-2`,
            league: league?.name || '',
            homeTeam: 'Team C',
            awayTeam: 'Team D',
            status: 'upcoming',
            time: '19:45'
          }
        ];
      });
      setMatches(mockMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: isMobile ? '16px' : '24px',
      margin: '16px',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: isMobile ? '20px' : '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00ff88, #00a2ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          🌍 Extra Sports Coverage
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setView('leagues')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              background: view === 'leagues' ? 'linear-gradient(135deg, #00ff88, #00a2ff)' : 'rgba(255, 255, 255, 0.1)',
              color: view === 'leagues' ? '#000' : '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Leagues
          </button>
          <button
            onClick={() => setView('matches')}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              border: 'none',
              background: view === 'matches' ? 'linear-gradient(135deg, #00ff88, #00a2ff)' : 'rgba(255, 255, 255, 0.1)',
              color: view === 'matches' ? '#000' : '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Matches ({matches.length})
          </button>
        </div>
      </div>

      {/* Leagues Selection View */}
      {view === 'leagues' && (
        <div>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            Select additional leagues to follow their live scores and updates
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {leagues.map(league => {
              const isSelected = selectedLeagues.includes(league.id);
              return (
                <button
                  key={league.id}
                  onClick={() => toggleLeague(league.id)}
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${league.color}22, ${league.color}11)`
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isSelected
                      ? `2px solid ${league.color}`
                      : '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${league.color}44`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '28px' }}>{league.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#fff'
                      }}>
                        {league.name}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}>
                        {league.sport} • {league.country}
                      </p>
                    </div>
                    {isSelected && (
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: league.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Matches View */}
      {view === 'matches' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(0, 255, 136, 0.3)',
                borderTop: '3px solid #00ff88',
                borderRadius: '50%',
                margin: '0 auto',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '16px' }}>
                Loading matches...
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚽</p>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>No matches available</p>
              <p style={{ fontSize: '14px' }}>Select leagues to see their matches</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {matches.map(match => {
                const league = leagues.find(l => l.name === match.league);
                return (
                  <div
                    key={match.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '16px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ fontSize: '16px' }}>{league?.icon}</span>
                        <span style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}>
                          {match.league}
                        </span>
                      </div>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: match.status === 'live' ? '#ff4444' : match.status === 'finished' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 255, 136, 0.2)',
                        color: match.status === 'live' ? '#fff' : match.status === 'finished' ? 'rgba(255, 255, 255, 0.8)' : '#00ff88'
                      }}>
                        {match.status === 'live' ? `🔴 ${match.time}` : match.status === 'finished' ? 'FT' : match.time}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: '16px'
                    }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#fff'
                        }}>
                          {match.homeTeam}
                        </p>
                      </div>

                      <div style={{
                        background: 'rgba(0, 255, 136, 0.1)',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        minWidth: '60px',
                        textAlign: 'center'
                      }}>
                        <p style={{
                          margin: 0,
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#00ff88'
                        }}>
                          {match.homeScore ?? '-'} - {match.awayScore ?? '-'}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          margin: 0,
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#fff'
                        }}>
                          {match.awayTeam}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
