
import { mlPredictionService } from './mlPredictionService';

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
      const aggregated: AggregatedPrediction[] = [];

      // For now, return empty array - this will be enhanced with real data sources
      return aggregated;
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
