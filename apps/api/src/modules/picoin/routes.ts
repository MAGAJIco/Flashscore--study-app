
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
  
  // Get transaction history
  fastify.get('/transactions/:userId', piCoinController.getTransactions);
  
  // Get leaderboard
  fastify.get('/leaderboard', piCoinController.getLeaderboard);
  
  // Purchase coins
  fastify.post('/purchase', piCoinController.purchaseCoins);
}
