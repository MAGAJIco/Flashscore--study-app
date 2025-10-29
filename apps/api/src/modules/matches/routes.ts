
import { FastifyInstance } from 'fastify';
import { matchController } from './controllers/matchController';

export async function matchesModuleRoutes(fastify: FastifyInstance) {
  // Get all matches
  fastify.get('/', matchController.getAllMatches);
  
  // Get live matches
  fastify.get('/live', matchController.getLiveMatches);
  
  // Get upcoming matches
  fastify.get('/upcoming', matchController.getUpcomingMatches);
  
  // Get match by ID
  fastify.get('/:id', matchController.getMatchById);
  
  // Create match (admin)
  fastify.post('/', matchController.createMatch);
  
  // Update match (admin)
  fastify.put('/:id', matchController.updateMatch);
}
