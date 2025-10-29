
import { FastifyRequest, FastifyReply } from "fastify";
import { socialService } from "../services/socialService";

export const getSocialFeed = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const feed = await socialService.getFeed();
    return reply.send(feed);
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch social feed" });
  }
};

export const createPost = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const post = await socialService.createPost(request.body);
    reply.status(201).send(post);
  } catch (err) {
    reply.status(400).send({ error: "Failed to create post" });
  }
};
