
import { FastifyRequest, FastifyReply } from "fastify";
import { newsAuthorService } from "../services/newsAuthorService";

export const getAllAuthors = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authors = await newsAuthorService.getAllAuthors();
    return reply.send({ success: true, data: authors });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch authors" });
  }
};

export const getAuthorById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const author = await newsAuthorService.getAuthorById(request.params.id);
    if (!author) {
      return reply.status(404).send({ error: "Author not found" });
    }
    return reply.send({ success: true, data: author });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch author" });
  }
};
