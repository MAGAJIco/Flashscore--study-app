
/**
 * ML Analytics and Insights
 * Advanced analytics for prediction performance tracking
 */

export interface PredictionRecord {
  id: string;
  matchId: string;
  prediction: number;
  confidence: number;
  actual?: number;
  timestamp: Date;
  modelVersion: string;
}

export interface PerformanceMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  averageConfidence: number;
  totalPredictions: number;
  correctPredictions: number;
  calibrationScore: number;
}

export class MLAnalytics {
  private predictions: PredictionRecord[] = [];

  /**
   * Track a new prediction
   */
  trackPrediction(record: PredictionRecord): void {
    this.predictions.push(record);
    
    // Keep only last 1000 predictions
    if (this.predictions.length > 1000) {
      this.predictions = this.predictions.slice(-1000);
    }
  }

  /**
   * Update prediction with actual result
   */
  updateActual(predictionId: string, actual: number): void {
    const prediction = this.predictions.find(p => p.id === predictionId);
    if (prediction) {
      prediction.actual = actual;
    }
  }

  /**
   * Calculate performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    const completedPredictions = this.predictions.filter(p => p.actual !== undefined);
    
    if (completedPredictions.length === 0) {
      return {
        accuracy: 0,
        precision: 0,
        recall: 0,
        f1Score: 0,
        averageConfidence: 0,
        totalPredictions: 0,
        correctPredictions: 0,
        calibrationScore: 0
      };
    }

    const correctPredictions = completedPredictions.filter(
      p => Math.abs(p.prediction - (p.actual || 0)) < 0.1
    );

    const accuracy = correctPredictions.length / completedPredictions.length;
    const averageConfidence = this.predictions.reduce((sum, p) => sum + p.confidence, 0) / this.predictions.length;
    
    // Calculate calibration (how well confidence matches accuracy)
    const calibrationScore = 1 - Math.abs(accuracy - averageConfidence);

    return {
      accuracy,
      precision: accuracy, // Simplified for binary classification
      recall: accuracy,
      f1Score: accuracy,
      averageConfidence,
      totalPredictions: this.predictions.length,
      correctPredictions: correctPredictions.length,
      calibrationScore: Math.max(0, calibrationScore)
    };
  }

  /**
   * Get confidence distribution
   */
  getConfidenceDistribution(): { low: number; medium: number; high: number } {
    const distribution = { low: 0, medium: 0, high: 0 };
    
    this.predictions.forEach(p => {
      if (p.confidence < 0.5) distribution.low++;
      else if (p.confidence < 0.75) distribution.medium++;
      else distribution.high++;
    });

    return distribution;
  }

  /**
   * Get recent prediction trends
   */
  getRecentTrend(days = 7): { date: string; accuracy: number }[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentPredictions = this.predictions.filter(
      p => p.timestamp >= cutoffDate && p.actual !== undefined
    );

    // Group by date
    const byDate = new Map<string, { correct: number; total: number }>();
    
    recentPredictions.forEach(p => {
      const dateKey = p.timestamp.toISOString().split('T')[0];
      const current = byDate.get(dateKey) || { correct: 0, total: 0 };
      
      current.total++;
      if (Math.abs(p.prediction - (p.actual || 0)) < 0.1) {
        current.correct++;
      }
      
      byDate.set(dateKey, current);
    });

    return Array.from(byDate.entries()).map(([date, stats]) => ({
      date,
      accuracy: stats.total > 0 ? stats.correct / stats.total : 0
    }));
  }

  /**
   * Clear all predictions
   */
  clear(): void {
    this.predictions = [];
  }
}

export const mlAnalytics = new MLAnalytics();
