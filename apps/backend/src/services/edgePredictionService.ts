
class EdgePredictionService {
  private precomputed = new Map<string, any>();

  async precomputePopularMatches(matches: any[]) {
    const topMatches = matches
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 50);

    for (const match of topMatches) {
      const features = this.extractFeatures(match);
      const prediction = await this.getPrediction(features);
      
      this.precomputed.set(match.id, {
        prediction,
        computedAt: Date.now(),
        match
      });
    }

    console.log(`✅ Precomputed ${topMatches.length} popular matches`);
  }

  getInstantPrediction(matchId: string) {
    const cached = this.precomputed.get(matchId);
    if (cached && Date.now() - cached.computedAt < 300000) { // 5 min
      return { ...cached.prediction, instant: true };
    }
    return null;
  }

  private extractFeatures(match: any): number[] {
    return [
      match.homeStrength || 0.5,
      match.awayStrength || 0.5,
      match.homeAdvantage || 0.5,
      match.homeForm || 0.5,
      match.awayForm || 0.5,
      match.h2h || 0.5,
      match.injuries || 0.5
    ];
  }

  private async getPrediction(features: number[]) {
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://0.0.0.0:8000";
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features })
    });
    return response.json();
  }
}

export default new EdgePredictionService();
