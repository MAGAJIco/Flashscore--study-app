// Real-time confidence evolution tracker - monitors how prediction confidence changes over time

interface ConfidenceSnapshot {
  timestamp: Date;
  confidence: number;
  factors: {
    formChange: number;
    injuryNews: number;
    marketMovement: number;
    weatherUpdate: number;
    lineupConfirmation: number;
  };
}

interface EvolutionData {
  predictionId: string;
  initialConfidence: number;
  currentConfidence: number;
  snapshots: ConfidenceSnapshot[];
  volatilityScore: number; // How much confidence has changed
  stabilityRating: 'stable' | 'volatile' | 'highly_volatile';
  lastUpdated: Date;
}

class ConfidenceEvolutionService {
  private evolutions: Map<string, EvolutionData> = new Map();

  startTracking(predictionId: string, initialConfidence: number): void {
    const evolution: EvolutionData = {
      predictionId,
      initialConfidence,
      currentConfidence: initialConfidence,
      snapshots: [{
        timestamp: new Date(),
        confidence: initialConfidence,
        factors: {
          formChange: 0,
          injuryNews: 0,
          marketMovement: 0,
          weatherUpdate: 0,
          lineupConfirmation: 0
        }
      }],
      volatilityScore: 0,
      stabilityRating: 'stable',
      lastUpdated: new Date()
    };

    this.evolutions.set(predictionId, evolution);
  }

  updateConfidence(
    predictionId: string,
    newFactors: Partial<ConfidenceSnapshot['factors']>
  ): EvolutionData | null {
    const evolution = this.evolutions.get(predictionId);
    if (!evolution) return null;

    // Calculate new confidence based on factor changes
    const factorImpact = 
      (newFactors.formChange || 0) +
      (newFactors.injuryNews || 0) * 1.5 +
      (newFactors.marketMovement || 0) * 0.8 +
      (newFactors.weatherUpdate || 0) * 0.5 +
      (newFactors.lineupConfirmation || 0) * 1.2;

    const newConfidence = Math.min(100, Math.max(0, evolution.currentConfidence + factorImpact));

    // Add new snapshot
    evolution.snapshots.push({
      timestamp: new Date(),
      confidence: newConfidence,
      factors: {
        formChange: newFactors.formChange || 0,
        injuryNews: newFactors.injuryNews || 0,
        marketMovement: newFactors.marketMovement || 0,
        weatherUpdate: newFactors.weatherUpdate || 0,
        lineupConfirmation: newFactors.lineupConfirmation || 0
      }
    });

    evolution.currentConfidence = newConfidence;
    evolution.lastUpdated = new Date();

    // Calculate volatility
    const confidenceChanges = evolution.snapshots.map((s, i) => 
      i > 0 ? Math.abs(s.confidence - evolution.snapshots[i-1].confidence) : 0
    );
    evolution.volatilityScore = confidenceChanges.reduce((a, b) => a + b, 0) / confidenceChanges.length;

    // Determine stability
    if (evolution.volatilityScore < 5) {
      evolution.stabilityRating = 'stable';
    } else if (evolution.volatilityScore < 15) {
      evolution.stabilityRating = 'volatile';
    } else {
      evolution.stabilityRating = 'highly_volatile';
    }

    return evolution;
  }

  getEvolution(predictionId: string): EvolutionData | null {
    return this.evolutions.get(predictionId) || null;
  }

  getAllEvolutions(): EvolutionData[] {
    return Array.from(this.evolutions.values());
  }

  getVolatilePredictions(): EvolutionData[] {
    return Array.from(this.evolutions.values())
      .filter(e => e.stabilityRating !== 'stable')
      .sort((a, b) => b.volatilityScore - a.volatilityScore);
  }

  getTrendingConfidence(): Array<{
    predictionId: string;
    trend: 'rising' | 'falling' | 'stable';
    changePercent: number;
  }> {
    return Array.from(this.evolutions.values()).map(evolution => {
      const change = evolution.currentConfidence - evolution.initialConfidence;
      let trend: 'rising' | 'falling' | 'stable';
      
      if (change > 5) trend = 'rising';
      else if (change < -5) trend = 'falling';
      else trend = 'stable';

      return {
        predictionId: evolution.predictionId,
        trend,
        changePercent: Math.round((change / evolution.initialConfidence) * 100)
      };
    });
  }
}

export const confidenceEvolution = new ConfidenceEvolutionService();
