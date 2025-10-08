import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { predictionService } from '../services/inMemoryPredictionService';

export default async function predictionsRoutes(fastify: FastifyInstance) {
  // Get all predictions
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit = '50' } = request.query as { limit?: string };
      const limitNum = parseInt(limit) || 50;

      const predictions = predictionService.getAllPredictions(limitNum);

      return reply.send({
        success: true,
        data: predictions,
        count: predictions.length,
        modelVersion: 'MagajiCo-v3.0-Advanced'
      });
    } catch (error) {
      fastify.log.error('Error fetching predictions:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch predictions'
      });
    }
  });

  // Get prediction by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const prediction = predictionService.getPredictionById(id);

      if (!prediction) {
        return reply.status(404).send({
          success: false,
          error: 'Prediction not found'
        });
      }

      return reply.send({
        success: true,
        data: prediction
      });
    } catch (error) {
      fastify.log.error('Error fetching prediction:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch prediction'
      });
    }
  });

  // Get statistics
  fastify.get('/stats/overview', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = predictionService.getStatistics();
      return reply.send({
        success: true,
        data: stats
      });
    } catch (error) {
      fastify.log.error('Error fetching statistics:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch statistics'
      });
    }
  });

  // Custom prediction with features
  fastify.post('/custom', async (request: FastifyRequest<{ Body: { features: number[] } }>, reply: FastifyReply) => {
    try {
      const { features } = request.body;

      if (!Array.isArray(features) || features.length !== 7) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid features. Expected array of 7 numbers: [homeForm, awayForm, h2hRatio, homeGoalsFor, homeGoalsAgainst, awayGoalsFor, awayGoalsAgainst]'
        });
      }

      const prediction = predictionService.generateCustomPrediction(features);

      return reply.send({
        success: true,
        data: prediction
      });
    } catch (error) {
      fastify.log.error('Error generating custom prediction:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to generate prediction'
      });
    }
  });
}