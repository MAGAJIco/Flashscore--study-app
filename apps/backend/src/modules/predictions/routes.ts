
import { FastifyInstance } from "fastify";
import * as predictionController from "./controllers/predictionController";
import { validatePredictionData } from "./middleware/predictionValidation";

export async function predictionModuleRoutes(fastify: FastifyInstance) {
  // All routes now in modular system
  fastify.get("/", predictionController.getPredictions);
  
  fastify.post("/", {
    preHandler: validatePredictionData
  }, predictionController.createPrediction);
  
  fastify.get("/:id", predictionController.getPredictionById);
  
  // ML-specific routes
  fastify.get("/ml-status", predictionController.getMLStatus);
  fastify.post("/predict", predictionController.predict);
  fastify.post("/predict/batch", predictionController.batchPredict);
}
