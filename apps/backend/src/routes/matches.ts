import { FastifyInstance } from "fastify";
import { Match } from "../models/Match.js";
import { getUpcomingMatches } from "../services/scraperServices.js";

export async function matchRoutes(server: FastifyInstance) {
  // Get all matches
  server.get("/matches", async (request, reply) => {
    try {
      const { limit = 20, status, competition } = request.query as {
        limit?: number;
        status?: string;
        competition?: string;
      };

      let query: any = {};

      if (status) query.status = status;
      if (competition) query.competition = new RegExp(competition, 'i');

      const matches = await Match.find(query)
        .sort({ date: -1 })
        .limit(Number(limit))
        .populate('predictions');

      return { success: true, data: matches, count: matches.length };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Failed to fetch matches"
      });
    }
  });

  // Get upcoming matches
  server.get("/matches/upcoming", async (request, reply) => {
    try {
      const { limit = 10 } = request.query as { limit?: number };
      const matches = await getUpcomingMatches(Number(limit));

      return { success: true, data: matches, count: matches.length };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Failed to fetch upcoming matches"
      });
    }
  });

  // Get match by ID
  server.get("/matches/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const match = await Match.findById(id).populate('predictions');

      if (!match) {
        return reply.status(404).send({
          success: false,
          error: "Match not found"
        });
      }

      return { success: true, data: match };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Failed to fetch match"
      });
    }
  });

  // Create new match (admin only - for manual additions)
  server.post("/matches", async (request, reply) => {
    try {
      const matchData = request.body as any;

      const match = await Match.create({
        ...matchData,
        scrapedAt: new Date()
      });

      return { success: true, data: match };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Failed to create match"
      });
    }
  });

  // Get live matches
  server.get('/matches/live', async (request, reply) => {
    try {
      const liveMatches = await Match.find({
        status: { $in: ['live', 'in_progress', '1H', '2H'] }
      })
        .sort({ startTime: 1 })
        .limit(50)
        .lean();

      return reply.send({
        success: true,
        matches: liveMatches,
        total: liveMatches.length
      });
    } catch (error: any) {
      server.log.error({ err: error }, 'Error fetching live matches');
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch live matches',
        matches: []
      });
    }
  });

  // Get today's matches
  server.get('/matches/today', async (request, reply) => {
    // This route is intentionally left empty as per the original structure
    // If it needs implementation, it should be added here.
  });
}