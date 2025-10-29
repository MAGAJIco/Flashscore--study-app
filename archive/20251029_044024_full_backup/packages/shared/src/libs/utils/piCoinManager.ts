// src/utils/piCoinManager.ts
export interface PiTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend' | 'transfer';
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
}

export interface PiWallet {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: PiTransaction[];
  level: number;
  achievements: string[];
}

class PiCoinManager {
  private static instance: PiCoinManager;
  private wallets: Map<string, PiWallet> = new Map();
  private transactionRateLimit: Map<string, number[]> = new Map();
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_TRANSACTIONS_PER_MINUTE = 10;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): PiCoinManager {
    if (!PiCoinManager.instance) {
      PiCoinManager.instance = new PiCoinManager();
    }
    return PiCoinManager.instance;
  }

  private async loadFromStorage(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('piCoinWallets');
        if (stored) {
          const data = JSON.parse(stored);
          // Convert timestamp strings back to Date objects
          Object.values(data).forEach((wallet: any) => {
            wallet.transactions.forEach((transaction: any) => {
              transaction.timestamp = new Date(transaction.timestamp);
            });
          });
          this.wallets = new Map(Object.entries(data));
        }
      }
    } catch (error) {
      console.error('Error loading Pi Coin data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const walletsObj = Object.fromEntries(this.wallets);
        localStorage.setItem('piCoinWallets', JSON.stringify(walletsObj));
      }
    } catch (error) {
      console.error('Error saving Pi Coin data:', error);
    }
  }

  private isRateLimited(userId: string): boolean {
    const now = Date.now();
    const userTransactions = this.transactionRateLimit.get(userId) || [];

    // Remove old transactions outside the window
    const recentTransactions = userTransactions.filter(
      timestamp => now - timestamp < this.RATE_LIMIT_WINDOW
    );

    this.transactionRateLimit.set(userId, recentTransactions);

    return recentTransactions.length >= this.MAX_TRANSACTIONS_PER_MINUTE;
  }

  private addTransactionTimestamp(userId: string): void {
    const timestamps = this.transactionRateLimit.get(userId) || [];
    timestamps.push(Date.now());
    this.transactionRateLimit.set(userId, timestamps);
  }

  public createWallet(userId: string): PiWallet {
    if (this.wallets.has(userId)) {
      return this.wallets.get(userId)!;
    }

    const wallet: PiWallet = {
      userId,
      balance: 50, // Welcome bonus
      totalEarned: 50,
      totalSpent: 0,
      transactions: [{
        id: this.generateTransactionId(),
        userId,
        amount: 50,
        type: 'earn',
        description: 'Welcome bonus',
        timestamp: new Date(),
        status: 'completed'
      }],
      level: 1,
      achievements: ['new_user']
    };

    this.wallets.set(userId, wallet);
    this.saveToStorage();
    return wallet;
  }

  public getWallet(userId: string): PiWallet | null {
    return this.wallets.get(userId) || null;
  }

  public earnCoins(userId: string, amount: number, description: string, metadata?: any): boolean {
    if (amount <= 0) return false;

    if (this.isRateLimited(userId)) {
      console.warn('Transaction rate limit exceeded for user:', userId);
      return false;
    }

    const wallet = this.wallets.get(userId);
    if (!wallet) {
      console.warn('Wallet not found for user:', userId);
      return false;
    }

    const transaction: PiTransaction = {
      id: this.generateTransactionId(),
      userId,
      amount,
      type: 'earn',
      description,
      timestamp: new Date(),
      status: 'completed',
      metadata
    };

    wallet.balance += amount;
    wallet.totalEarned += amount;
    wallet.transactions.push(transaction);

    // Level up logic
    this.checkLevelUp(wallet);

    this.addTransactionTimestamp(userId);
    this.saveToStorage();
    return true;
  }

  public spendCoins(userId: string, amount: number, description: string, metadata?: any): boolean {
    if (amount <= 0) return false;

    if (this.isRateLimited(userId)) {
      console.warn('Transaction rate limit exceeded for user:', userId);
      return false;
    }

    const wallet = this.wallets.get(userId);
    if (!wallet || wallet.balance < amount) {
      console.warn('Insufficient balance or wallet not found for user:', userId);
      return false;
    }

    const transaction: PiTransaction = {
      id: this.generateTransactionId(),
      userId,
      amount,
      type: 'spend',
      description,
      timestamp: new Date(),
      status: 'completed',
      metadata
    };

    wallet.balance -= amount;
    wallet.totalSpent += amount;
    wallet.transactions.push(transaction);

    this.addTransactionTimestamp(userId);
    this.saveToStorage();
    return true;
  }

  public transferCoins(fromUserId: string, toUserId: string, amount: number, description: string): boolean {
    if (amount <= 0) return false;

    if (this.isRateLimited(fromUserId) || this.isRateLimited(toUserId)) {
      console.warn('Rate limit exceeded for transfer between users:', fromUserId, toUserId);
      return false;
    }

    const fromWallet = this.wallets.get(fromUserId);
    const toWallet = this.wallets.get(toUserId);

    if (!fromWallet || !toWallet) {
      console.warn('One or both wallets not found');
      return false;
    }

    if (fromWallet.balance < amount) {
      console.warn('Insufficient balance for transfer');
      return false;
    }

    // Ensure recipient has a wallet
    if (!this.wallets.has(toUserId)) {
      this.createWallet(toUserId);
    }

    const transferId = this.generateTransactionId();

    // Debit transaction
    const debitTransaction: PiTransaction = {
      id: transferId + '_debit',
      userId: fromUserId,
      amount,
      type: 'transfer',
      description: `Transfer to ${toUserId}: ${description}`,
      timestamp: new Date(),
      status: 'completed',
      metadata: { transferTo: toUserId, transferId }
    };

    // Credit transaction
    const creditTransaction: PiTransaction = {
      id: transferId + '_credit',
      userId: toUserId,
      amount,
      type: 'earn',
      description: `Transfer from ${fromUserId}: ${description}`,
      timestamp: new Date(),
      status: 'completed',
      metadata: { transferFrom: fromUserId, transferId }
    };

    fromWallet.balance -= amount;
    fromWallet.totalSpent += amount;
    fromWallet.transactions.push(debitTransaction);

    toWallet.balance += amount;
    toWallet.totalEarned += amount;
    toWallet.transactions.push(creditTransaction);

    // Check level up for recipient
    this.checkLevelUp(toWallet);

    this.addTransactionTimestamp(fromUserId);
    this.addTransactionTimestamp(toUserId);
    this.saveToStorage();
    return true;
  }

  private checkLevelUp(wallet: PiWallet): void {
    const nextLevelThreshold = wallet.level * 100;
    if (wallet.totalEarned >= nextLevelThreshold) {
      wallet.level += 1;
      wallet.achievements.push(`level_${wallet.level}`);

      // Award level up bonus
      this.earnCoins(wallet.userId, wallet.level * 10, `Level ${wallet.level} achievement bonus`);
    }
  }

  public getTransactionHistory(userId: string, limit: number = 50): PiTransaction[] {
    const wallet = this.wallets.get(userId);
    if (!wallet) return [];

    return wallet.transactions
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getLeaderboard(limit: number = 10): Array<{userId: string, balance: number, level: number, totalEarned: number}> {
    return Array.from(this.wallets.values())
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit)
      .map(wallet => ({
        userId: wallet.userId,
        balance: wallet.balance,
        level: wallet.level,
        totalEarned: wallet.totalEarned
      }));
  }

  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 15);
    return btoa(timestamp + random).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  public validateTransaction(transactionId: string, userId: string): boolean {
    const wallet = this.wallets.get(userId);
    if (!wallet) return false;

    return wallet.transactions.some(t => t.id === transactionId);
  }

  public getTotalSupply(): number {
    return Array.from(this.wallets.values())
      .reduce((total, wallet) => total + wallet.balance, 0);
  }

  public getActiveUsersCount(): number {
    return this.wallets.size;
  }

  public exportWalletData(userId: string): string | null {
    const wallet = this.wallets.get(userId);
    if (!wallet) return null;

    return JSON.stringify(wallet, null, 2);
  }

  public importWalletData(userId: string, data: string): boolean {
    try {
      const walletData = JSON.parse(data) as PiWallet;
      if (walletData.userId !== userId) return false;

      // Convert timestamp strings back to Date objects
      walletData.transactions.forEach(transaction => {
        transaction.timestamp = new Date(transaction.timestamp);
      });

      this.wallets.set(userId, walletData);
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing wallet data:', error);
      return false;
    }
  }

  // Purchase Pi Coins (for store purchases)
  public purchasePiCoins(userId: string, amount: number, paymentMethod: string, metadata?: any): boolean {
    return this.earnCoins(userId, amount, `Purchased ${amount} Pi Coins via ${paymentMethod}`, {
      type: 'purchase',
      paymentMethod,
      ...metadata
    });
  }

  // Get balance for a user
  public getBalance(userId: string): any {
    const wallet = this.wallets.get(userId);
    if (!wallet) {
      return this.createWallet(userId);
    }
    return {
      userId: wallet.userId,
      balance: wallet.balance,
      totalEarned: wallet.totalEarned,
      lastUpdated: new Date()
    };
  }

  // Get transactions for a user
  public getTransactions(userId: string): PiTransaction[] {
    return this.getTransactionHistory(userId);
  }

  // Utility method to reset wallet (for testing)
  public resetWallet(userId: string): boolean {
    if (this.wallets.has(userId)) {
      this.wallets.delete(userId);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Get transaction rate info for a user
  public getTransactionRateInfo(userId: string): {
    recentTransactions: number;
    maxTransactions: number;
    rateLimitWindow: number;
    isLimited: boolean;
    remainingTransactions: number;
  } {
    const now = Date.now();
    const userTransactions = this.transactionRateLimit.get(userId) || [];
    
    // Count recent transactions within the window
    const recentTransactions = userTransactions.filter(
      timestamp => now - timestamp < this.RATE_LIMIT_WINDOW
    );

    return {
      recentTransactions: recentTransactions.length,
      maxTransactions: this.MAX_TRANSACTIONS_PER_MINUTE,
      rateLimitWindow: this.RATE_LIMIT_WINDOW,
      isLimited: recentTransactions.length >= this.MAX_TRANSACTIONS_PER_MINUTE,
      remainingTransactions: Math.max(0, this.MAX_TRANSACTIONS_PER_MINUTE - recentTransactions.length)
    };
  }

  // Add a transaction with explicit rate limit checking
  public addTransaction(userId: string, amount: number, type: 'earn' | 'spend' | 'transfer', description: string, metadata?: any): boolean {
    if (type === 'earn') {
      return this.earnCoins(userId, amount, description, metadata);
    } else if (type === 'spend') {
      return this.spendCoins(userId, amount, description, metadata);
    }
    return false;
  }
}

// Export class and instance
export { PiCoinManager };
export const piCoinManagerInstance = PiCoinManager.getInstance();