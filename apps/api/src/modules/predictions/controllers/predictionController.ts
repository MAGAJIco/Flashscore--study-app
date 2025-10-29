
import { FastifyRequest, FastifyReply } from 'fastify';
import { Prediction } from '../../../models/Prediction';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';

export const predictionController = {
  async getAllPredictions(req: FastifyRequest, res: FastifyReply) {
    try {
      const predictions = await Prediction.find()
        .sort({ createdAt: -1 })
        .limit(100);
      
      res.send({ success: true, data: predictions, count: predictions.length });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch predictions' });
    }
  },

  async getPredictionById(req: FastifyRequest<{ Params: { id: string } }>, res: FastifyReply) {
    try {
      const prediction = await Prediction.findById(req.params.id);
      
      if (!prediction) {
        return res.status(404).send({ success: false, error: 'Prediction not found' });
      }
      
      res.send({ success: true, data: prediction });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch prediction' });
    }
  },

  async createPrediction(req: FastifyRequest, res: FastifyReply) {
    try {
      const prediction = new Prediction(req.body);
      await prediction.save();
      
      res.status(201).send({ success: true, data: prediction });
    } catch (error) {
      req.log.error(error);
      res.status(400).send({ success: false, error: 'Failed to create prediction' });
    }
  },

  async mlPredict(req: FastifyRequest<{ Body: { features: number[]; homeTeam?: string; awayTeam?: string } }>, res: FastifyReply) {
    try {
      const { features, homeTeam, awayTeam } = req.body;

      if (!features || features.length < 7) {
        return res.status(400).send({ success: false, error: 'At least 7 features required' });
      }

      // Call ML service
      const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features, match_context: { homeTeam, awayTeam } })
      });

      if (!mlResponse.ok) {
        throw new Error('ML service unavailable');
      }

      const mlData = await mlResponse.json();

      res.send({
        success: true,
        data: {
          prediction: mlData.prediction,
          confidence: mlData.confidence,
          probabilities: mlData.probabilities,
          model_version: mlData.model_version,
          source: 'ml'
        }
      });
    } catch (error) {
      req.log.error(error);
      
      // Fallback to rule-based prediction
      const { features } = req.body;
      const prediction = features[0] > features[1] ? 'home' : 'away';
      
      res.send({
        success: true,
        data: {
          prediction,
          confidence: 60,
          probabilities: {
            home: features[0] > features[1] ? 55 : 25,
            draw: 20,
            away: features[0] > features[1] ? 25 : 55
          },
          model_version: 'rule-based-v1',
          source: 'fallback'
        }
      });
    }
  },

  async batchPredict(req: FastifyRequest<{ Body: { predictions: any[] } }>, res: FastifyReply) {
    try {
      const { predictions } = req.body;

      const mlResponse = await fetch(`${ML_SERVICE_URL}/predict/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictions })
      });

      if (!mlResponse.ok) {
        throw new Error('ML service unavailable');
      }

      const mlData = await mlResponse.json();

      res.send({ success: true, data: mlData });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Batch prediction failed' });
    }
  },

  async mlStatus(req: FastifyRequest, res: FastifyReply) {
    try {
      const mlResponse = await fetch(`${ML_SERVICE_URL}/health`, {
        signal: AbortSignal.timeout(3000)
      });

      const isHealthy = mlResponse.ok;

      res.send({
        status: isHealthy ? 'operational' : 'degraded',
        ml_service: isHealthy ? 'online' : 'offline',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).send({
        status: 'error',
        ml_service: 'offline',
        timestamp: new Date().toISOString()
      });
    }
  }
};
