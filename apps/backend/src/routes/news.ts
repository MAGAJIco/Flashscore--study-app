import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { NewsController } from "@/controllers/newsController";

export async function newsRoutes(fastify: FastifyInstance) {
  // Get all news articles
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return NewsController.getAllNews(request as any, reply);
  });

  // Get news by ID
  fastify.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return NewsController.getNewsById(request as any, reply);
  });

  // Create news
  fastify.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return NewsController.createNews(request as any, reply);
  });

  // Update news
  fastify.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return NewsController.updateNews(request as any, reply);
  });

  // Delete news
  fastify.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    return NewsController.deleteNews(request as any, reply);
  });
}
