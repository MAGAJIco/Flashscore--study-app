
import { FastifyInstance } from 'fastify';
import { scraperController } from './controllers/scraperController';

export async function scraperModuleRoutes(fastify: FastifyInstance) {
  // Scrape and save matches
  fastify.post('/scrape', scraperController.scrapeAndSave);
  
  // Get upcoming matches from scraper
  fastify.get('/upcoming', scraperController.getScrapedUpcoming);
  
  // Get predictions from scraper
  fastify.get('/predictions', scraperController.getScrapedPredictions);
}
