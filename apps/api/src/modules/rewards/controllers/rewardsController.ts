
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserReward } from '../../../models/UserReward';

export const rewardsController = {
  async getUserRewards(req: FastifyRequest<{ Params: { userId: string } }>, res: FastifyReply) {
    try {
      let reward = await UserReward.findOne({ userId: req.params.userId });
      
      if (!reward) {
        reward = new UserReward({ userId: req.params.userId });
        await reward.save();
      }
      
      res.send({ success: true, data: reward });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch rewards' });
    }
  },

  async getAchievements(req: FastifyRequest, res: FastifyReply) {
    const achievements = [
      { id: 1, name: 'First Prediction', description: 'Make your first prediction', points: 10 },
      { id: 2, name: 'Prediction Master', description: '10 correct predictions', points: 50 },
      { id: 3, name: 'Week Warrior', description: '7 day streak', points: 100 },
      { id: 4, name: 'ML Explorer', description: 'Use ML predictions 5 times', points: 25 },
    ];
    
    res.send({ success: true, data: achievements });
  },

  async awardPoints(req: FastifyRequest<{ Body: { userId: string; points: number; reason: string } }>, res: FastifyReply) {
    try {
      const { userId, points, reason } = req.body;
      
      let reward = await UserReward.findOne({ userId });
      
      if (!reward) {
        reward = new UserReward({ userId });
      }
      
      reward.totalPoints += points;
      reward.achievements.push({ name: reason, earnedAt: new Date() });
      await reward.save();
      
      res.send({ success: true, data: reward });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to award points' });
    }
  },

  async getLeaderboard(req: FastifyRequest, res: FastifyReply) {
    try {
      const leaderboard = await UserReward.find()
        .sort({ totalPoints: -1 })
        .limit(100)
        .select('userId totalPoints achievements');
      
      res.send({ success: true, data: leaderboard });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch leaderboard' });
    }
  }
};
