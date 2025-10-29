
import { useState, useEffect, useCallback } from 'react';

interface PiTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend' | 'transfer';
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
}

interface PiWallet {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: PiTransaction[];
  level: number;
  achievements: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001';

export const usePiCoin = (userId: string) => {
  const [wallet, setWallet] = useState<PiWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/picoins/wallet/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        setWallet(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch wallet');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const earnCoins = async (amount: number, description: string, metadata?: any) => {
    try {
      const response = await fetch(`${API_URL}/api/picoins/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description, metadata })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setWallet(result.data);
        return true;
      } else {
        setError(result.error || 'Failed to earn coins');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error earning coins:', err);
      return false;
    }
  };

  const spendCoins = async (amount: number, description: string, metadata?: any) => {
    try {
      const response = await fetch(`${API_URL}/api/picoins/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description, metadata })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setWallet(result.data);
        return true;
      } else {
        setError(result.error || 'Failed to spend coins');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error spending coins:', err);
      return false;
    }
  };

  const transferCoins = async (toUserId: string, amount: number, description: string) => {
    try {
      const response = await fetch(`${API_URL}/api/picoins/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: userId, toUserId, amount, description })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setWallet(result.data.fromWallet);
        return true;
      } else {
        setError(result.error || 'Failed to transfer coins');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error transferring coins:', err);
      return false;
    }
  };

  const getLeaderboard = async (limit = 100, sortBy = 'balance') => {
    try {
      const response = await fetch(`${API_URL}/api/picoins/leaderboard?limit=${limit}&sortBy=${sortBy}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch leaderboard');
        return [];
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  };

  return {
    wallet,
    loading,
    error,
    earnCoins,
    spendCoins,
    transferCoins,
    getLeaderboard,
    refreshWallet: fetchWallet
  };
};
import { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://0.0.0.0:3001';

interface PiWallet {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  level: number;
  achievements: string[];
}

interface PiTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend' | 'transfer';
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
}

export const usePiCoin = (userId: string) => {
  const [wallet, setWallet] = useState<PiWallet | null>(null);
  const [transactions, setTransactions] = useState<PiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/picoin/wallet/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setWallet(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch wallet');
      }
    } catch (err) {
      setError('Network error');
      console.error('Error fetching wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/picoin/transactions/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchWallet();
      fetchTransactions();
    }
  }, [userId, fetchWallet, fetchTransactions]);

  const earnCoins = async (amount: number, description: string, metadata?: any) => {
    try {
      const response = await fetch(`${API_URL}/api/picoin/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description, metadata })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchWallet();
        await fetchTransactions();
        return true;
      } else {
        setError(data.error || 'Failed to earn coins');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error earning coins:', err);
      return false;
    }
  };

  const spendCoins = async (amount: number, description: string, metadata?: any) => {
    try {
      const response = await fetch(`${API_URL}/api/picoin/spend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, description, metadata })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchWallet();
        await fetchTransactions();
        return true;
      } else {
        setError(data.error || 'Failed to spend coins');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error spending coins:', err);
      return false;
    }
  };

  const transferCoins = async (toUserId: string, amount: number, description: string) => {
    try {
      const response = await fetch(`${API_URL}/api/picoin/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId: userId, toUserId, amount, description })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchWallet();
        await fetchTransactions();
        return true;
      } else {
        setError(data.error || 'Failed to transfer coins');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error transferring coins:', err);
      return false;
    }
  };

  const purchaseCoins = async (amount: number, paymentMethod: string, paymentId?: string, metadata?: any) => {
    try {
      const response = await fetch(`${API_URL}/api/picoin/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount, paymentMethod, paymentId, metadata })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchWallet();
        await fetchTransactions();
        return true;
      } else {
        setError(data.error || 'Failed to purchase coins');
        return false;
      }
    } catch (err) {
      setError('Network error');
      console.error('Error purchasing coins:', err);
      return false;
    }
  };

  return {
    wallet,
    transactions,
    loading,
    error,
    earnCoins,
    spendCoins,
    transferCoins,
    purchaseCoins,
    refresh: fetchWallet
  };
};
