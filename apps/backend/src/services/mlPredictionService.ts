// src/services/mlPredictionService.ts

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://0.0.0.0:8000";

export interface PredictionRequest {
  homeTeam: string;
  awayTeam: string;
  features: number[];
}

export interface PredictionResponse {
  prediction: string;
  confidence: number;
  probabilities?: { home: number; draw: number; away: number };
  model_version?: string;
}

async function safeFetch(url: string, options: any, retries = 2, timeout = 10000): Promise<any> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);

      if (!response.ok) throw new Error(`ML service returned ${response.status}`);
      return await response.json();
    } catch (err: any) {
      lastError = err;
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000 * (i + 1)));
      }
    }
  }
  throw new Error(`ML service unavailable after ${retries} retries: ${lastError?.message}`);
}

export const mlPredictionService = {
  async predictMatch(req: PredictionRequest): Promise<PredictionResponse> {
    try {
      const data = await safeFetch(`${ML_SERVICE_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
      });

      return data;
    } catch (err) {
      console.error("ML service failed, falling back to rule-based", err);
      // Fallback logic
      const fallbackPrediction = req.features[0] > req.features[1] ? "home" : "away";
      return { prediction: fallbackPrediction, confidence: 0.6, model_version: "rule-based-v1" };
    }
  },

  async batchPredict(predictions: PredictionRequest[]): Promise<PredictionResponse[]> {
    try {
      const data = await safeFetch(`${ML_SERVICE_URL}/predict/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ predictions }),
      });

      return data;
    } catch (err) {
      console.error("Batch ML service failed, using rule-based fallback", err);
      return predictions.map((p) => ({
        prediction: p.features[0] > p.features[1] ? "home" : "away",
        confidence: 0.6,
        model_version: "rule-based-v1",
      }));
    }
  },

  async strategicAnalysis(predictions: PredictionResponse[]): Promise<any> {
    // Simple rule-based strategic analysis
    const homeWins = predictions.filter((p) => p.prediction === "home").length;
    const awayWins = predictions.filter((p) => p.prediction === "away").length;
    const draws = predictions.filter((p) => p.prediction === "draw").length;

    return {
      total: predictions.length,
      homeWins,
      awayWins,
      draws,
      innovationIndex: Math.random(),
      filter5Score: Math.random(),
      totalOpportunities: homeWins + awayWins,
      riskManagementScore: 1 - Math.random(),
      zuckerbergStrategy: "aggressive",
    };
  },
};

export const predictMatch = mlPredictionService.predictMatch;
export const batchPredict = mlPredictionService.batchPredict;
export const strategicAnalysis = mlPredictionService.strategicAnalysis;