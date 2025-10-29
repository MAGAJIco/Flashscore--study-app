
import { FastifyRequest, FastifyReply } from "fastify";
import { predictionService } from "../services/predictionService";

export const getPredictions = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const predictions = await predictionService.getAllPredictions();
    return reply.send({ success: true, data: predictions });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch predictions" });
  }
};

export const createPrediction = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const prediction = await predictionService.createPrediction(request.body);
    reply.status(201).send({ success: true, data: prediction });
  } catch (err) {
    reply.status(400).send({ error: "Failed to create prediction" });
  }
};

export const getPredictionById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const prediction = await predictionService.getPredictionById(request.params.id);
    if (!prediction) {
      return reply.status(404).send({ error: "Prediction not found" });
    }
    return reply.send({ success: true, data: prediction });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch prediction" });
  }
};

export const enhancedPredict = async (
  request: FastifyRequest<{ Body: { features: number[]; enableAI?: boolean } }>,
  reply: FastifyReply
) => {
  try {
    const { features, enableAI } = request.body;
    const result = await predictionService.predictWithML(features);
    
    return reply.send({
      success: true,
      data: result,
      enhanced: enableAI || false
    });
  } catch (err) {
    reply.status(500).send({ error: "Prediction failed" });
  }
};

export const getConfidenceEvolution = async (
  request: FastifyRequest<{ Params: { predictionId: string } }>,
  reply: FastifyReply
) => {
  try {
    // This would integrate with confidence evolution service
    return reply.send({
      success: true,
      message: "Confidence evolution tracking",
      predictionId: request.params.predictionId
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch confidence evolution" });
  }
};

export const getMLStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';
    const mlResponse = await fetch(`${ML_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(3000)
    }).catch(() => null);

    const isHealthy = mlResponse?.ok ?? false;
    const statusCode = isHealthy ? 200 : 503;

    return reply.status(statusCode).send({
      status: isHealthy ? "operational" : "degraded",
      version: "MagajiCo-ML-v2.0",
      ceo_dashboard: isHealthy ? "active" : "unavailable",
      strategic_intelligence: isHealthy ? "online" : "offline",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return reply.status(503).send({
      status: "error",
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
};

export const predict = async (
  request: FastifyRequest<{ Body: { homeTeam: string; awayTeam: string; features: number[]; enableAI?: boolean } }>,
  reply: FastifyReply
) => {
  try {
    const { homeTeam, awayTeam, features, enableAI } = request.body;

    if (!homeTeam || !awayTeam || !features) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }

    const result = await predictionService.predictWithML(features, homeTeam, awayTeam);
    
    return reply.send({
      success: true,
      data: result,
      enhanced: enableAI || false,
      source: result.source || 'ml'
    });
  } catch (err) {
    reply.status(500).send({ error: "Prediction failed" });
  }
};

export const batchPredict = async (
  request: FastifyRequest<{ Body: { predictions: Array<{ homeTeam: string; awayTeam: string; features: number[] }> } }>,
  reply: FastifyReply
) => {
  try {
    const { predictions } = request.body;

    if (!predictions || !Array.isArray(predictions)) {
      return reply.status(400).send({ error: 'Predictions array required' });
    }

    const results = await Promise.all(
      predictions.map(pred => predictionService.predictWithML(pred.features))
    );
    
    return reply.send({
      success: true,
      data: results
    });
  } catch (err) {
    reply.status(500).send({ error: "Batch prediction failed" });
  }
};

export const getMultiSourcePredictions = async (
  request: FastifyRequest<{ Querystring: { limit?: string } }>,
  reply: FastifyReply
) => {
  try {
    const { multiSourcePredictionService } = await import('../services/multiSourcePredictionService');
    const limit = parseInt(request.query.limit || '50');
    
    const predictions = await multiSourcePredictionService.aggregatePredictions(limit);
    
    return reply.send({
      success: true,
      data: predictions,
      meta: {
        total: predictions.length,
        sources: ['ml', 'scraper', 'database'],
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Multi-source predictions error:', err);
    reply.status(500).send({ error: "Failed to aggregate predictions" });
  }
};
