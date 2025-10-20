import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  scrapeStakeOdds,
  scrapeBetTodayPredictions,
  saveScrapedMatches,
  getUpcomingMatches
} from "@bservices/scraperServices";
import StatAreaService from "@bservices/statAreaService";

export async function scraperRoutes(server: FastifyInstance) {
  // --- Scrape Odds ---
  server.get("/scrape/odds", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const odds = await scrapeStakeOdds();
      return reply.send({
        success: true,
        message: `Scraped ${odds.length} matches with odds`,
        data: odds
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error?.message || "Odds scraping failed"
      });
    }
  });

  // --- Scrape Predictions (merged: BetToday + StatArea) ---
  server.get("/scrape/predictions", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const [betTodayPreds, statAreaPreds] = await Promise.all([
        scrapeBetTodayPredictions(),
        StatAreaService.fetchPredictions("https://www.statarea.com/predictions")
      ]);

      const allPredictions = [...betTodayPreds, ...statAreaPreds];

      return reply.send({
        success: true,
        message: `Scraped ${allPredictions.length} total predictions`,
        data: allPredictions
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error?.message || "Predictions scraping failed"
      });
    }
  });

  // --- Full Scrape and Save ---
  server.post("/scrape/save", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await saveScrapedMatches();
      // Remove duplicate 'success' field if present in result
      const { success: _ignored, ...cleanResult } = result as any;

      return reply.send({
        success: true,
        message: "Scraping completed and saved to database",
        ...cleanResult
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error?.message || "Save operation failed"
      });
    }
  });

  // --- Scraper Status ---
  server.get("/scrape/status", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const upcomingMatches = await getUpcomingMatches(5);
      const lastScrapedMatch = upcomingMatches[0];

      // Optional: Ping StatArea to confirm external availability
      let statAreaOnline = false;
      try {
        const preds = await StatAreaService.fetchPredictions("https://www.statarea.com/predictions");
        statAreaOnline = preds.length > 0;
      } catch {
        statAreaOnline = false;
      }

      return reply.send({
        success: true,
        status: "operational",
        statAreaOnline,
        lastScrapeTime: lastScrapedMatch?.scrapedAt || null,
        upcomingMatches: upcomingMatches.length,
        message: "Scraper is ready"
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error?.message || "Status check failed"
      });
    }
  });
}