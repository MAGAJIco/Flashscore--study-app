
import { FastifyInstance } from 'fastify';
import { predictionController } from './controllers/predictionController';

export async function predictionsModuleRoutes(fastify: FastifyInstance) {
  // Get all predictions
  fastify.get('/', predictionController.getAllPredictions);
  
  // Get prediction by ID
  fastify.get('/:id', predictionController.getPredictionById);
  
  // Create prediction
  fastify.post('/', predictionController.createPrediction);
  
  // ML prediction endpoint
  fastify.post('/predict', predictionController.mlPredict);
  
  // Batch predictions
  fastify.post('/predict/batch', predictionController.batchPredict);
  
  // ML status check
  fastify.get('/ml/status', predictionController.mlStatus);
}
