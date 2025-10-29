
import { FastifyInstance } from "fastify";
import * as socialController from "./controllers/socialController";

export async function socialModuleRoutes(fastify: FastifyInstance) {
  fastify.get("/social/health", async () => {
    return { status: "ok", module: "social" };
  });
  
  fastify.get("/social/feed", socialController.getSocialFeed);
  fastify.post("/social/posts", socialController.createPost);
}
