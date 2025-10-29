
import { FastifyInstance } from "fastify";
import { NewsController } from "./controllers/newsController";
import { NewsAuthorController } from "./controllers/newsAuthorController";

export async function newsModuleRoutes(fastify: FastifyInstance) {
  // News routes
  fastify.get("/", NewsController.getAllNews);
  fastify.get("/:id", NewsController.getNewsById);
  fastify.post("/", NewsController.createNews);
  fastify.put("/:id", NewsController.updateNews);
  fastify.delete("/:id", NewsController.deleteNews);

  // Authors routes
  fastify.get("/authors", NewsAuthorController.getAllAuthors);
  fastify.get("/authors/:id", NewsAuthorController.getAuthorById);
  fastify.post("/authors", NewsAuthorController.createOrUpdateAuthor);
  fastify.post("/authors/:id/collaborate", NewsAuthorController.createCollaborationNews);
  fastify.post("/authors/auto-news", NewsAuthorController.generateAutoNews);
  fastify.post("/authors/initialize", NewsAuthorController.initializeDefaultAuthors);
}
