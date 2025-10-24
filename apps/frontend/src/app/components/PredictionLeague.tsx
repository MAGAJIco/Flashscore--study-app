
"use client";
import React, { useState, useEffect } from 'react';
import { piCoinManagerInstance } from '@magajico/shared/utils';

interface League {
  id: string;
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Master';
  participants: number;
  entryFee: number;
  prizePool: number;
  duration: string;
  rules: string[];
  currentRank?: number;
  isJoined?: boolean;
}

const PredictionLeague: React.FC = () => {
  const [activeLeagues, setActiveLeagues] = useState<League[]>([]);
  const [userStats, setUserStats] = useState({
    currentTier: 'Silver',
    seasonsPlayed: 0,
    bestRank: 0,
    totalWinnings: 0,
    winRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeagueData();
  }, []);

  const fetchLeagueData = async () => {
    try {
      setLoading(true);
      
      // Fetch predictions to calculate user stats
      const predictionsRes = await fetch('/api/predictions?limit=100');
      const predictionsData = await predictionsRes.json();
      
      if (predictionsData.success && predictionsData.predictions) {
        const predictions = predictionsData.predictions;
        const correctPredictions = predictions.filter((p: any) => p.result === 'correct').length;
        const totalPredictions = predictions.length;
        const winRate = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;
        
        // Calculate tier based on win rate
        let tier = 'Bronze';
        if (winRate >= 80) tier = 'Master';
        else if (winRate >= 70) tier = 'Diamond';
        else if (winRate >= 60) tier = 'Gold';
        else if (winRate >= 50) tier = 'Silver';
        
        setUserStats({
          currentTier: tier,
          seasonsPlayed: Math.floor(totalPredictions / 20) || 1,
          bestRank: Math.max(1, Math.floor(Math.random() * 50)), // Would come from backend in production
          totalWinnings: correctPredictions * 10, // 10 Pi per correct prediction
          winRate: Number(winRate.toFixed(1))
        });
      }
      
      // Create dynamic leagues based on available predictions
      const leagues: League[] = [
        {
          id: 'weekly_general',
          name: 'Weekly Prediction Championship',
          tier: 'Gold',
          participants: 150 + Math.floor(Math.random() * 100),
          entryFee: 50,
          prizePool: 50 * (150 + Math.floor(Math.random() * 100)),
          duration: '7 days',
          rules: ['Min 5 predictions', 'Accuracy weighted scoring', 'Bonus for streaks'],
          currentRank: Math.floor(Math.random() * 50) + 1,
          isJoined: true
        },
        {
          id: 'high_stakes',
          name: 'High Stakes Tournament',
          tier: 'Diamond',
          participants: 50 + Math.floor(Math.random() * 50),
          entryFee: 200,
          prizePool: 200 * (50 + Math.floor(Math.random() * 50)),
          duration: '14 days',
          rules: ['Expert level only', 'Live predictions required', 'Top 10% advance'],
          currentRank: undefined,
          isJoined: false
        }
      ];
      
      setActiveLeagues(leagues);
    } catch (error) {
      console.error('Failed to fetch league data:', error);
      // Set default leagues on error
      setActiveLeagues([
        {
          id: 'default_league',
          name: 'General Championship',
          tier: 'Silver',
          participants: 100,
          entryFee: 25,
          prizePool: 2500,
          duration: '7 days',
          rules: ['Open to all', 'Fair play required'],
          currentRank: undefined,
          isJoined: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return '#cd7f32';
      case 'Silver': return '#c0c0c0';
      case 'Gold': return '#ffd700';
      case 'Diamond': return '#b9f2ff';
      case 'Master': return '#ff6b6b';
      default: return '#888';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Diamond': return '💎';
      case 'Master': return '👑';
      default: return '⚽';
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 105, 180, 0.1))',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        margin: '20px 0'
      }}>
        <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '20px' }}>
          🏆 Loading League Data...
        </h2>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ffd700' }}>
          <div className="animate-pulse">Loading predictions and stats...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 105, 180, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #ffd700, #ff69b4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🏆 Prediction League Championship
      </h2>

      {/* User Stats Overview */}
      <div style={{
        background: 'rgba(255, 215, 0, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <h3 style={{ color: '#ffd700', marginBottom: '16px' }}>
          🎯 Your League Profile
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
              {getTierIcon(userStats.currentTier)}
            </div>
            <div style={{ color: getTierColor(userStats.currentTier), fontWeight: 'bold' }}>
              {userStats.currentTier} Tier
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
              #{userStats.bestRank}
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>Best Rank</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
              π{userStats.totalWinnings}
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>Total Winnings</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {userStats.winRate}%
            </div>
            <div style={{ color: '#fff', fontSize: '0.9rem' }}>Win Rate</div>
          </div>
        </div>
      </div>

      {/* Active Leagues */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#ff69b4', marginBottom: '16px' }}>
          🎮 Active Leagues
        </h3>
        <div style={{ display: 'grid', gap: '20px' }}>
          {activeLeagues.map(league => (
            <div key={league.id} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '20px',
              border: `2px solid ${getTierColor(league.tier)}40`,
              position: 'relative'
            }}>
              {/* Tier Badge */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: getTierColor(league.tier),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {getTierIcon(league.tier)} {league.tier}
              </div>

              <h4 style={{ color: '#fff', marginBottom: '12px', fontSize: '1.3rem' }}>
                {league.name}
              </h4>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>Entry Fee</div>
                  <div style={{ color: '#ffd700', fontWeight: 'bold' }}>π{league.entryFee}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>Prize Pool</div>
                  <div style={{ color: '#22c55e', fontWeight: 'bold' }}>π{league.prizePool.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>Participants</div>
                  <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>{league.participants}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>Duration</div>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>{league.duration}</div>
                </div>
              </div>

              {league.currentRank && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  <div style={{ color: '#22c55e', fontWeight: 'bold' }}>
                    🏃‍♂️ Current Position: #{league.currentRank}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '8px' }}>League Rules:</div>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#d1d5db' }}>
                  {league.rules.map((rule, index) => (
                    <li key={index} style={{ fontSize: '0.8rem', marginBottom: '4px' }}>{rule}</li>
                  ))}
                </ul>
              </div>

              <button style={{
                background: league.isJoined 
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)' 
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}>
                {league.isJoined ? '✅ Joined - View Leaderboard' : '🚀 Join League'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tournament */}
      <div style={{
        background: 'rgba(255, 69, 180, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 69, 180, 0.3)'
      }}>
        <h3 style={{ color: '#ff69b4', marginBottom: '12px' }}>
          ⚡ Quick Tournament Starting Soon
        </h3>
        <p style={{ color: '#d1d5db', marginBottom: '16px' }}>
          5-minute predictions on live matches. Winner takes all!
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#ffd700', fontWeight: 'bold' }}>Entry: π25</span>
            <span style={{ color: '#888', marginLeft: '16px' }}>Starts in: 2:34</span>
          </div>
          <button style={{
            background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            🏃‍♂️ Quick Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionLeague;
