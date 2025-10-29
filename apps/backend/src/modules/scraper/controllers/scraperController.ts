
import { FastifyRequest, FastifyReply } from "fastify";
import { scraperService } from "../services/scraperService";

export const scrapeAndSave = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await scraperService.saveScrapedMatches();
    return reply.send({ success: true, data: result });
  } catch (err) {
    reply.status(500).send({ error: "Failed to scrape and save matches" });
  }
};

export const getUpcomingMatches = async (
  request: FastifyRequest<{ Querystring: { limit?: number } }>,
  reply: FastifyReply
) => {
  try {
    const limit = request.query.limit || 20;
    const matches = await scraperService.getUpcomingMatches(limit);
    return reply.send({ success: true, data: matches });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch upcoming matches" });
  }
};

export const getPredictionFallback = async (
  request: FastifyRequest<{ Body: { homeTeam: string; awayTeam: string } }>,
  reply: FastifyReply
) => {
  try {
    const { homeTeam, awayTeam } = request.body;
    
    if (!homeTeam || !awayTeam) {
      return reply.status(400).send({ error: "Missing homeTeam or awayTeam" });
    }

    const prediction = await scraperService.getPredictionFallback(homeTeam, awayTeam);
    return reply.send({ success: true, data: prediction });
  } catch (err) {
    reply.status(500).send({ error: "Failed to get prediction fallback" });
  }
};

export const getAllPredictions = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const predictions = await scraperService.getAllPredictions();
    return reply.send({ success: true, data: predictions });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch predictions" });
  }
};
