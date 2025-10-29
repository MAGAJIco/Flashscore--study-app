
"use client";

import React from 'react';
import { usePiCoin } from '../../hooks/usePiCoin';

interface PiCoinWalletProps {
  userId: string;
}

export const PiCoinWallet: React.FC<PiCoinWalletProps> = ({ userId }) => {
  const { wallet, loading, error, earnCoins, spendCoins } = usePiCoin(userId);

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

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-2xl">
            🪙
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Pi Coin Wallet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Level {wallet.level}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Balance</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {wallet.balance.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earned</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {wallet.totalEarned.toLocaleString()}
          </p>
        </div>
      </div>

      {wallet.achievements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Achievements</p>
          <div className="flex flex-wrap gap-2">
            {wallet.achievements.map((achievement, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
