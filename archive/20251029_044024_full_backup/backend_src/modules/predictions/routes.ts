import { FastifyInstance } from "fastify";
import * as predictionController from "./controllers/predictionController";
import { validatePredictionData } from "./middleware/predictionValidation";
import { 
  getPredictions, 
  createPrediction, 
  getPredictionById,
  enhancedPredict,
  getConfidenceEvolution,
  getMLStatus,
  predict,
  batchPredict,
  getMultiSourcePredictions
} from "./controllers/predictionController";

export async function predictionModuleRoutes(fastify: FastifyInstance) {
  // All routes now in modular system
  fastify.get("/", getPredictions);
  fastify.get("/multi-source", getMultiSourcePredictions);
  fastify.post("/", {
    preHandler: validatePredictionData
  }, createPrediction);

  fastify.get("/:id", getPredictionById);

  // ML-specific routes
  fastify.get("/ml-status", getMLStatus);
  fastify.post("/predict", predict);
  fastify.post("/predict/batch", batchPredict);
}