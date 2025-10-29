import { useState, useEffect } from 'react';
import { useApi } from './useApi';

interface PiWallet {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  level: number;
  achievements: string[];
}

export function usePiCoin(userId: string) {
  const { data: wallet, loading, error, refetch } = useApi<PiWallet>(
    `/picoin/wallet/${userId}`
  );

  const earnCoins = async (amount: number, description: string) => {
    try {
      const response = await fetch('/api/picoin/earn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description }),
      });

      if (response.ok) {
        await refetch();
      }
    } catch (err) {
      console.error('Error earning coins:', err);
    }
  };

  const spendCoins = async (amount: number, description: string) => {
    try {
      const response = await fetch('/api/picoin/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description }),
      });

      if (response.ok) {
        await refetch();
      }
    } catch (err) {
      console.error('Error spending coins:', err);
    }
  };

  return { wallet, loading, error, earnCoins, spendCoins };
}