"use client";
import React, { useState } from 'react';
import { ClientStorage } from '../utils/clientStorage';

interface QuickBetSlipProps {
  match: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    confidence: number;
  };
  onBetPlaced?: (bet: any) => void;
}

const QuickBetSlip: React.FC<QuickBetSlipProps> = ({ match, onBetPlaced }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<'home' | 'draw' | 'away' | null>(null);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [isPlacing, setIsPlacing] = useState(false);

  const quickPresets = [5, 10, 25, 50];

  const placeBet = async (outcome: 'home' | 'draw' | 'away') => {
    setIsPlacing(true);

    const bet = {
      matchId: match.id,
      outcome,
      stake: stakeAmount,
      timestamp: new Date().toISOString(),
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam
    };

    // Save to local storage
    const bets = ClientStorage.getItem('quick_bets', []);
    ClientStorage.setItem('quick_bets', [bet, ...bets]);

    // Update balance with emotion
    const balance = ClientStorage.getItem('pi_coins_balance', 1000);
    const newBalance = balance - stakeAmount;
    ClientStorage.setItem('pi_coins_balance', newBalance);

    // ENHANCED: Emotional feedback
    if (navigator.vibrate) {
      // Victory pattern: short-long-short
      navigator.vibrate([50, 100, 50]);
    }

    // Show mini celebration
    const celebration = document.createElement('div');
    celebration.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 24px 32px;
      border-radius: 20px;
      font-size: 1.5rem;
      font-weight: bold;
      z-index: 10000;
      animation: celebrate 0.6s ease-out;
      box-shadow: 0 20px 60px rgba(16, 185, 129, 0.4);
    `;
    celebration.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 8px;">🎯</div>
        <div>Bet Placed!</div>
        <div style="font-size: 1rem; opacity: 0.9; margin-top: 8px;">
          π${stakeAmount} on ${outcome === 'home' ? match.homeTeam : outcome === 'away' ? match.awayTeam : 'Draw'}
        </div>
        <div style="font-size: 0.85rem; opacity: 0.7; margin-top: 4px;">
          Balance: π${newBalance}
        </div>
      </div>
    `;
    document.body.appendChild(celebration);

    setTimeout(() => celebration.remove(), 2000);

    onBetPlaced?.(bet);

    setTimeout(() => {
      setIsPlacing(false);
      setSelectedOutcome(null);
    }, 300);
  };

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {/* Quick Stake Selector */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '8px' }}>
          Quick Stake
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {quickPresets.map(amount => (
            <button
              key={amount}
              onClick={() => setStakeAmount(amount)}
              style={{
                flex: 1,
                padding: '10px',
                background: stakeAmount === amount 
                  ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: stakeAmount === amount
                  ? '2px solid #3b82f6'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              π{amount}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe-able Bet Buttons */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        marginTop: '16px'
      }}>
        <button
          onClick={() => placeBet('home')}
          disabled={isPlacing}
          style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            transform: isPlacing && selectedOutcome === 'home' ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.2s',
            opacity: isPlacing ? 0.6 : 1
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🏠</div>
          <div style={{ fontSize: '0.85rem' }}>Home</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{match.homeTeam}</div>
        </button>

        <button
          onClick={() => placeBet('draw')}
          disabled={isPlacing}
          style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            transform: isPlacing && selectedOutcome === 'draw' ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.2s',
            opacity: isPlacing ? 0.6 : 1
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🤝</div>
          <div style={{ fontSize: '0.85rem' }}>Draw</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>X</div>
        </button>

        <button
          onClick={() => placeBet('away')}
          disabled={isPlacing}
          style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            transform: isPlacing && selectedOutcome === 'away' ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.2s',
            opacity: isPlacing ? 0.6 : 1
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>✈️</div>
          <div style={{ fontSize: '0.85rem' }}>Away</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>{match.awayTeam}</div>
        </button>
      </div>

      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#3b82f6',
        fontSize: '0.85rem'
      }}>
        💡 Tap any outcome to place π{stakeAmount} bet instantly
      </div>
    </div>
  );
};

export { QuickBetSlip };