
import { UserManager } from '@magajico/shared/utils';

interface PiCoinTransaction {
  amount: number;
  type: 'earn' | 'spend' | 'bonus';
  description: string;
  timestamp: Date;
}

class PiCoinManagerClass {
  private balance: number = 0;
  private transactions: PiCoinTransaction[] = [];

  async getBalance(userId?: string): Promise<number> {
    if (typeof window === 'undefined') return 0;
    
    try {
      const stored = localStorage.getItem(`picoin_balance_${userId || 'guest'}`);
      this.balance = stored ? parseInt(stored, 10) : 0;
      return this.balance;
    } catch {
      return 0;
    }
  }

  async addCoins(amount: number, description: string, userId?: string): Promise<number> {
    if (typeof window === 'undefined') return 0;
    
    this.balance += amount;
    this.transactions.push({
      amount,
      type: 'earn',
      description,
      timestamp: new Date()
    });
    
    try {
      localStorage.setItem(`picoin_balance_${userId || 'guest'}`, this.balance.toString());
    } catch {}
    
    return this.balance;
  }

  async spendCoins(amount: number, description: string, userId?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    if (this.balance < amount) return false;
    
    this.balance -= amount;
    this.transactions.push({
      amount: -amount,
      type: 'spend',
      description,
      timestamp: new Date()
    });
    
    try {
      localStorage.setItem(`picoin_balance_${userId || 'guest'}`, this.balance.toString());
    } catch {}
    
    return true;
  }

  getTransactions(): PiCoinTransaction[] {
    return [...this.transactions];
  }
}

const PiCoinManager = new PiCoinManagerClass();
export { PiCoinManager };
export default PiCoinManager;
