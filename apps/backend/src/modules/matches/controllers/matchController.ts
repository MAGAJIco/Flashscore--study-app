
import { FastifyRequest, FastifyReply } from "fastify";
import { matchService } from "../services/matchService";

export const getMatches = async (
  request: FastifyRequest<{ Querystring: { limit?: string; status?: string; competition?: string } }>,
  reply: FastifyReply
) => {
  try {
    const { limit = "20", status, competition } = request.query;
    const matches = await matchService.getAllMatches(parseInt(limit), status, competition);
    return reply.send({ success: true, data: matches, count: matches.length });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch matches" });
  }
};

export const createMatch = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const match = await matchService.createMatch(request.body);
    reply.status(201).send({ success: true, data: match });
  } catch (err) {
    reply.status(400).send({ error: "Failed to create match" });
  }
};

export const getLiveMatches = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const matches = await matchService.getLiveMatches();
    return reply.send({ success: true, data: matches, count: matches.length });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch live matches" });
  }
};

export const getMatchById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const match = await matchService.getMatchById(request.params.id);
    if (!match) {
      return reply.status(404).send({ error: "Match not found" });
    }
    return reply.send({ success: true, data: match });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch match" });
  }
};

export const updateMatch = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const match = await matchService.updateMatch(request.params.id, request.body);
    if (!match) {
      return reply.status(404).send({ error: "Match not found" });
    }
    return reply.send({ success: true, data: match });
  } catch (err) {
    reply.status(500).send({ error: "Failed to update match" });
  }
};

export const getUpcomingMatches = async (
  request: FastifyRequest<{ Querystring: { limit?: string } }>,
  reply: FastifyReply
) => {
  try {
    const { limit = "10" } = request.query;
    const matches = await matchService.getUpcomingMatches(parseInt(limit));
    return reply.send({ success: true, data: matches, count: matches.length });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch upcoming matches" });
  }
};

export const getTodayMatches = async (
  request: FastifyRequest<{ Querystring: { limit?: string } }>,
  reply: FastifyReply
) => {
  try {
    const { limit = "20" } = request.query;
    const matches = await matchService.getTodayMatches(parseInt(limit));
    return reply.send({ success: true, data: matches, count: matches.length });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch today's matches" });
  }
};
