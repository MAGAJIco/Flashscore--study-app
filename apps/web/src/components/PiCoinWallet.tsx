
'use client';

import React, { useState } from 'react';
import { usePiCoin } from '../hooks/usePiCoin';
import { PiCoinStore } from './PiCoinStore';

interface PiCoinWalletProps {
  userId: string;
}

export const PiCoinWallet: React.FC<PiCoinWalletProps> = ({ userId }) => {
  const { wallet, loading, error } = usePiCoin(userId);
  const [showStore, setShowStore] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  
  const transactions = wallet?.transactions || [];

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading wallet...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '16px',
        padding: '24px',
        color: '#fff',
        marginBottom: '20px'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: '#ffd700' }}>🪙 Your Pi Coin Wallet</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>Balance</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffd700' }}>
              {wallet?.balance || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>Level</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>
              {wallet?.level || 1}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>Total Earned</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#60a5fa' }}>
              {wallet?.totalEarned || 0}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#b0b0b0' }}>Total Spent</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#f87171' }}>
              {wallet?.totalSpent || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowStore(true)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Buy Coins
          </button>
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {showTransactions ? 'Hide' : 'View'} History
          </button>
        </div>
      </div>

      {showTransactions && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#ffd700' }}>Transaction History</h3>
          {transactions.length === 0 ? (
            <p style={{ color: '#b0b0b0' }}>No transactions yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {transactions.slice(0, 10).map(tx => (
                <div
                  key={tx.id}
                  style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{tx.description}</div>
                    <div style={{ fontSize: '0.85rem', color: '#b0b0b0' }}>
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{
                    fontWeight: 'bold',
                    color: tx.type === 'earn' ? '#4ade80' : '#f87171'
                  }}>
                    {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <PiCoinStore
        isOpen={showStore}
        onClose={() => setShowStore(false)}
        userId={userId}
        onPurchaseComplete={() => {
          // Refresh wallet data
        }}
      />
    </div>
  );
};
