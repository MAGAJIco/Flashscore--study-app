
import axios from "axios";
import { Match } from "@/models/Match";
import { ErrorLog } from "@/models/ErrorLog";

/**
 * Generic scraper utility with retry logic
 */
const scrapeWithRetry = async (url: string, retries = 3): Promise<string> => {
  for (let i = 0; i < retries; i++) {
    try {
      const { data } = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return data;
    } catch (error) {
      console.warn(`Scrape attempt ${i + 1} failed for ${url}:`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Max retries exceeded");
};

/**
 * Scraper Service for fetching odds and predictions
 */
export const scraperService = {
  /**
   * Scrape odds from Stake.com
   */
  async scrapeStakeOdds() {
    try {
      console.log("🔍 Scraping Stake.com odds...");
      
      // Mock data for development - replace with real scraping logic
      const mockMatches = [
        {
          homeTeam: "Manchester United",
          awayTeam: "Arsenal",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          competition: "Premier League",
          odds: {
            home: 2.1,
            draw: 3.4,
            away: 3.2,
            source: "stake.com",
            timestamp: new Date()
          }
        },
        {
          homeTeam: "Barcelona",
          awayTeam: "Real Madrid",
          date: new Date(Date.now() + 48 * 60 * 60 * 1000),
          competition: "La Liga",
          odds: {
            home: 1.9,
            draw: 3.1,
            away: 4.2,
            source: "stake.com",
            timestamp: new Date()
          }
        }
      ];

      console.log(`✅ Scraped ${mockMatches.length} matches from Stake`);
      return mockMatches;

    } catch (error: any) {
      await ErrorLog.create({
        type: 'scraper',
        message: `Stake scraping failed: ${error.message}`,
        source: 'scrapeStakeOdds',
        severity: 'medium',
        stack: error.stack
      });
      console.error("❌ Stake scraping error:", error);
      return [];
    }
  },

  /**
   * Scrape predictions from BetToday
   */
  async scrapeBetTodayPredictions() {
    try {
      console.log("🔍 Scraping BetToday predictions...");
      
      const mockPredictions = [
        {
          homeTeam: "Liverpool",
          awayTeam: "Chelsea",
          prediction: "home",
          confidence: 78,
          date: new Date(Date.now() + 72 * 60 * 60 * 1000),
          competition: "Premier League",
          probabilities: {
            home: 0.78,
            draw: 0.12,
            away: 0.10
          }
        }
      ];

      console.log(`✅ Scraped ${mockPredictions.length} predictions from BetToday`);
      return mockPredictions;

    } catch (error: any) {
      await ErrorLog.create({
        type: 'scraper',
        message: `BetToday scraping failed: ${error.message}`,
        source: 'scrapeBetTodayPredictions',
        severity: 'medium',
        stack: error.stack
      });
      console.error("❌ BetToday scraping error:", error);
      return [];
    }
  },

  /**
   * Get prediction from scraper as fallback
   */
  async getPredictionFallback(homeTeam: string, awayTeam: string) {
    try {
      const predictions = await this.scrapeBetTodayPredictions();
      const odds = await this.scrapeStakeOdds();

      // Find matching prediction
      const prediction = predictions.find(
        p => p.homeTeam === homeTeam && p.awayTeam === awayTeam
      );

      // Find matching odds
      const matchOdds = odds.find(
        o => o.homeTeam === homeTeam && o.awayTeam === awayTeam
      );

      if (prediction) {
        return {
          prediction: prediction.prediction,
          confidence: prediction.confidence / 100,
          probabilities: prediction.probabilities,
          model_version: 'scraper-fallback-v1',
          source: 'scraper',
          odds: matchOdds?.odds
        };
      }

      // Rule-based fallback if no scraper data
      const homeOdds = matchOdds?.odds?.home || 2.0;
      const awayOdds = matchOdds?.odds?.away || 2.0;
      
      return {
        prediction: homeOdds < awayOdds ? 'home' : 'away',
        confidence: 0.5,
        probabilities: {
          home: homeOdds < awayOdds ? 0.55 : 0.45,
          draw: 0.25,
          away: homeOdds < awayOdds ? 0.20 : 0.30
        },
        model_version: 'rule-based-fallback-v1',
        source: 'rule-based',
        odds: matchOdds?.odds
      };

    } catch (error: any) {
      console.error("❌ Scraper fallback error:", error);
      throw error;
    }
  },

  /**
   * Save scraped data to database
   */
  async saveScrapedMatches() {
    try {
      const odds = await this.scrapeStakeOdds();
      const predictions = await this.scrapeBetTodayPredictions();

      let savedCount = 0;
      let updatedCount = 0;

      for (const matchData of odds) {
        const existingMatch = await Match.findOne({
          homeTeam: matchData.homeTeam,
          awayTeam: matchData.awayTeam,
          date: {
            $gte: new Date(matchData.date.getTime() - 60 * 60 * 1000),
            $lte: new Date(matchData.date.getTime() + 60 * 60 * 1000)
          }
        });

        if (existingMatch) {
          existingMatch.odds.push(matchData.odds);
          existingMatch.scrapedAt = new Date();
          await existingMatch.save();
          updatedCount++;
        } else {
          await Match.create({
            ...matchData,
            status: "scheduled",
            scrapedAt: new Date(),
            odds: [matchData.odds]
          });
          savedCount++;
        }
      }

      return {
        success: true,
        savedCount,
        updatedCount,
        totalProcessed: odds.length + predictions.length
      };

    } catch (error: any) {
      await ErrorLog.create({
        type: 'scraper',
        message: `Save scraped matches failed: ${error.message}`,
        source: 'saveScrapedMatches',
        severity: 'high',
        stack: error.stack
      });
      
      console.error("❌ Save scraped matches error:", error);
      throw error;
    }
  },

  /**
   * Get upcoming matches from database
   */
  async getUpcomingMatches(limit = 20) {
    try {
      const matches = await Match.find({
        date: { $gte: new Date() },
        status: { $in: ["scheduled", "live"] }
      })
      .sort({ date: 1 })
      .limit(limit)
      .populate('predictions');

      return matches;
    } catch (error: any) {
      console.error("❌ Get upcoming matches error:", error);
      throw error;
    }
  }
};
