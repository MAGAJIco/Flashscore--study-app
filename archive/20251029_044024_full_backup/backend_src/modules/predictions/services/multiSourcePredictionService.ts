
import { predictionService } from './predictionService';
import { scraperService } from '@/modules/scraper/services/scraperService';
import { mlPredictionService } from '@/services/mlPredictionService';

export interface AggregatedPrediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  sources: {
    ml?: {
      prediction: string;
      confidence: number;
      probabilities?: any;
    };
    scraper?: {
      prediction: string;
      confidence: number;
      odds?: number;
    };
    database?: {
      prediction: string;
      confidence: number;
    };
  };
  consensus?: {
    prediction: string;
    averageConfidence: number;
    agreement: number;
  };
  matchDate?: Date;
  league?: string;
}

export const multiSourcePredictionService = {
  async aggregatePredictions(limit: number = 50): Promise<AggregatedPrediction[]> {
    try {
      const [dbPredictions, scraperMatches] = await Promise.allSettled([
        predictionService.getAllPredictions(),
        scraperService.getUpcomingMatches().catch(() => [])
      ]);

      const matchMap = new Map<string, AggregatedPrediction>();

      // Add database predictions
      if (dbPredictions.status === 'fulfilled') {
        for (const pred of dbPredictions.value.slice(0, limit)) {
          const key = `${pred.homeTeam}-${pred.awayTeam}`;
          matchMap.set(key, {
            matchId: pred.matchId || pred._id?.toString() || '',
            homeTeam: pred.homeTeam,
            awayTeam: pred.awayTeam,
            sources: {
              database: {
                prediction: pred.predictedWinner,
                confidence: pred.confidence || 0
              }
            },
            matchDate: pred.matchDate
          });
        }
      }

      // Add scraper predictions
      if (scraperMatches.status === 'fulfilled' && scraperMatches.value) {
        for (const match of scraperMatches.value.slice(0, limit)) {
          const key = `${match.homeTeam}-${match.awayTeam}`;
          const existing = matchMap.get(key);

          if (existing) {
            existing.sources.scraper = {
              prediction: match.prediction || match.homeTeam,
              confidence: match.confidence || 65,
              odds: match.odds
            };
          } else {
            matchMap.set(key, {
              matchId: match.id || `scraper-${Date.now()}`,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              sources: {
                scraper: {
                  prediction: match.prediction || match.homeTeam,
                  confidence: match.confidence || 65,
                  odds: match.odds
                }
              },
              matchDate: match.date ? new Date(match.date) : undefined,
              league: match.league
            });
          }
        }
      }

      // Enhance with ML predictions
      const aggregated = Array.from(matchMap.values());
      const enhanced = await Promise.all(
        aggregated.map(async (agg) => {
          try {
            const mlResult = await mlPredictionService.predictMatch({
              homeTeam: agg.homeTeam,
              awayTeam: agg.awayTeam,
              features: [0.7, 0.65, 0.6, 0.55, 0.5, 2.0, 1.0]
            });

            agg.sources.ml = {
              prediction: mlResult.prediction,
              confidence: mlResult.confidence,
              probabilities: mlResult.probabilities
            };
          } catch (error) {
            console.warn(`ML prediction failed for ${agg.homeTeam} vs ${agg.awayTeam}`);
          }

          // Calculate consensus
          agg.consensus = this.calculateConsensus(agg.sources);
          return agg;
        })
      );

      return enhanced;
    } catch (error) {
      console.error('Error aggregating predictions:', error);
      return [];
    }
  },

  calculateConsensus(sources: AggregatedPrediction['sources']) {
    const predictions: Array<{ prediction: string; confidence: number }> = [];

    if (sources.ml) predictions.push(sources.ml);
    if (sources.scraper) predictions.push(sources.scraper);
    if (sources.database) predictions.push(sources.database);

    if (predictions.length === 0) {
      return undefined;
    }

    // Find most common prediction
    const predictionCounts = new Map<string, { count: number; totalConfidence: number }>();
    
    predictions.forEach(({ prediction, confidence }) => {
      const current = predictionCounts.get(prediction) || { count: 0, totalConfidence: 0 };
      predictionCounts.set(prediction, {
        count: current.count + 1,
        totalConfidence: current.totalConfidence + confidence
      });
    });

    let maxCount = 0;
    let consensusPrediction = '';
    let totalConfidence = 0;

    predictionCounts.forEach((value, key) => {
      if (value.count > maxCount || (value.count === maxCount && value.totalConfidence > totalConfidence)) {
        maxCount = value.count;
        consensusPrediction = key;
        totalConfidence = value.totalConfidence;
      }
    });

    const averageConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
    const agreement = (maxCount / predictions.length) * 100;

    return {
      prediction: consensusPrediction,
      averageConfidence: Math.round(averageConfidence),
      agreement: Math.round(agreement)
    };
  }
};
