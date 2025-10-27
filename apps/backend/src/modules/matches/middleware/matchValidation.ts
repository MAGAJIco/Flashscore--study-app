
import { FastifyRequest, FastifyReply } from "fastify";

export const validateMatchData = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = request.body as any;
  
  if (!body.homeTeam || !body.awayTeam) {
    return reply.status(400).send({ error: "homeTeam and awayTeam are required" });
  }
  
  if (!body.date) {
    return reply.status(400).send({ error: "date is required" });
  }
};
