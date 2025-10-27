
import { FastifyRequest, FastifyReply } from "fastify";

export const validatePredictionData = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const body = request.body as any;
  
  if (!body.matchId) {
    return reply.status(400).send({ error: "matchId is required" });
  }
  
  if (!body.prediction) {
    return reply.status(400).send({ error: "prediction is required" });
  }
  
  if (!['home', 'draw', 'away'].includes(body.prediction)) {
    return reply.status(400).send({ error: "Invalid prediction value" });
  }
};
