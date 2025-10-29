
import { FastifyRequest, FastifyReply } from 'fastify';
import { PiWallet } from '../../../models/PiCoin';

const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_TRANSACTIONS_PER_MINUTE = 10;

interface TransactionRequest {
  userId: string;
  amount: number;
  description: string;
  metadata?: any;
}

interface TransferRequest {
  fromUserId: string;
  toUserId: string;
  amount: number;
  description: string;
}

export const piCoinController = {
  async getWallet(req: FastifyRequest<{ Params: { userId: string } }>, res: FastifyReply) {
    try {
      const { userId } = req.params;
      
      let wallet = await PiWallet.findOne({ userId });
      
      if (!wallet) {
        wallet = new PiWallet({
          userId,
          balance: 50,
          totalEarned: 50,
          totalSpent: 0,
          transactions: [{
            id: generateTransactionId(),
            amount: 50,
            type: 'earn',
            description: 'Welcome bonus',
            timestamp: new Date(),
            status: 'completed'
          }],
          level: 1,
          achievements: ['new_user']
        });
        
        await wallet.save();
      }
      
      res.send({
        success: true,
        data: {
          userId: wallet.userId,
          balance: wallet.balance,
          totalEarned: wallet.totalEarned,
          totalSpent: wallet.totalSpent,
          level: wallet.level,
          achievements: wallet.achievements
        }
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch wallet' });
    }
  },

  async earnCoins(req: FastifyRequest<{ Body: TransactionRequest }>, res: FastifyReply) {
    try {
      const { userId, amount, description, metadata } = req.body;
      
      if (!userId || !amount || !description) {
        return res.status(400).send({ 
          success: false, 
          error: 'userId, amount, and description are required' 
        });
      }

      if (amount <= 0) {
        return res.status(400).send({ success: false, error: 'Amount must be positive' });
      }

      let wallet = await PiWallet.findOne({ userId });
      if (!wallet) {
        wallet = new PiWallet({ userId });
      }

      if (isRateLimited(wallet)) {
        return res.status(429).send({ success: false, error: 'Rate limit exceeded' });
      }

      const transaction = {
        id: generateTransactionId(),
        amount,
        type: 'earn' as const,
        description,
        timestamp: new Date(),
        status: 'completed' as const,
        metadata
      };

      wallet.balance += amount;
      wallet.totalEarned += amount;
      wallet.transactions.push(transaction);

      const nextLevelThreshold = wallet.level * 100;
      if (wallet.totalEarned >= nextLevelThreshold) {
        wallet.level += 1;
        wallet.achievements.push(`level_${wallet.level}`);
        
        const bonusAmount = wallet.level * 10;
        wallet.balance += bonusAmount;
        wallet.totalEarned += bonusAmount;
        wallet.transactions.push({
          id: generateTransactionId(),
          amount: bonusAmount,
          type: 'earn',
          description: `Level ${wallet.level} achievement bonus`,
          timestamp: new Date(),
          status: 'completed'
        });
      }

      await wallet.save();

      res.send({
        success: true,
        data: wallet,
        transaction
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to earn coins' });
    }
  },

  async spendCoins(req: FastifyRequest<{ Body: TransactionRequest }>, res: FastifyReply) {
    try {
      const { userId, amount, description, metadata } = req.body;
      
      if (!userId || !amount || !description) {
        return res.status(400).send({ 
          success: false, 
          error: 'userId, amount, and description are required' 
        });
      }

      if (amount <= 0) {
        return res.status(400).send({ success: false, error: 'Amount must be positive' });
      }

      const wallet = await PiWallet.findOne({ userId });
      if (!wallet) {
        return res.status(404).send({ success: false, error: 'Wallet not found' });
      }

      if (wallet.balance < amount) {
        return res.status(400).send({ success: false, error: 'Insufficient balance' });
      }

      if (isRateLimited(wallet)) {
        return res.status(429).send({ success: false, error: 'Rate limit exceeded' });
      }

      const transaction = {
        id: generateTransactionId(),
        amount,
        type: 'spend' as const,
        description,
        timestamp: new Date(),
        status: 'completed' as const,
        metadata
      };

      wallet.balance -= amount;
      wallet.totalSpent += amount;
      wallet.transactions.push(transaction);

      await wallet.save();

      res.send({
        success: true,
        data: wallet,
        transaction
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to spend coins' });
    }
  },

  async transferCoins(req: FastifyRequest<{ Body: TransferRequest }>, res: FastifyReply) {
    try {
      const { fromUserId, toUserId, amount, description } = req.body;
      
      if (!fromUserId || !toUserId || !amount || !description) {
        return res.status(400).send({ 
          success: false, 
          error: 'fromUserId, toUserId, amount, and description are required' 
        });
      }

      if (amount <= 0) {
        return res.status(400).send({ success: false, error: 'Amount must be positive' });
      }

      const fromWallet = await PiWallet.findOne({ userId: fromUserId });
      if (!fromWallet) {
        return res.status(404).send({ success: false, error: 'Sender wallet not found' });
      }

      if (fromWallet.balance < amount) {
        return res.status(400).send({ success: false, error: 'Insufficient balance' });
      }

      if (isRateLimited(fromWallet)) {
        return res.status(429).send({ success: false, error: 'Rate limit exceeded' });
      }

      let toWallet = await PiWallet.findOne({ userId: toUserId });
      if (!toWallet) {
        toWallet = new PiWallet({ userId: toUserId });
      }

      const transferId = generateTransactionId();

      fromWallet.balance -= amount;
      fromWallet.totalSpent += amount;
      fromWallet.transactions.push({
        id: transferId + '_debit',
        amount,
        type: 'transfer',
        description: `Transfer to ${toUserId}: ${description}`,
        timestamp: new Date(),
        status: 'completed',
        metadata: { toUserId, transferId }
      });

      toWallet.balance += amount;
      toWallet.totalEarned += amount;
      toWallet.transactions.push({
        id: transferId + '_credit',
        amount,
        type: 'transfer',
        description: `Transfer from ${fromUserId}: ${description}`,
        timestamp: new Date(),
        status: 'completed',
        metadata: { fromUserId, transferId }
      });

      await fromWallet.save();
      await toWallet.save();

      res.send({
        success: true,
        data: { fromWallet, toWallet },
        transferId
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to transfer coins' });
    }
  },



  async purchaseCoins(req: FastifyRequest<{ Body: { userId: string; amount: number; paymentMethod: string; paymentId?: string; metadata?: any } }>, res: FastifyReply) {
    try {
      const { userId, amount, paymentMethod, paymentId, metadata } = req.body;
      
      if (!userId || !amount || !paymentMethod) {
        return res.status(400).send({ 
          success: false, 
          error: 'userId, amount, and paymentMethod are required' 
        });
      }

      if (amount <= 0) {
        return res.status(400).send({ success: false, error: 'Amount must be positive' });
      }

      let wallet = await PiWallet.findOne({ userId });
      if (!wallet) {
        wallet = new PiWallet({ userId });
      }

      const transaction = {
        id: generateTransactionId(),
        amount,
        type: 'earn' as const,
        description: `Purchased ${amount} Pi Coins via ${paymentMethod}`,
        timestamp: new Date(),
        status: 'completed' as const,
        metadata: {
          paymentMethod,
          paymentId,
          ...metadata
        }
      };

      wallet.balance += amount;
      wallet.totalEarned += amount;
      wallet.transactions.push(transaction);

      await wallet.save();

      res.send({
        success: true,
        data: wallet,
        transaction
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to purchase coins' });
    }
  }
};

  async getTransactions(req: FastifyRequest<{ Params: { userId: string }; Querystring: { limit?: string; offset?: string } }>, res: FastifyReply) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit || '50');
      const offset = parseInt(req.query.offset || '0');

      const wallet = await PiWallet.findOne({ userId });
      if (!wallet) {
        return res.send({ success: true, data: { transactions: [], total: 0 } });
      }

      const transactions = wallet.transactions
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(offset, offset + limit);

      res.send({
        success: true,
        data: { transactions, total: wallet.transactions.length }
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch transactions' });
    }
  },

  async getLeaderboard(req: FastifyRequest<{ Querystring: { limit?: string; sortBy?: string } }>, res: FastifyReply) {
    try {
      const limit = parseInt(req.query.limit || '100');
      const sortBy = req.query.sortBy || 'balance';
      const sortField = sortBy === 'earned' ? 'totalEarned' : 'balance';

      const leaderboard = await PiWallet.find()
        .sort({ [sortField]: -1 })
        .limit(limit)
        .select('userId balance totalEarned totalSpent level achievements');

      res.send({ success: true, data: leaderboard });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch leaderboard' });
    }
  },

  async addAchievement(req: FastifyRequest<{ Body: { userId: string; achievement: string } }>, res: FastifyReply) {
    try {
      const { userId, achievement } = req.body;

      if (!userId || !achievement) {
        return res.status(400).send({ 
          success: false, 
          error: 'userId and achievement are required' 
        });
      }

      const wallet = await PiWallet.findOne({ userId });
      if (!wallet) {
        return res.status(404).send({ success: false, error: 'Wallet not found' });
      }

      if (!wallet.achievements.includes(achievement)) {
        wallet.achievements.push(achievement);
        await wallet.save();
      }

      res.send({ success: true, data: wallet });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to add achievement' });
    }
  }
};

function generateTransactionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return Buffer.from(timestamp + random).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
}

function isRateLimited(wallet: any): boolean {
  const now = Date.now();
  const recentTransactions = wallet.transactions.filter((t: any) => 
    now - t.timestamp.getTime() < RATE_LIMIT_WINDOW
  );
  return recentTransactions.length >= MAX_TRANSACTIONS_PER_MINUTE;
}
