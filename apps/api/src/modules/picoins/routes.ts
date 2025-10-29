
import { FastifyInstance } from 'fastify';
import { piCoinController } from './controllers/piCoinController';

export async function piCoinModuleRoutes(fastify: FastifyInstance) {
  // Get wallet
  fastify.get('/wallet/:userId', piCoinController.getWallet);
  
  // Earn coins
  fastify.post('/earn', piCoinController.earnCoins);
  
  // Spend coins
  fastify.post('/spend', piCoinController.spendCoins);
  
  // Transfer coins
  fastify.post('/transfer', piCoinController.transferCoins);
  
  // Get transactions
  fastify.get('/transactions/:userId', piCoinController.getTransactions);
  
  // Get leaderboard
  fastify.get('/leaderboard', piCoinController.getLeaderboard);
  
  // Add achievement
  fastify.post('/achievement', piCoinController.addAchievement);
  
  // Purchase coins
  fastify.post('/purchase', piCoinController.purchaseCoins);
}
