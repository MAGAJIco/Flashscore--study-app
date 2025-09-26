
import { FastifyInstance } from "fastify";
import {
  scrapeStakeOdds,
  scrapeBetTodayPredictions,
  saveScrapedMatches,
  getUpcomingMatches
} from "../services/scraperServices";

export async function scraperRoutes(server: FastifyInstance) {
  // Manual scrape odds only
  server.get("/scrape/odds", async (request, reply) => {
    try {
      const odds = await scrapeStakeOdds();
      return { 
        success: true, 
        message: `Scraped ${odds.length} matches with odds`,
        data: odds 
      };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Odds scraping failed"
      });
    }
  });

  // Manual scrape predictions only
  server.get("/scrape/predictions", async (request, reply) => {
    try {
      const predictions = await scrapeBetTodayPredictions();
      return { 
        success: true, 
        message: `Scraped ${predictions.length} predictions`,
        data: predictions 
      };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Predictions scraping failed"
      });
    }
  });

  // Full scrape and save to database
  server.post("/scrape/save", async (request, reply) => {
    try {
      const result = await saveScrapedMatches();
      return { 
        message: "Scraping completed and saved to database",
        ...result
      };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Save operation failed"
      });
    }
  });

  // Get scraper status
  server.get("/scrape/status", async (request, reply) => {
    try {
      const upcomingMatches = await getUpcomingMatches(5);
      const lastScrapedMatch = upcomingMatches[0];
      
      return {
        success: true,
        status: "operational",
        lastScrapeTime: lastScrapedMatch?.scrapedAt || null,
        upcomingMatches: upcomingMatches.length,
        message: "Scraper is ready"
      };
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || "Status check failed"
      });
    }
  });
}
