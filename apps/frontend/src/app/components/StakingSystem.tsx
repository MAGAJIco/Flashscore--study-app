
"use client";
import React, { useState, useEffect } from 'react';
import { piCoinManagerInstance } from '@magajico/shared/utils';

interface StakingOption {
  multiplier: number;
  minStake: number;
  risk: 'Low' | 'Medium' | 'High';
  color: string;
}

interface ActiveStake {
  id: string;
  predictionId: string;
  amount: number;
  multiplier: number;
  potentialReturn: number;
  status: 'active' | 'won' | 'lost';
  expiresAt: Date;
}

const StakingSystem: React.FC = () => {
  const [balance, setBalance] = useState(0);
  const [selectedStake, setSelectedStake] = useState(50);
  const [selectedMultiplier, setSelectedMultiplier] = useState<number | null>(null);
  const [activeStakes, setActiveStakes] = useState<ActiveStake[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const stakingOptions: StakingOption[] = [
    { multiplier: 1.5, minStake: 10, risk: 'Low', color: '#22c55e' },
    { multiplier: 2.0, minStake: 50, risk: 'Medium', color: '#f59e0b' },
    { multiplier: 3.0, minStake: 100, risk: 'High', color: '#ef4444' },
    { multiplier: 5.0, minStake: 250, risk: 'High', color: '#dc2626' }
  ];

  useEffect(() => {
    const userBalance = PiCoinManager.getBalance('default');
    setBalance(userBalance);
    loadActiveStakes();
  }, []);

  const loadActiveStakes = () => {
    const saved = localStorage.getItem('active_stakes');
    if (saved) {
      const stakes = JSON.parse(saved).map((s: any) => ({
        ...s,
        expiresAt: new Date(s.expiresAt)
      }));
      setActiveStakes(stakes);
    }
  };

  const handleStake = () => {
    if (!selectedMultiplier || selectedStake < 10) return;

    const option = stakingOptions.find(o => o.multiplier === selectedMultiplier);
    if (!option || selectedStake < option.minStake) {
      alert(`Minimum stake for ${option?.multiplier}x is π${option?.minStake}`);
      return;
    }

    if (balance < selectedStake) {
      alert('Insufficient balance');
      return;
    }

    const success = PiCoinManager.spendCoins(
      'default',
      selectedStake,
      `Staked ${selectedStake} Pi at ${selectedMultiplier}x multiplier`,
      { type: 'stake', multiplier: selectedMultiplier }
    );

    if (success) {
      const newStake: ActiveStake = {
        id: `stake_${Date.now()}`,
        predictionId: `pred_${Date.now()}`,
        amount: selectedStake,
        multiplier: selectedMultiplier,
        potentialReturn: selectedStake * selectedMultiplier,
        status: 'active',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };

      const updatedStakes = [...activeStakes, newStake];
      setActiveStakes(updatedStakes);
      localStorage.setItem('active_stakes', JSON.stringify(updatedStakes));

      setBalance(balance - selectedStake);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  };

  const simulateWin = (stakeId: string) => {
    const stake = activeStakes.find(s => s.id === stakeId);
    if (!stake) return;

    PiCoinManager.earnCoins(
      'default',
      stake.potentialReturn,
      `Won staked prediction - ${stake.multiplier}x return`
    );

    const updatedStakes = activeStakes.map(s => 
      s.id === stakeId ? { ...s, status: 'won' as const } : s
    );
    setActiveStakes(updatedStakes);
    localStorage.setItem('active_stakes', JSON.stringify(updatedStakes));
    
    const userBalance = PiCoinManager.getBalance('default');
    setBalance(userBalance);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      margin: '20px 0'
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '2rem',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #22c55e, #10b981)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        💰 Staking System
      </h2>

      {/* Balance Display */}
      <div style={{
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>π</div>
        <div style={{ color: '#22c55e', fontSize: '2rem', fontWeight: '700' }}>
          {balance.toLocaleString()}
        </div>
        <div style={{ color: '#86efac', fontSize: '0.9rem' }}>Available Balance</div>
      </div>

      {/* Staking Options */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>Choose Multiplier</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {stakingOptions.map(option => (
            <button
              key={option.multiplier}
              onClick={() => setSelectedMultiplier(option.multiplier)}
              style={{
                background: selectedMultiplier === option.multiplier 
                  ? `${option.color}40` 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${selectedMultiplier === option.multiplier ? option.color : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: option.color, marginBottom: '4px' }}>
                {option.multiplier}x
              </div>
              <div style={{ fontSize: '0.8rem', color: '#d1d5db', marginBottom: '8px' }}>
                {option.risk} Risk
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Min: π{option.minStake}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stake Amount Slider */}
      {selectedMultiplier && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>Stake Amount</h3>
          <input
            type="range"
            min={stakingOptions.find(o => o.multiplier === selectedMultiplier)?.minStake || 10}
            max={Math.min(balance, 500)}
            value={selectedStake}
            onChange={(e) => setSelectedStake(Number(e.target.value))}
            style={{
              width: '100%',
              marginBottom: '16px',
              accentColor: '#22c55e'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700' }}>
                π{selectedStake}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Stake Amount</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: '700' }}>
                π{(selectedStake * selectedMultiplier).toLocaleString()}
              </div>
              <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Potential Win</div>
            </div>
          </div>
          <button
            onClick={handleStake}
            disabled={selectedStake < (stakingOptions.find(o => o.multiplier === selectedMultiplier)?.minStake || 10)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              marginTop: '16px',
              opacity: selectedStake < (stakingOptions.find(o => o.multiplier === selectedMultiplier)?.minStake || 10) ? 0.5 : 1
            }}
          >
            🎯 Place Stake
          </button>
        </div>
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          textAlign: 'center',
          animation: 'pulse 1s ease-in-out'
        }}>
          <div style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: '700' }}>
            ✅ Stake Placed Successfully!
          </div>
        </div>
      )}

      {/* Active Stakes */}
      {activeStakes.length > 0 && (
        <div>
          <h3 style={{ color: '#22c55e', marginBottom: '16px' }}>Active Stakes</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {activeStakes.slice(0, 5).map(stake => (
              <div
                key={stake.id}
                style={{
                  background: stake.status === 'won' 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : stake.status === 'lost' 
                    ? 'rgba(239, 68, 68, 0.1)' 
                    : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `1px solid ${
                    stake.status === 'won' ? '#22c55e' : 
                    stake.status === 'lost' ? '#ef4444' : 
                    'rgba(255, 255, 255, 0.1)'
                  }`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: '600', marginBottom: '4px' }}>
                      π{stake.amount} × {stake.multiplier}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                      {stake.status === 'active' ? 'In Progress' : stake.status === 'won' ? 'Won!' : 'Lost'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: stake.status === 'won' ? '#22c55e' : '#f59e0b', 
                      fontWeight: '700',
                      fontSize: '1.2rem'
                    }}>
                      π{stake.potentialReturn}
                    </div>
                    {stake.status === 'active' && (
                      <button
                        onClick={() => simulateWin(stake.id)}
                        style={{
                          background: 'rgba(34, 197, 94, 0.2)',
                          border: '1px solid #22c55e',
                          color: '#22c55e',
                          padding: '4px 12px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          marginTop: '4px'
                        }}
                      >
                        Simulate Win
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { StakingSystem };
