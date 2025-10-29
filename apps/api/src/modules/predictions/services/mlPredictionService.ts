
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';
const ML_TIMEOUT = parseInt(process.env.ML_TIMEOUT || '10000');
const ML_RETRIES = parseInt(process.env.ML_RETRIES || '2');

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

async function safeFetch(
  url: string,
  options: RequestInit,
  retries = ML_RETRIES,
  timeout = ML_TIMEOUT
): Promise<any> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, { 
        ...options, 
        signal: controller.signal as any 
      });
      clearTimeout(timer);

      if (!response.ok) {
        throw new Error(`ML service returned ${response.status}`);
      }

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      return data;
    } catch (err) {
      console.error('⚠️ ML service failed, falling back to rule-based prediction:', err);
      const fallbackPrediction = req.features[0] > req.features[1] ? 'home' : 'away';
      return {
        prediction: fallbackPrediction,
        confidence: 0.6,
        model_version: 'rule-based-v1',
      };
    }
  },

  async batchPredict(predictions: PredictionRequest[]): Promise<PredictionResponse[]> {
    try {
      const data = await safeFetch(`${ML_SERVICE_URL}/predict/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictions }),
      });

      return data;
    } catch (err) {
      console.error('⚠️ Batch ML service failed, using rule-based fallback:', err);
      return predictions.map((p) => ({
        prediction: p.features[0] > p.features[1] ? 'home' : 'away',
        confidence: 0.6,
        model_version: 'rule-based-v1',
      }));
    }
  }
};

export const { predictMatch, batchPredict } = mlPredictionService;
