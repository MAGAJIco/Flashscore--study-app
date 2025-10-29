
"use client";

import React, { useState } from 'react';
import { usePiCoin } from '../../hooks/usePiCoin';
import { PiCoinStore } from '../../components/PiCoinStore';

interface PiCoinWalletProps {
  userId: string;
}

export const PiCoinWallet: React.FC<PiCoinWalletProps> = ({ userId }) => {
  const { wallet, loading, error, earnCoins, spendCoins } = usePiCoin(userId);
  const [showStore, setShowStore] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
        <div className="animate-pulse">
          <div className="h-8 bg-yellow-200 dark:bg-yellow-700 rounded w-32 mb-4"></div>
          <div className="h-12 bg-yellow-200 dark:bg-yellow-700 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!wallet) {
    return null;
  }

  const transactions = wallet.transactions || [];

  return (
    <div className="p-5">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-yellow-500/20">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">🪙 Your Pi Coin Wallet</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400">Balance</div>
            <div className="text-3xl font-bold text-yellow-400">{wallet.balance}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400">Level</div>
            <div className="text-3xl font-bold text-green-400">{wallet.level}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400">Total Earned</div>
            <div className="text-xl font-bold text-blue-400">{wallet.totalEarned}</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-gray-400">Total Spent</div>
            <div className="text-xl font-bold text-red-400">{wallet.totalSpent}</div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setShowStore(true)}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-600 transition-all"
          >
            Buy Coins
          </button>
          <button
            onClick={() => setShowTransactions(!showTransactions)}
            className="flex-1 bg-slate-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-600 transition-all border border-slate-600"
          >
            {showTransactions ? 'Hide' : 'View'} History
          </button>
        </div>

        {showTransactions && (
          <div className="bg-slate-800/30 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-gray-400">No transactions yet</p>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 10).map((tx: any) => (
                  <div
                    key={tx.id}
                    className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-white">{tx.description}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`font-bold ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                      {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <PiCoinStore
        isOpen={showStore}
        onClose={() => setShowStore(false)}
        userId={userId}
        onPurchaseComplete={() => {
          setShowStore(false);
        }}
      />
    </div>
  );
};
