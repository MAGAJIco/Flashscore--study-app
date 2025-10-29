// src/hooks/usePiCoin.ts
import { useState, useEffect } from 'react';
import piCoinManager, { PiWallet, PiTransaction } from '../utils/piCoinManager';

export const usePiCoin = (userId: string) => {
  const [wallet, setWallet] = useState<PiWallet | null>(null);
  const [transactions, setTransactions] = useState<PiTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeWallet = () => {
      let userWallet = piCoinManager.getWallet(userId);
      if (!userWallet) {
        userWallet = piCoinManager.createWallet(userId);
      }
      setWallet(userWallet);
      setTransactions(piCoinManager.getTransactionHistory(userId));
      setLoading(false);
    };

    initializeWallet();
  }, [userId]);

  const earnCoins = (amount: number, description: string, metadata?: any) => {
    const success = piCoinManager.earnCoins(userId, amount, description, metadata);
    if (success) {
      setWallet(piCoinManager.getWallet(userId));
      setTransactions(piCoinManager.getTransactionHistory(userId));
    }
    return success;
  };

  const spendCoins = (amount: number, description: string, metadata?: any) => {
    const success = piCoinManager.spendCoins(userId, amount, description, metadata);
    if (success) {
      setWallet(piCoinManager.getWallet(userId));
      setTransactions(piCoinManager.getTransactionHistory(userId));
    }
    return success;
  };

  return {
    wallet,
    transactions,
    loading,
    earnCoins,
    spendCoins,
    getLeaderboard: piCoinManager.getLeaderboard.bind(piCoinManager),
    transferCoins: piCoinManager.transferCoins.bind(piCoinManager)
  };
};