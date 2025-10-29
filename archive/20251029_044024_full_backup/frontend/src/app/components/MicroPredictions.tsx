"use client";
import React, { useState, useEffect } from 'react';
import { ClientStorage } from '@utils/clientStorage';

interface MicroPrediction {
  id: string;
  type: 'next_goal' | 'corner' | 'card' | 'substitution' | 'shot_on_target';
  question: string;
  options: MicroOption[];
  expiresAt: Date;
  odds: number;
  stake: number;
  result?: string;
  payout?: number;
}

interface MicroOption {
  id: string;
  label: string;
  odds: number;
}

interface LiveMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  minute: number;
  isLive: boolean;
}

const MicroPredictions: React.FC = () => {
  const [activePrediction, setActivePrediction] = useState<MicroPrediction | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState(5);
  const [balance, setBalance] = useState(1000);
  const [history, setHistory] = useState<MicroPrediction[]>([]);
  const [liveMatch, setLiveMatch] = useState<LiveMatch>({
    id: '1',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    score: '1-1',
    minute: 67,
    isLive: true
  });

  useEffect(() => {
    // Load balance
    const savedBalance = ClientStorage.getItem('pi_coins_balance', 1000);
    setBalance(savedBalance);

    // Load history
    const savedHistory = ClientStorage.getItem('micro_predictions_history', []);
    setHistory(savedHistory);

    // Generate first prediction
    generateNewPrediction();
  }, []);

  useEffect(() => {
    if (!activePrediction) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(activePrediction.expiresAt).getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));

      setTimeRemaining(remaining);

      if (remaining === 0) {
        finalizePrediction();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activePrediction]);

  const generateNewPrediction = () => {
    const predictionTypes = [
      {
        type: 'next_goal' as const,
        question: 'Who will score the next goal?',
        options: [
          { id: 'home', label: liveMatch.homeTeam, odds: 2.1 },
          { id: 'away', label: liveMatch.awayTeam, odds: 2.3 },
          { id: 'none', label: 'No Goal', odds: 1.8 }
        ]
      },
      {
        type: 'corner' as const,
        question: 'Next corner kick?',
        options: [
          { id: 'home', label: liveMatch.homeTeam, odds: 1.9 },
          { id: 'away', label: liveMatch.awayTeam, odds: 2.0 },
          { id: 'none', label: 'No Corner', odds: 2.5 }
        ]
      },
      {
        type: 'card' as const,
        question: 'Will there be a card in the next 5 minutes?',
        options: [
          { id: 'yes_yellow', label: 'Yes - Yellow', odds: 3.5 },
          { id: 'yes_red', label: 'Yes - Red', odds: 8.0 },
          { id: 'no', label: 'No Card', odds: 1.5 }
        ]
      },
      {
        type: 'shot_on_target' as const,
        question: 'Shot on target in next 2 minutes?',
        options: [
          { id: 'home', label: liveMatch.homeTeam, odds: 2.2 },
          { id: 'away', label: liveMatch.awayTeam, odds: 2.4 },
          { id: 'both', label: 'Both Teams', odds: 4.0 },
          { id: 'none', label: 'No Shots', odds: 1.7 }
        ]
      }
    ];

    const randomType = predictionTypes[Math.floor(Math.random() * predictionTypes.length)];

    const newPrediction: MicroPrediction = {
      id: Date.now().toString(),
      type: randomType.type,
      question: randomType.question,
      options: randomType.options,
      expiresAt: new Date(Date.now() + 30000), // 30 seconds
      odds: 0,
      stake: stakeAmount
    };

    setActivePrediction(newPrediction);
    setSelectedOption(null);
    setTimeRemaining(30);
  };

  const placeMicroBet = () => {
    if (!selectedOption || !activePrediction || stakeAmount > balance) return;

    const selectedOpt = activePrediction.options.find(o => o.id === selectedOption);
    if (!selectedOpt) return;

    const updatedPrediction = {
      ...activePrediction,
      stake: stakeAmount,
      odds: selectedOpt.odds
    };

    setActivePrediction(updatedPrediction);
    setBalance(prev => prev - stakeAmount);
    ClientStorage.setItem('pi_coins_balance', balance - stakeAmount);
  };

  const finalizePrediction = () => {
    if (!activePrediction) return;

    // Simulate result (60% win rate for user engagement)
    const won = Math.random() < 0.6;
    const payout = won ? activePrediction.stake * activePrediction.odds : 0;

    const finalizedPrediction: MicroPrediction = {
      ...activePrediction,
      result: won ? 'won' : 'lost',
      payout
    };

    // Update balance if won
    if (won) {
      const newBalance = balance + payout;
      setBalance(newBalance);
      ClientStorage.setItem('pi_coins_balance', newBalance);
    }

    // Add to history
    const updatedHistory = [finalizedPrediction, ...history].slice(0, 20);
    setHistory(updatedHistory);
    ClientStorage.setItem('micro_predictions_history', updatedHistory);

    // Generate new prediction after 3 seconds
    setTimeout(() => {
      generateNewPrediction();
    }, 3000);

    setActivePrediction(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'next_goal': return '⚽';
      case 'corner': return '🚩';
      case 'card': return '🟨';
      case 'substitution': return '🔄';
      case 'shot_on_target': return '🎯';
      default: return '⚡';
    }
  };

  const totalWon = history.filter(h => h.result === 'won').length;
  const totalLost = history.filter(h => h.result === 'lost').length;
  const winRate = totalWon + totalLost > 0 ? (totalWon / (totalWon + totalLost)) * 100 : 0;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(239, 68, 68, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(234, 179, 8, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #eab308, #ef4444)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        ⚡ Micro-Predictions - Lightning Fast!
      </h2>

      {/* Live Match Info */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '20px',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ color: '#22c55e', fontSize: '0.9rem', marginBottom: '4px' }}>
            🔴 LIVE - {liveMatch.minute}'
          </div>
          <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {liveMatch.homeTeam} {liveMatch.score} {liveMatch.awayTeam}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#ffd700', fontSize: '1.5rem', fontWeight: 'bold' }}>
            π{balance}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Your Balance</div>
        </div>
      </div>

      {/* Active Prediction */}
      {activePrediction && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          border: '2px solid rgba(234, 179, 8, 0.5)'
        }}>
          {/* Timer */}
          <div style={{
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: timeRemaining <= 10 ? '#ef4444' : '#eab308',
              marginBottom: '8px',
              animation: timeRemaining <= 10 ? 'pulse 1s infinite' : 'none'
            }}>
              {timeRemaining}s
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Time remaining</div>
          </div>

          {/* Question */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {getTypeIcon(activePrediction.type)}
            </div>
            <h3 style={{ color: '#fff', fontSize: '1.3rem' }}>
              {activePrediction.question}
            </h3>
          </div>

          {/* Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: activePrediction.options.length <= 3 ? `repeat(${activePrediction.options.length}, 1fr)` : 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '20px'
          }}>
            {activePrediction.options.map(option => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                disabled={activePrediction.stake > 0}
                style={{
                  background: selectedOption === option.id
                    ? 'linear-gradient(135deg, #eab308, #ca8a04)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: selectedOption === option.id ? '2px solid #eab308' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: activePrediction.stake > 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: activePrediction.stake > 0 ? 0.5 : 1
                }}
              >
                <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}>
                  {option.label}
                </div>
                <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  {option.odds.toFixed(2)}x
                </div>
              </button>
            ))}
          </div>

          {/* Stake Controls */}
          {activePrediction.stake === 0 ? (
            <div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ color: '#9ca3af', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
                  Stake Amount:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[5, 10, 25, 50].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setStakeAmount(amount)}
                      style={{
                        flex: 1,
                        background: stakeAmount === amount ? 'rgba(234, 179, 8, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                        border: stakeAmount === amount ? '1px solid #eab308' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '10px',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      π{amount}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={placeMicroBet}
                disabled={!selectedOption || stakeAmount > balance}
                style={{
                  width: '100%',
                  background: selectedOption && stakeAmount <= balance
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: selectedOption && stakeAmount <= balance ? 'pointer' : 'not-allowed'
                }}
              >
                {selectedOption
                  ? `⚡ Place Bet - Potential Win: π${(stakeAmount * (activePrediction.options.find(o => o.id === selectedOption)?.odds || 0)).toFixed(2)}`
                  : 'Select an option to bet'
                }
              </button>
            </div>
          ) : (
            <div style={{
              background: 'rgba(34, 197, 94, 0.2)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ color: '#22c55e', fontSize: '1.1rem', fontWeight: 'bold' }}>
                ✅ Bet Placed! Waiting for result...
              </div>
              <div style={{ color: '#86efac', fontSize: '0.9rem', marginTop: '8px' }}>
                Stake: π{activePrediction.stake} | Potential: π{(activePrediction.stake * activePrediction.odds).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ color: '#22c55e', fontSize: '1.8rem', fontWeight: 'bold' }}>
            {totalWon}
          </div>
          <div style={{ color: '#86efac', fontSize: '0.9rem' }}>Won</div>
        </div>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{ color: '#ef4444', fontSize: '1.8rem', fontWeight: 'bold' }}>
            {totalLost}
          </div>
          <div style={{ color: '#fca5a5', fontSize: '0.9rem' }}>Lost</div>
        </div>
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          border: '1px solid rgba(234, 179, 8, 0.3)'
        }}>
          <div style={{ color: '#eab308', fontSize: '1.8rem', fontWeight: 'bold' }}>
            {winRate.toFixed(0)}%
          </div>
          <div style={{ color: '#fde047', fontSize: '0.9rem' }}>Win Rate</div>
        </div>
      </div>

      {/* Recent History */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '16px'
      }}>
        <h4 style={{ color: '#fff', marginBottom: '12px' }}>📊 Recent Results</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
          {history.slice(0, 5).map(pred => (
            <div key={pred.id} style={{
              background: pred.result === 'won' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: `1px solid ${pred.result === 'won' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
            }}>
              <div>
                <div style={{ color: '#fff', fontSize: '0.9rem' }}>
                  {getTypeIcon(pred.type)} {pred.question}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                  Stake: π{pred.stake} @ {pred.odds}x
                </div>
              </div>
              <div style={{
                color: pred.result === 'won' ? '#22c55e' : '#ef4444',
                fontWeight: 'bold',
                fontSize: '1.1rem'
              }}>
                {pred.result === 'won' ? `+π${pred.payout?.toFixed(2)}` : `-π${pred.stake}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export { MicroPredictions };