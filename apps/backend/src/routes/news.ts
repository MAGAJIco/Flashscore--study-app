import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { News } from "@/models";

// Define body type for creating news
interface CreateNewsBody {
  title: string;
  content: string;
  preview: string;
  author?: string;
  publishedAt?: Date;
}

export async function newsRoutes(fastify: FastifyInstance) {
  // 📰 Create news
  fastify.post(
    "/",
    async (request: FastifyRequest<{ Body: CreateNewsBody }>, reply: FastifyReply) => {
      try {
        const news = new News(request.body);
        await news.save();
        return reply.status(201).send(news);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create news";
        return reply.status(400).send({ error: message });
      }
    },
  );

  // 🗞️ Get all news
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const news = await News.find().sort({ publishedAt: -1 });
      return reply.send(news);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch news";
      return reply.status(500).send({ error: message });
    }
  });

  // 🧾 Get single news by ID
  fastify.get(
    "/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const news = await News.findById(request.params.id);
        if (!news) {
          return reply.status(404).send({ error: "News not found" });
        }
        return reply.send(news);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch news";
        return reply.status(500).send({ error: message });
      }
    },
  );
}