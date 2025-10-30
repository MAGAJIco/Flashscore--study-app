
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
  
  // Sports API Integration routes
  const PYTHON_ML_URL = process.env.PYTHON_ML_URL || 'http://localhost:8000';
  
  // Get all live matches from Python ML service
  fastify.get('/matches', async (request, reply) => {
    try {
      const response = await fetch(`${PYTHON_ML_URL}/api/matches`);
      if (!response.ok) throw new Error(`ML Service error: ${response.status}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      fastify.log.error(error.message);
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // Get filtered sports predictions
  fastify.get('/sports/filtered', async (request, reply) => {
    try {
      const { sport = 'all', min_confidence = 75 } = request.query as any;
      const params = new URLSearchParams({ min_confidence: min_confidence.toString() });
      
      const response = await fetch(`${PYTHON_ML_URL}/api/predictions/soccer?${params}`);
      if (!response.ok) throw new Error(`ML Service error: ${response.status}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      fastify.log.error(error.message);
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // Get NFL matches
  fastify.get('/nfl', async (request, reply) => {
    try {
      const response = await fetch(`${PYTHON_ML_URL}/api/espn/nfl`);
      if (!response.ok) throw new Error(`ML Service error: ${response.status}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // Get NBA matches
  fastify.get('/nba', async (request, reply) => {
    try {
      const response = await fetch(`${PYTHON_ML_URL}/api/espn/nba`);
      if (!response.ok) throw new Error(`ML Service error: ${response.status}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });

  // Get MLB matches
  fastify.get('/mlb', async (request, reply) => {
    try {
      const response = await fetch(`${PYTHON_ML_URL}/api/espn/mlb`);
      if (!response.ok) throw new Error(`ML Service error: ${response.status}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  });
}
