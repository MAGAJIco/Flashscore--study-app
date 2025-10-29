
"use client";
import React, { useState, useEffect } from 'react';

interface Bet {
  id: string;
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  betType: 'win' | 'draw' | 'over' | 'under';
  odds: number;
  stake: number;
  potentialReturn: number;
  status: 'pending' | 'won' | 'lost' | 'cashed_out';
}

interface BettingLimits {
  dailyDeposit: number;
  dailyLoss: number;
  sessionTime: number; // minutes
  cooldownPeriod: number; // seconds
}

export function BettingHub() {
  const [balance, setBalance] = useState(0);
  const [betSlip, setBetSlip] = useState<Bet[]>([]);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [bettingHistory, setBettingHistory] = useState<Bet[]>([]);
  const [limits, setLimits] = useState<BettingLimits>({
    dailyDeposit: 500,
    dailyLoss: 200,
    sessionTime: 120,
    cooldownPeriod: 30
  });
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const [coolingDown, setCoolingDown] = useState(0);
  const [showRealityCheck, setShowRealityCheck] = useState(false);

  // Session management
  useEffect(() => {
    if (!sessionStart) {
      setSessionStart(new Date());
    }

    const timer = setInterval(() => {
      if (sessionStart) {
        const elapsed = (Date.now() - sessionStart.getTime()) / 60000;
        if (elapsed >= limits.sessionTime) {
          setShowRealityCheck(true);
        }
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [sessionStart, limits.sessionTime]);

  // Cooling down period
  useEffect(() => {
    if (coolingDown > 0) {
      const timer = setTimeout(() => setCoolingDown(coolingDown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [coolingDown]);

  const addToBetSlip = (bet: Omit<Bet, 'id' | 'potentialReturn'>) => {
    const newBet: Bet = {
      ...bet,
      id: `bet-${Date.now()}`,
      potentialReturn: bet.stake * bet.odds
    };
    setBetSlip([...betSlip, newBet]);
  };

  const placeBets = async () => {
    if (coolingDown > 0) {
      alert(`Please wait ${coolingDown}s before placing another bet`);
      return;
    }

    const totalStake = betSlip.reduce((sum, bet) => sum + bet.stake, 0);
    
    if (totalStake > balance) {
      alert('Insufficient balance');
      return;
    }

    // Place bets via API
    try {
      const response = await fetch('/api/betting/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bets: betSlip })
      });

      if (response.ok) {
        setActiveBets([...activeBets, ...betSlip]);
        setBetSlip([]);
        setBalance(balance - totalStake);
        setCoolingDown(limits.cooldownPeriod);
      }
    } catch (error) {
      console.error('Bet placement failed:', error);
    }
  };

  const cashOut = async (betId: string) => {
    try {
      const response = await fetch(`/api/betting/cashout/${betId}`, {
        method: 'POST'
      });

      if (response.ok) {
        const { amount } = await response.json();
        setBalance(balance + amount);
        setActiveBets(activeBets.filter(b => b.id !== betId));
      }
    } catch (error) {
      console.error('Cash out failed:', error);
    }
  };

  const setDailyLimit = (type: 'deposit' | 'loss', amount: number) => {
    setLimits({
      ...limits,
      [type === 'deposit' ? 'dailyDeposit' : 'dailyLoss']: amount
    });
  };

  const selfExclude = (days: number) => {
    const exclusionEnd = new Date();
    exclusionEnd.setDate(exclusionEnd.getDate() + days);
    localStorage.setItem('selfExclusionEnd', exclusionEnd.toISOString());
    alert(`Self-exclusion activated until ${exclusionEnd.toLocaleDateString()}`);
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      borderRadius: '16px',
      color: '#fff'
    }}>
      {/* Header with Balance */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>🎰 Betting Hub</h1>
          <p style={{ color: '#94a3b8', margin: '5px 0 0 0' }}>
            {sessionStart && `Session: ${Math.floor((Date.now() - sessionStart.getTime()) / 60000)}min`}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#22c55e' }}>
            ${balance.toFixed(2)}
          </div>
          <button
            onClick={() => {/* Deposit flow */}}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            💳 Deposit
          </button>
        </div>
      </div>

      {/* Reality Check Modal */}
      {showRealityCheck && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#1e293b',
            padding: '40px',
            borderRadius: '16px',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>⏰ Reality Check</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
              You've been betting for {limits.sessionTime} minutes.
              <br />Time to take a break?
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowRealityCheck(false)}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setShowRealityCheck(false);
                  selfExclude(1);
                }}
                style={{
                  padding: '12px 24px',
                  background: '#22c55e',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Take a Break
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Bet Slip */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '20px',
          borderRadius: '12px'
        }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📋 Bet Slip
            {betSlip.length > 0 && (
              <span style={{
                background: '#ef4444',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem'
              }}>
                {betSlip.length}
              </span>
            )}
          </h2>

          {betSlip.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>
              No bets added yet
            </p>
          ) : (
            <>
              {betSlip.map(bet => (
                <div key={bet.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {bet.homeTeam} vs {bet.awayTeam}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{bet.betType}</span>
                    <span style={{ color: '#22c55e' }}>@{bet.odds.toFixed(2)}</span>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <input
                      type="number"
                      value={bet.stake}
                      onChange={(e) => {
                        const newStake = parseFloat(e.target.value) || 0;
                        setBetSlip(betSlip.map(b => 
                          b.id === bet.id 
                            ? { ...b, stake: newStake, potentialReturn: newStake * b.odds }
                            : b
                        ));
                      }}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: '#fff'
                      }}
                      placeholder="Stake amount"
                    />
                  </div>
                  <div style={{ marginTop: '8px', color: '#22c55e', fontWeight: 'bold' }}>
                    Potential: ${bet.potentialReturn.toFixed(2)}
                  </div>
                </div>
              ))}

              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Total Stake:</span>
                  <span style={{ fontWeight: 'bold' }}>
                    ${betSlip.reduce((sum, bet) => sum + bet.stake, 0).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Potential Return:</span>
                  <span style={{ fontWeight: 'bold', color: '#22c55e' }}>
                    ${betSlip.reduce((sum, bet) => sum + bet.potentialReturn, 0).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={placeBets}
                disabled={coolingDown > 0}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  padding: '15px',
                  background: coolingDown > 0 ? '#64748b' : '#22c55e',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: coolingDown > 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {coolingDown > 0 ? `Wait ${coolingDown}s` : '✓ Place Bets'}
              </button>
            </>
          )}
        </div>

        {/* Active Bets & Responsible Gambling */}
        <div>
          {/* Active Bets */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <h2 style={{ marginBottom: '20px' }}>🎯 Active Bets</h2>
            {activeBets.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                No active bets
              </p>
            ) : (
              activeBets.map(bet => (
                <div key={bet.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    {bet.homeTeam} vs {bet.awayTeam}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>Stake: ${bet.stake.toFixed(2)}</span>
                    <span style={{ color: '#22c55e' }}>Return: ${bet.potentialReturn.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => cashOut(bet.id)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: '#f59e0b',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    💰 Cash Out
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Responsible Gambling Tools */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <h2 style={{ marginBottom: '20px' }}>🛡️ Responsible Gambling</h2>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Daily Deposit Limit</label>
              <input
                type="number"
                value={limits.dailyDeposit}
                onChange={(e) => setDailyLimit('deposit', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#fff'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Daily Loss Limit</label>
              <input
                type="number"
                value={limits.dailyLoss}
                onChange={(e) => setDailyLimit('loss', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: '#fff'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => selfExclude(1)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                24h Break
              </button>
              <button
                onClick={() => selfExclude(7)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                7 Days
              </button>
              <button
                onClick={() => selfExclude(30)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                30 Days
              </button>
            </div>

            <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#fca5a5' }}>
              ⚠️ Remember: Gambling should be fun, not a way to make money. If you're concerned about your gambling, seek help.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
