
import { FastifyInstance } from "fastify";
import { scrapeAndSave, getUpcomingMatches, getPredictionFallback, getAllPredictions } from "./controllers";

export async function scraperModuleRoutes(fastify: FastifyInstance) {
  // Scrape and save matches
  fastify.post('/scraper/scrape', scrapeAndSave);
  
  // Get upcoming matches
  fastify.get('/scraper/upcoming', getUpcomingMatches);
  
  // Get prediction fallback
  fastify.post('/scraper/predict', getPredictionFallback);
  
  // Get all predictions with odds
  fastify.get('/scraper/predictions', getAllPredictions);
}
