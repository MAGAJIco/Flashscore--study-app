
"use client";
import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  description: string;
}

interface PaymentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ isOpen, onClose, userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    if (isOpen) {
      loadTransactions();
    }
  }, [isOpen]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/payments/transactions?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.status === filter
  );

  const totalSpent = transactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '32px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#1a1a1a' }}>Payment History</h2>
          <button onClick={onClose} style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}>
            Close
          </button>
        </div>

        {/* Summary Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total Spent</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>
              ${totalSpent.toFixed(2)}
            </div>
          </div>
          <div style={{ background: '#f3f4f6', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Total Transactions</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>
              {transactions.length}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          {(['all', 'completed', 'pending'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '8px 16px',
                background: filter === status ? '#3b82f6' : '#e5e7eb',
                color: filter === status ? 'white' : '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Loading transactions...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No transactions found
            </div>
          ) : (
            filteredTransactions.map(tx => (
              <div
                key={tx.id}
                style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
                    {tx.description || tx.type}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    {new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#1a1a1a' }}>
                    ${tx.amount.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: tx.status === 'completed' ? '#10b981' : '#f59e0b',
                    textTransform: 'capitalize'
                  }}>
                    {tx.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
