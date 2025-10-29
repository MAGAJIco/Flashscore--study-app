
import { FastifyInstance } from "fastify";
import * as newsController from "./controllers/newsController";
import * as newsAuthorController from "./controllers/newsAuthorController";

export async function newsModuleRoutes(fastify: FastifyInstance) {
  // News routes (prefix already applied: /api/news)
  fastify.get("/", newsController.getAllNews);
  fastify.get("/:id", newsController.getNewsById);
  fastify.post("/", newsController.createNews);

  // Authors subroutes
  fastify.get("/authors", newsAuthorController.getAllAuthors);
  fastify.get("/authors/:id", newsAuthorController.getAuthorById);
}
