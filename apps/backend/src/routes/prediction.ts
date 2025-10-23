import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { mlPredictionService, PredictionRequest } from '../services/mlPredictionService.js';
import { aiEnhancementService } from '../services/aiEnhancementService.js';
import { Prediction } from '../models/Predictions.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';

interface PredictRequestBody {
  homeTeam: string;
  awayTeam: string;
  features: number[];
  enableAI?: boolean;
}

// ✅ Named export to match import in main.ts
export async function predictionsRoutes(fastify: FastifyInstance) {
  // 🩺 Health check
  fastify.get('/ml-status', async (_req: FastifyRequest, _rep: FastifyReply) => {
    return {
      status: 'operational',
      version: 'MagajiCo-ML-v2.1',
      timestamp: new Date().toISOString(),
    };
  });

  // 📊 GET all predictions with optional limit
  fastify.get('/', async (req: FastifyRequest<{ Querystring: { limit?: string } }>, rep: FastifyReply) => {
    try {
      const limit = parseInt(req.query.limit || '50');
      const predictions = await Prediction.find()
        .sort({ createdAt: -1 })
        .limit(Math.min(limit, 100));
      
      return {
        success: true,
        data: predictions,
        count: predictions.length
      };
    } catch (error) {
      fastify.log.error(error);
      return rep.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch predictions'
      });
    }
  });

  // 📊 GET single prediction by ID
  fastify.get('/:id', async (req: FastifyRequest<{ Params: { id: string } }>, rep: FastifyReply) => {
    try {
      const prediction = await Prediction.findById(req.params.id);
      
      if (!prediction) {
        return rep.status(404).send({
          success: false,
          error: 'Prediction not found'
        });
      }
      
      return {
        success: true,
        data: prediction
      };
    } catch (error) {
      fastify.log.error(error);
      return rep.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch prediction'
      });
    }
  });

  // ⚽ Single match prediction with optional AI enhancement
  fastify.post('/predict', async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const { homeTeam, awayTeam, features, enableAI } = req.body as PredictRequestBody;

      if (!homeTeam || !awayTeam || !features) {
        return rep.status(400).send({ error: 'Missing required fields' });
      }

      const prediction = await mlPredictionService.predictMatch({
        homeTeam,
        awayTeam,
        features,
      });

      if (enableAI) {
        const enhanced = await aiEnhancementService.enhancePredictionWithInsights(
          prediction,
          { homeTeam, awayTeam },
        );

        return {
          success: true,
          data: enhanced.prediction,
          aiInsights: enhanced.aiInsights,
          strategicAdvice: enhanced.strategicAdvice,
        };
      }

      return { success: true, data: prediction };
    } catch (error) {
      fastify.log.error(error);
      return rep.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'ML Prediction failed',
      });
    }
  });

  // 🧠 Batch prediction endpoint
  fastify.post('/predict/batch', async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const { predictions } = req.body as { predictions: PredictionRequest[] };

      if (!predictions || !Array.isArray(predictions)) {
        return rep.status(400).send({ error: 'Predictions array required' });
      }

      const result = await mlPredictionService.batchPredict(predictions);
      return { success: true, data: result };
    } catch (error) {
      fastify.log.error(error);
      return rep.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Batch prediction failed',
      });
    }
  });
}