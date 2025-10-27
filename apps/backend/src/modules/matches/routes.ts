
import { FastifyInstance } from "fastify";
import * as matchController from "./controllers/matchController";
import { validateMatchData } from "./middleware/matchValidation";

export async function matchModuleRoutes(fastify: FastifyInstance) {
  // All routes in modular system
  fastify.get("/", matchController.getMatches);
  fastify.get("/live", matchController.getLiveMatches);
  fastify.get("/upcoming", matchController.getUpcomingMatches);
  fastify.get("/today", matchController.getTodayMatches);
  
  fastify.post("/", {
    preHandler: validateMatchData
  }, matchController.createMatch);
  
  fastify.get("/:id", matchController.getMatchById);
}
