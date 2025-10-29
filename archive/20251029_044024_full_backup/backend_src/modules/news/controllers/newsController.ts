
import { FastifyRequest, FastifyReply } from "fastify";
import { newsService } from "../services/newsService";

export const getAllNews = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const news = await newsService.getAllNews();
    return reply.send({ success: true, data: news });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch news" });
  }
};

export const getNewsById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const news = await newsService.getNewsById(request.params.id);
    if (!news) {
      return reply.status(404).send({ error: "News not found" });
    }
    return reply.send({ success: true, data: news });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch news" });
  }
};

export const createNews = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const news = await newsService.createNews(request.body);
    reply.status(201).send({ success: true, data: news });
  } catch (err) {
    reply.status(400).send({ error: "Failed to create news" });
  }
};
