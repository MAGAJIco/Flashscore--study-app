
import { FastifyInstance } from "fastify";
import mlPredictionService from "../services/mlPredictionService";
import aiEnhancementService from "../services/aiEnhancementService";

// ML Service Proxy Configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://0.0.0.0:8000";

export async function mlRoutes(server: FastifyInstance) {
  // Proxy endpoint for ML predictions
  server.post("/ml/predict", async (request, reply) => {
    try {
      const { features, matchContext } = request.body as any;

      const response = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features, match_context: matchContext }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`ML service returned ${response.status}`);
      }

      const mlResult = await response.json();
      
      return {
        success: true,
        data: mlResult,
        source: "ml-service",
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || "ML prediction failed"
      });
    }
  });

  // Batch predictions proxy
  server.post("/ml/batch", async (request, reply) => {
    try {
      const { predictions } = request.body as any;

      const response = await fetch(`${ML_SERVICE_URL}/predict/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictions }),
        signal: AbortSignal.timeout(30000)
      });

      const result = await response.json();
      return { success: true, ...result };
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message
      });
    }
  });

  // Model training proxy
  server.post("/ml/train", async (request, reply) => {
    try {
      const { data, labels } = request.body as any;

      const response = await fetch(`${ML_SERVICE_URL}/train`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, labels }),
        signal: AbortSignal.timeout(60000)
      });

      const result = await response.json();
      return { success: true, ...result };
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message
      });
    }
  });

  // ML Prediction endpoint with AI enhancement (original)
  server.post("/predict", async (request, reply) => {
    try {
      const { homeTeam, awayTeam, features, enableAI } = request.body as any;

      if (!homeTeam || !awayTeam || !features) {
        return reply.status(400).send({ 
          error: "Missing required fields: homeTeam, awayTeam, features" 
        });
      }

      const prediction = await mlPredictionService.predictMatch({
        homeTeam,
        awayTeam,
        features
      });

      // Optional AI enhancement
      if (enableAI) {
        const enhanced = await aiEnhancementService.enhancePredictionWithInsights(
          prediction,
          { homeTeam, awayTeam }
        );

        return {
          success: true,
          data: enhanced.prediction,
          aiInsights: enhanced.aiInsights,
          strategicAdvice: enhanced.strategicAdvice,
          magajico: {
            version: "MagajiCo-ML-v2.1-AI",
            ceo_approved: true,
            strategic_level: "executive",
            ai_enhanced: true
          }
        };
      }

      return {
        success: true,
        data: prediction,
        magajico: {
          version: "MagajiCo-ML-v2.0",
          ceo_approved: true,
          strategic_level: "executive"
        }
      };
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || "ML Prediction failed"
      });
    }
  });

  // Strategic Analysis endpoint
  server.post("/strategic-analysis", async (request, reply) => {
    try {
      const { predictions } = request.body as any;

      if (!predictions || !Array.isArray(predictions)) {
        return reply.status(400).send({ 
          error: "Missing predictions array" 
        });
      }

      const analysis = await mlPredictionService.strategicAnalysis(predictions);

      return {
        success: true,
        data: analysis,
        ceo_insights: {
          musk_innovation: analysis.innovationIndex,
          gates_market_position: analysis.filter5Score,
          bezos_long_term: analysis.totalOpportunities,
          ma_risk_management: analysis.riskManagementScore,
          zuckerberg_meta_strategy: analysis.zuckerbergStrategy
        }
      };
    } catch (error: any) {
      server.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error.message || "Strategic Analysis failed"
      });
    }
  });

  // Health check for ML service
  server.get("/ml-status", async (request, reply) => {
    return {
      status: "operational",
      version: "MagajiCo-ML-v2.0",
      ceo_dashboard: "active",
      strategic_intelligence: "online",
      timestamp: new Date().toISOString()
    };
  });
}
