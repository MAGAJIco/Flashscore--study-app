import { FastifyRequest, FastifyReply } from "fastify";
import { Match } from '@/models';

// GET all matches
export const getMatches = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const matches = await Match.find().sort({ date: -1 });
    return reply.send(matches);
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch matches" });
  }
};

// POST new match
export const createMatch = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const match = new Match(request.body);
    await match.save();
    reply.status(201).send(match);
  } catch (err) {
    reply.status(400).send({ error: "Failed to create match" });
  }
};