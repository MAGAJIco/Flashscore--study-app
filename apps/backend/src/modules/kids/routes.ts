
import { FastifyInstance } from "fastify";
import { validateKidsMode } from "./middleware/kidsModeValidation";

export async function kidsModuleRoutes(fastify: FastifyInstance) {
  // Apply kids mode validation to all routes
  fastify.addHook('preHandler', validateKidsMode);
  
  fastify.get("/kids/health", async () => {
    return { status: "ok", module: "kids", kidsSafe: true };
  });
}
