
import { FastifyRequest, FastifyReply } from "fastify";
import { matchService } from "../services/matchService";

export const getMatches = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const matches = await matchService.getAllMatches();
    return reply.send(matches);
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch matches" });
  }
};

export const createMatch = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const match = await matchService.createMatch(request.body);
    reply.status(201).send(match);
  } catch (err) {
    reply.status(400).send({ error: "Failed to create match" });
  }
};

export const getLiveMatches = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const matches = await matchService.getLiveMatches();
    return reply.send(matches);
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch live matches" });
  }
};
