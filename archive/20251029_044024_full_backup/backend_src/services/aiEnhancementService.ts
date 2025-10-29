import { PredictionResponse } from "./mlPredictionService";

// Export as named export to match the import
export const aiEnhancementService = {
  async enhancePredictionWithInsights(
    prediction: PredictionResponse,
    context: { homeTeam: string; awayTeam: string }
  ) {
    return {
      prediction,
      aiInsights: {
        confidenceBoost: 0.05,
        suggestedStrategy: "Play aggressively if home team",
      },
      strategicAdvice: `Leverage ${context.homeTeam}'s strengths for higher chance of victory`,
    };
  },
};
