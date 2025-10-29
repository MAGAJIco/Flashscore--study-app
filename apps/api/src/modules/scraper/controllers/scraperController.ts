
import { FastifyRequest, FastifyReply } from 'fastify';
import { Match } from '../../../models/Match';

export const scraperController = {
  async scrapeAndSave(req: FastifyRequest, res: FastifyReply) {
    try {
      // Fallback demo data
      const demoMatches = [
        {
          homeTeam: 'Manchester City',
          awayTeam: 'Liverpool',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          competition: 'Premier League',
          status: 'scheduled' as const,
          odds: [{
            home: 1.85,
            draw: 3.40,
            away: 4.20,
            source: 'demo',
            timestamp: new Date()
          }]
        },
        {
          homeTeam: 'Real Madrid',
          awayTeam: 'Barcelona',
          date: new Date(Date.now() + 48 * 60 * 60 * 1000),
          competition: 'La Liga',
          status: 'scheduled' as const,
          odds: [{
            home: 2.10,
            draw: 3.20,
            away: 3.50,
            source: 'demo',
            timestamp: new Date()
          }]
        }
      ];

      let savedCount = 0;
      for (const matchData of demoMatches) {
        const existing = await Match.findOne({
          homeTeam: matchData.homeTeam,
          awayTeam: matchData.awayTeam,
          date: matchData.date
        });

        if (!existing) {
          await Match.create({ ...matchData, scrapedAt: new Date() });
          savedCount++;
        }
      }

      res.send({
        success: true,
        message: `Scraped and saved ${savedCount} matches`,
        savedCount,
        source: 'demo-data'
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Scraping failed' });
    }
  },

  async getScrapedUpcoming(req: FastifyRequest, res: FastifyReply) {
    try {
      const matches = await Match.find({
        date: { $gte: new Date() },
        scrapedAt: { $exists: true }
      }).sort({ date: 1 }).limit(20);

      res.send({ success: true, data: matches, count: matches.length });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch scraped matches' });
    }
  },

  async getScrapedPredictions(req: FastifyRequest, res: FastifyReply) {
    try {
      const predictions = [
        {
          homeTeam: 'Arsenal',
          awayTeam: 'Chelsea',
          prediction: 'home',
          confidence: 72,
          source: 'scraper-demo',
          odds: { home: 2.15, draw: 3.35, away: 3.40 }
        },
        {
          homeTeam: 'Bayern Munich',
          awayTeam: 'Dortmund',
          prediction: 'home',
          confidence: 68,
          source: 'scraper-demo',
          odds: { home: 1.90, draw: 3.60, away: 4.00 }
        }
      ];

      res.send({ success: true, data: predictions, count: predictions.length });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Failed to fetch predictions' });
    }
  }
};
