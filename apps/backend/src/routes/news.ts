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

import { FastifyPluginAsync } from 'fastify';
import { News } from '../models/News.js';

const newsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get all news articles
  fastify.get('/api/news', async (request, reply) => {
    try {
      const { limit = 10, skip = 0 } = request.query as any;

      const news = await News.find()
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .lean();

      return reply.send({
        success: true,
        data: news,
        total: news.length
      });
    } catch (error) {
      fastify.log.error({ err: error }, 'Error fetching news');
      return reply.status(200).send({
        success: true,
        data: [],
        total: 0
      });
    }
  });

  // Get news by ID
  fastify.get('/api/news/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const news = await News.findById(id);

      if (!news) {
        return reply.status(404).send({
          success: false,
          error: 'News article not found'
        });
      }
    },
  );
}
