
import { FastifyRequest, FastifyReply } from 'fastify';
import { PiWallet } from '../../../models/PiCoin';
import { v4 as uuidv4 } from 'uuid';

export const piCoinController = {
  async getWallet(req: FastifyRequest<{ Params: { userId: string } }>, res: FastifyReply) {
    try {
      const { userId } = req.params;
      
      let wallet = await PiWallet.findOne({ userId });
      
      if (!wallet) {
        wallet = new PiWallet({ userId });
        await wallet.save();
      }

      res.send({ success: true, data: wallet });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch wallet' });
    }
  },

  async earnCoins(req: FastifyRequest<{ 
    Body: { userId: string; amount: number; description: string; metadata?: any } 
  }>, res: FastifyReply) {
    try {
      const { userId, amount, description, metadata } = req.body;

      if (!userId || !amount || !description) {
        return res.status(400).send({ 
          success: false, 
          error: 'userId, amount, and description are required' 
        });
      }

      if (amount <= 0) {
        return res.status(400).send({ 
          success: false, 
          error: 'Amount must be positive' 
        });
      }

      let wallet = await PiWallet.findOne({ userId });
      
      if (!wallet) {
        wallet = new PiWallet({ userId });
      }

      const transaction = {
        id: uuidv4(),
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
      
      // Level up every 1000 coins earned
      wallet.level = Math.floor(wallet.totalEarned / 1000) + 1;

      await wallet.save();

      res.send({ success: true, data: wallet, transaction });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to earn coins' });
    }
  },

  async spendCoins(req: FastifyRequest<{ 
    Body: { userId: string; amount: number; description: string; metadata?: any } 
  }>, res: FastifyReply) {
    try {
      const { userId, amount, description, metadata } = req.body;

      if (!userId || !amount || !description) {
        return res.status(400).send({ 
          success: false, 
          error: 'userId, amount, and description are required' 
        });
      }

      if (amount <= 0) {
        return res.status(400).send({ 
          success: false, 
          error: 'Amount must be positive' 
        });
      }

      const wallet = await PiWallet.findOne({ userId });
      
      if (!wallet) {
        return res.status(404).send({ 
          success: false, 
          error: 'Wallet not found' 
        });
      }

      if (wallet.balance < amount) {
        return res.status(400).send({ 
          success: false, 
          error: 'Insufficient balance' 
        });
      }

      const transaction = {
        id: uuidv4(),
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

      res.send({ success: true, data: wallet, transaction });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to spend coins' });
    }
  },

  async transferCoins(req: FastifyRequest<{ 
    Body: { fromUserId: string; toUserId: string; amount: number; description: string } 
  }>, res: FastifyReply) {
    try {
      const { fromUserId, toUserId, amount, description } = req.body;

      if (!fromUserId || !toUserId || !amount || !description) {
        return res.status(400).send({ 
          success: false, 
          error: 'fromUserId, toUserId, amount, and description are required' 
        });
      }

      if (amount <= 0) {
        return res.status(400).send({ 
          success: false, 
          error: 'Amount must be positive' 
        });
      }

      const fromWallet = await PiWallet.findOne({ userId: fromUserId });
      
      if (!fromWallet) {
        return res.status(404).send({ 
          success: false, 
          error: 'Sender wallet not found' 
        });
      }

      if (fromWallet.balance < amount) {
        return res.status(400).send({ 
          success: false, 
          error: 'Insufficient balance' 
        });
      }

      let toWallet = await PiWallet.findOne({ userId: toUserId });
      
      if (!toWallet) {
        toWallet = new PiWallet({ userId: toUserId });
      }

      const transferId = uuidv4();

      // Deduct from sender
      fromWallet.balance -= amount;
      fromWallet.totalSpent += amount;
      fromWallet.transactions.push({
        id: transferId,
        amount,
        type: 'transfer',
        description: `Transfer to ${toUserId}: ${description}`,
        timestamp: new Date(),
        status: 'completed',
        metadata: { toUserId }
      });

      // Add to receiver
      toWallet.balance += amount;
      toWallet.totalEarned += amount;
      toWallet.transactions.push({
        id: transferId,
        amount,
        type: 'transfer',
        description: `Transfer from ${fromUserId}: ${description}`,
        timestamp: new Date(),
        status: 'completed',
        metadata: { fromUserId }
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

  async getTransactions(req: FastifyRequest<{ 
    Params: { userId: string };
    Querystring: { limit?: string; offset?: string } 
  }>, res: FastifyReply) {
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
        data: { 
          transactions, 
          total: wallet.transactions.length 
        } 
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch transactions' });
    }
  },

  async getLeaderboard(req: FastifyRequest<{ 
    Querystring: { limit?: string; sortBy?: string } 
  }>, res: FastifyReply) {
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

  async addAchievement(req: FastifyRequest<{ 
    Body: { userId: string; achievement: string } 
  }>, res: FastifyReply) {
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
        return res.status(404).send({ 
          success: false, 
          error: 'Wallet not found' 
        });
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
