
import { FastifyInstance } from "fastify";
import * as newsController from "./controllers/newsController";
import * as newsAuthorController from "./controllers/newsAuthorController";

export async function newsModuleRoutes(fastify: FastifyInstance) {
  // News routes
  fastify.get("/news", newsController.getAllNews);
  fastify.get("/news/:id", newsController.getNewsById);
  fastify.post("/news", newsController.createNews);

  // News author routes
  fastify.get("/news-authors", newsAuthorController.getAllAuthors);
  fastify.get("/news-authors/:id", newsAuthorController.getAuthorById);
}
