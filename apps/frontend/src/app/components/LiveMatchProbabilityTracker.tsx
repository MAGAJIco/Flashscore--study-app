
"use client";
import React, { useState, useEffect } from 'react';

interface MatchProbability {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeProbability: number;
  drawProbability: number;
  awayProbability: number;
  minute: number;
  score: { home: number; away: number };
  events: string[];
  trend: 'rising' | 'falling' | 'stable';
  lastUpdate: Date;
}

const LiveMatchProbabilityTracker: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<MatchProbability[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [probabilityHistory, setProbabilityHistory] = useState<{[key: string]: number[]}>({});

  useEffect(() => {
    // Simulate live match data
    const mockMatches: MatchProbability[] = [
      {
        matchId: '1',
        homeTeam: 'Manchester United',
        awayTeam: 'Arsenal',
        homeProbability: 45,
        drawProbability: 28,
        awayProbability: 27,
        minute: 34,
        score: { home: 1, away: 0 },
        events: ['Goal! Man Utd 32\''],
        trend: 'rising',
        lastUpdate: new Date()
      },
      {
        matchId: '2',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        homeProbability: 62,
        drawProbability: 0,
        awayProbability: 38,
        minute: 18,
        score: { home: 45, away: 38 },
        events: ['3-pointer Lakers 17\''],
        trend: 'stable',
        lastUpdate: new Date()
      }
    ];

    setLiveMatches(mockMatches);

    // Update probabilities every 30 seconds
    const interval = setInterval(() => {
      setLiveMatches(prev => prev.map(match => {
        const variance = (Math.random() - 0.5) * 10;
        const newHomeProbability = Math.max(0, Math.min(100, match.homeProbability + variance));
        const remainingProb = 100 - newHomeProbability;
        const newDrawProbability = match.drawProbability > 0 
          ? Math.max(0, Math.min(remainingProb, match.drawProbability + (Math.random() - 0.5) * 5))
          : 0;
        const newAwayProbability = 100 - newHomeProbability - newDrawProbability;

        // Update history
        setProbabilityHistory(prevHistory => ({
          ...prevHistory,
          [match.matchId]: [...(prevHistory[match.matchId] || []), newHomeProbability].slice(-20)
        }));

        return {
          ...match,
          homeProbability: newHomeProbability,
          drawProbability: newDrawProbability,
          awayProbability: newAwayProbability,
          minute: match.minute + 1,
          trend: variance > 2 ? 'rising' : variance < -2 ? 'falling' : 'stable',
          lastUpdate: new Date()
        };
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const renderProbabilityBar = (home: number, draw: number, away: number) => (
    <div style={{
      display: 'flex',
      height: '40px',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '8px'
    }}>
      <div
        style={{
          width: `${home}%`,
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: '600',
          transition: 'width 0.5s ease'
        }}
      >
        {home > 15 && `${home.toFixed(1)}%`}
      </div>
      {draw > 0 && (
        <div
          style={{
            width: `${draw}%`,
            background: 'linear-gradient(135deg, #9ca3af, #6b7280)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            transition: 'width 0.5s ease'
          }}
        >
          {draw > 15 && `${draw.toFixed(1)}%`}
        </div>
      )}
      <div
        style={{
          width: `${away}%`,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: '600',
          transition: 'width 0.5s ease'
        }}
      >
        {away > 15 && `${away.toFixed(1)}%`}
      </div>
    </div>
  );

  const renderMiniChart = (matchId: string, currentProb: number) => {
    const history = probabilityHistory[matchId] || [];
    if (history.length < 2) return null;

    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'end',
        gap: '2px',
        height: '30px',
        marginTop: '8px'
      }}>
        {history.slice(-10).map((value, index) => {
          const height = ((value - min) / range) * 25 + 5;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${height}px`,
                background: value > currentProb ? '#22c55e' : value < currentProb ? '#ef4444' : '#3b82f6',
                borderRadius: '2px',
                transition: 'height 0.3s ease'
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
          📊 Live Probability Tracker
        </h3>
        <div style={{
          background: '#22c55e',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '600',
          animation: 'pulse 2s infinite'
        }}>
          LIVE
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {liveMatches.map(match => (
          <div
            key={match.matchId}
            style={{
              background: selectedMatch === match.matchId 
                ? 'rgba(59, 130, 246, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: `1px solid ${selectedMatch === match.matchId ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => setSelectedMatch(match.matchId === selectedMatch ? null : match.matchId)}
          >
            {/* Match Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  {match.minute}' | {match.score.home} - {match.score.away}
                </div>
              </div>
              <div style={{
                background: match.trend === 'rising' ? 'rgba(34, 197, 94, 0.2)' : 
                           match.trend === 'falling' ? 'rgba(239, 68, 68, 0.2)' : 
                           'rgba(156, 163, 175, 0.2)',
                border: `1px solid ${match.trend === 'rising' ? 'rgba(34, 197, 94, 0.4)' : 
                                    match.trend === 'falling' ? 'rgba(239, 68, 68, 0.4)' : 
                                    'rgba(156, 163, 175, 0.4)'}`,
                padding: '4px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: match.trend === 'rising' ? '#22c55e' : 
                       match.trend === 'falling' ? '#ef4444' : '#9ca3af'
              }}>
                {match.trend === 'rising' ? '↗' : match.trend === 'falling' ? '↘' : '→'} {match.trend}
              </div>
            </div>

            {/* Probability Bar */}
            {renderProbabilityBar(match.homeProbability, match.drawProbability, match.awayProbability)}

            {/* Team Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#d1d5db' }}>
              <span>{match.homeTeam}</span>
              {match.drawProbability > 0 && <span>Draw</span>}
              <span>{match.awayTeam}</span>
            </div>

            {/* Expanded View */}
            {selectedMatch === match.matchId && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h4 style={{ color: '#3b82f6', marginBottom: '12px', fontSize: '1rem' }}>
                  Probability Trend
                </h4>
                {renderMiniChart(match.matchId, match.homeProbability)}

                {match.events.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ color: '#22c55e', marginBottom: '8px', fontSize: '0.9rem' }}>
                      Recent Events
                    </h4>
                    {match.events.map((event, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          marginBottom: '6px',
                          fontSize: '0.85rem',
                          color: '#d1fae5'
                        }}
                      >
                        {event}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#9ca3af', textAlign: 'right' }}>
                  Updated: {match.lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default LiveMatchProbabilityTracker;
