
import { FastifyInstance } from "fastify";
import { predictionsRoutes } from "@/routes/prediction";
import * as predictionController from "./controllers/predictionController";
import { validatePredictionData } from "./middleware/predictionValidation";

export async function predictionModuleRoutes(fastify: FastifyInstance) {
  // Legacy route support
  await fastify.register(predictionsRoutes, { prefix: "/predictions" });
  
  // New modular routes
  fastify.get("/predictions", predictionController.getPredictions);
  
  fastify.post("/predictions", {
    preHandler: validatePredictionData
  }, predictionController.createPrediction);
  
  fastify.get("/predictions/:id", predictionController.getPredictionById);
}
