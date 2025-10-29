
import { FastifyInstance } from 'fastify';
import { rewardsController } from './controllers/rewardsController';

export async function rewardsModuleRoutes(fastify: FastifyInstance) {
  // Get user rewards
  fastify.get('/user/:userId', rewardsController.getUserRewards);
  
  // Get achievements
  fastify.get('/achievements', rewardsController.getAchievements);
  
  // Award points
  fastify.post('/award', rewardsController.awardPoints);
  
  // Get leaderboard
  fastify.get('/leaderboard', rewardsController.getLeaderboard);
}
