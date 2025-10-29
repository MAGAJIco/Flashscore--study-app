"use client";

import React, { useState, useEffect } from 'react';
import { haptic } from '@/app/components/HapticFeedback';

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  minute: number;
  status: 'live' | 'halftime' | 'finished';
  events: MatchEvent[];
  stats: MatchStats;
}

interface MatchEvent {
  id: string;
  type: 'goal' | 'card' | 'substitution' | 'var';
  minute: number;
  team: 'home' | 'away';
  player?: string;
  description: string;
}

interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
}

export function LiveMatchTracker() {
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [predictionOdds] = useState({ home: 2.1, draw: 3.2, away: 2.8 });

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/matches/live');
        if (!response.ok) throw new Error('Failed to fetch live matches');
        const data = await response.json();
        // Ensure data is always an array
        const matchesArray = Array.isArray(data) ? data : (data?.matches || data?.data || []);
        setLiveMatches(matchesArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLiveMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveMatches();
    const interval = setInterval(updateLiveScores, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateLiveScores = async () => {
    // Simulate live updates
    setLiveMatches(prev => prev.map(match => ({
      ...match,
      minute: match.minute < 90 ? match.minute + 1 : match.minute
    })));
  };

  const placeInMatchPrediction = async (matchId: string, prediction: string) => {
    haptic.predictionPlaced();
    // Assuming predictionOdds is fetched or set elsewhere, or use the state
    // For now, we'll just log and set the prediction state
    console.log(`Placed prediction for match ${matchId}: ${prediction}`);
    // In a real app, you would make an API call here to save the prediction
    // setInMatchPrediction(prediction); // This state might be better managed per match if needed
  };

  const selectedMatchData = liveMatches.find(m => m.id === selectedMatch);

  if (loading) {
    return <div className="text-white">Loading live matches...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="live-match-tracker">
      <div className="header">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <span className="text-red-500">🔴</span>
        Live Match Tracker
      </h2>
        <span className="live-badge">LIVE</span>
      </div>

      <div className="matches-grid">
        {liveMatches.map(match => (
          <div
            key={match.id}
            className={`match-card ${selectedMatch === match.id ? 'selected' : ''}`}
            onClick={() => {
              setSelectedMatch(match.id === selectedMatch ? null : match.id);
              haptic.light();
            }}
          >
            <div className="match-header">
              <div className="teams">
                <div className="team">
                  <span className="team-name">{match.homeTeam}</span>
                  <span className="score">{match.homeScore}</span>
                </div>
                <div className="separator">-</div>
                <div className="team">
                  <span className="score">{match.awayScore}</span>
                  <span className="team-name">{match.awayTeam}</span>
                </div>
              </div>
              <div className="match-time">{match.minute}'</div>
            </div>

            {selectedMatch === match.id && selectedMatchData && (
              <div className="match-details">
                {/* Live Stats */}
                <div className="stats-section">
                  <h4>Match Statistics</h4>
                  <div className="stat-row">
                    <span>{selectedMatchData.stats.possession.home}%</span>
                    <span className="stat-label">Possession</span>
                    <span>{selectedMatchData.stats.possession.away}%</span>
                  </div>
                  <div className="stat-bar">
                    <div
                      className="stat-fill home"
                      style={{ width: `${selectedMatchData.stats.possession.home}%` }}
                    />
                    <div
                      className="stat-fill away"
                      style={{ width: `${selectedMatchData.stats.possession.away}%` }}
                    />
                  </div>

                  <div className="stat-row">
                    <span>{selectedMatchData.stats.shots.home}</span>
                    <span className="stat-label">Shots</span>
                    <span>{selectedMatchData.stats.shots.away}</span>
                  </div>

                  <div className="stat-row">
                    <span>{selectedMatchData.stats.shotsOnTarget.home}</span>
                    <span className="stat-label">On Target</span>
                    <span>{selectedMatchData.stats.shotsOnTarget.away}</span>
                  </div>
                </div>

                {/* Match Events */}
                <div className="events-section">
                  <h4>Match Events</h4>
                  {selectedMatchData.events.map(event => (
                    <div key={event.id} className={`event ${event.type}`}>
                      <span className="event-minute">{event.minute}'</span>
                      <span className="event-icon">
                        {event.type === 'goal' ? '⚽' : event.type === 'card' ? '🟨' : event.type === 'substitution' ? '🔄' : event.type === 'var' ? '📺' : '?'}
                      </span>
                      <span className="event-desc">{event.description}</span>
                    </div>
                  ))}
                </div>

                {/* In-Match Prediction */}
                <div className="prediction-section">
                  <h4>Place In-Match Prediction</h4>
                  <div className="prediction-options">
                    <button
                      className="prediction-btn home"
                      onClick={() => placeInMatchPrediction(match.id, 'home')}
                    >
                      {match.homeTeam} Win
                      <span className="odds">{predictionOdds.home}</span>
                    </button>
                    <button
                      className="prediction-btn draw"
                      onClick={() => placeInMatchPrediction(match.id, 'draw')}
                    >
                      Draw
                      <span className="odds">{predictionOdds.draw}</span>
                    </button>
                    <button
                      className="prediction-btn away"
                      onClick={() => placeInMatchPrediction(match.id, 'away')}
                    >
                      {match.awayTeam} Win
                      <span className="odds">{predictionOdds.away}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .live-match-tracker {
          background: var(--bg-primary);
          border-radius: 16px;
          padding: 24px;
          color: white;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .live-badge {
          background: #ef4444;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .matches-grid {
          display: grid;
          gap: 16px;
        }

        .match-card {
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
        }

        .match-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .match-card.selected {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .match-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .teams {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .team {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .team-name {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .score {
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .separator {
          font-size: 1.5rem;
          color: rgba(255, 255, 255, 0.3);
        }

        .match-time {
          background: #22c55e;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
        }

        .match-details {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stats-section, .events-section, .prediction-section {
          margin-bottom: 24px;
        }

        .stats-section h4, .events-section h4, .prediction-section h4 {
          color: #3b82f6;
          margin-bottom: 12px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.6);
        }

        .stat-bar {
          display: flex;
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .stat-fill {
          transition: width 0.5s ease;
        }

        .stat-fill.home {
          background: #3b82f6;
        }

        .stat-fill.away {
          background: #ef4444;
        }

        .event {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .event-minute {
          background: #22c55e;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .event-icon {
          font-size: 1.2rem;
        }

        .event-desc {
          flex: 1;
          font-size: 0.9rem;
        }

        .prediction-options {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .prediction-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-weight: 600;
        }

        .prediction-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .prediction-btn.home:hover {
          border-color: #3b82f6;
        }

        .prediction-btn.draw:hover {
          border-color: #9ca3af;
        }

        .prediction-btn.away:hover {
          border-color: #ef4444;
        }

        .odds {
          color: #fbbf24;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .prediction-options {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}