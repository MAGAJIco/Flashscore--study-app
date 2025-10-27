
import { FastifyInstance } from "fastify";
import * as rewardsController from "./controllers/rewardsController";

export async function rewardsModuleRoutes(fastify: FastifyInstance) {
  fastify.get("/rewards/health", async () => {
    return { status: "ok", module: "rewards" };
  });
  
  fastify.get("/rewards/achievements", rewardsController.getAchievements);
  fastify.get("/rewards/coins/:userId", rewardsController.getUserCoins);
}
