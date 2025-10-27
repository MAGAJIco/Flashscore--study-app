
import { FastifyInstance } from "fastify";
import { matchRoutes } from "@/routes/matches";
import * as matchController from "./controllers/matchController";
import { validateMatchData } from "./middleware/matchValidation";

export async function matchModuleRoutes(fastify: FastifyInstance) {
  // Legacy route support
  await fastify.register(matchRoutes);
  
  // New modular routes
  fastify.get("/matches", matchController.getMatches);
  fastify.get("/matches/live", matchController.getLiveMatches);
  
  fastify.post("/matches", {
    preHandler: validateMatchData
  }, matchController.createMatch);
}
