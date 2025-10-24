
/**
 * Browser-Compatible ML Model Client
 * Connects to Python ML Service for predictions
 */

export interface ModelConfig {
  mlServiceUrl: string;
  timeout?: number;
  retryAttempts?: number;
}

export interface PredictionInput {
  teamStats?: any;
  historicalData?: number[][];
  features?: number[];
  matchId?: string;
  homeTeam?: string;
  awayTeam?: string;
}

export interface PredictionOutput {
  winProbability: number;
  confidence: number;
  predictedScore?: number;
  modelVersion?: string;
  timestamp?: string;
}

export interface ModelHealth {
  status: 'healthy' | 'degraded' | 'offline';
  accuracy: number;
  version: string;
  predictionsMade: number;
  lastTrained: string;
  averageConfidence: number;
}

export class MLModelClient {
  private config: ModelConfig;
  private healthCache: { data: ModelHealth | null; timestamp: number } = {
    data: null,
    timestamp: 0
  };
  private readonly HEALTH_CACHE_TTL = 30000; // 30 seconds

  constructor(config: ModelConfig) {
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      ...config
    };
  }

  /**
   * Get ML service health status with caching
   */
  async getHealth(): Promise<ModelHealth> {
    const now = Date.now();
    
    // Return cached health if still valid
    if (this.healthCache.data && (now - this.healthCache.timestamp) < this.HEALTH_CACHE_TTL) {
      return this.healthCache.data;
    }

    try {
      const response = await this.fetchWithRetry(`${this.config.mlServiceUrl}/health`);
      const data = await response.json();
      
      const health: ModelHealth = {
        status: data.status === 'healthy' ? 'healthy' : 'degraded',
        accuracy: data.accuracy || 0.87,
        version: data.model_version || 'v2.1',
        predictionsMade: data.predictions_made || 0,
        lastTrained: data.last_trained || 'Unknown',
        averageConfidence: data.confidence_avg || 0.75
      };

      // Update cache
      this.healthCache = { data: health, timestamp: now };
      return health;
    } catch (error) {
      console.error('ML service health check failed:', error);
      return {
        status: 'offline',
        accuracy: 0,
        version: 'unknown',
        predictionsMade: 0,
        lastTrained: 'Unknown',
        averageConfidence: 0
      };
    }
  }

  /**
   * Make a prediction using the ML service
   */
  async predict(input: PredictionInput): Promise<PredictionOutput> {
    const features = this.preprocessInput(input);
    
    try {
      const response = await this.fetchWithRetry(`${this.config.mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });

      const result = await response.json();
      
      return {
        winProbability: Math.max(0, Math.min(1, result.prediction || result.win_probability || 0.5)),
        confidence: Math.max(0, Math.min(1, result.confidence || 0.75)),
        predictedScore: result.predicted_score,
        modelVersion: result.model_version,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Prediction failed:', error);
      // Return fallback prediction
      return this.getFallbackPrediction(input);
    }
  }

  /**
   * Batch predictions for multiple matches
   */
  async batchPredict(inputs: PredictionInput[]): Promise<PredictionOutput[]> {
    const predictions = await Promise.allSettled(
      inputs.map(input => this.predict(input))
    );

    return predictions.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return this.getFallbackPrediction(inputs[index]);
    });
  }

  /**
   * Train model with new data (admin only)
   */
  async trainModel(trainingData: any[]): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.fetchWithRetry(`${this.config.mlServiceUrl}/train`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ training_data: trainingData })
      });

      const result = await response.json();
      return {
        success: result.success || false,
        message: result.message || 'Training completed'
      };
    } catch (error) {
      console.error('Model training failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Training failed'
      };
    }
  }

  /**
   * Evaluate model performance
   */
  async evaluateModel(testData: any[]): Promise<{
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  }> {
    try {
      const response = await this.fetchWithRetry(`${this.config.mlServiceUrl}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_data: testData })
      });

      const result = await response.json();
      return {
        accuracy: result.accuracy || 0,
        precision: result.precision || 0,
        recall: result.recall || 0,
        f1Score: result.f1_score || 0
      };
    } catch (error) {
      console.error('Model evaluation failed:', error);
      return { accuracy: 0, precision: 0, recall: 0, f1Score: 0 };
    }
  }

  /**
   * Preprocess input data into feature vector
   */
  private preprocessInput(input: PredictionInput): number[] {
    if (input.features) {
      return input.features;
    }

    if (input.teamStats) {
      return this.extractTeamFeatures(input.teamStats);
    }

    if (input.historicalData) {
      return input.historicalData.flat();
    }

    // Default features
    return new Array(10).fill(0.5);
  }

  /**
   * Extract features from team statistics
   */
  private extractTeamFeatures(stats: any): number[] {
    return [
      stats.wins || 0,
      stats.losses || 0,
      stats.pointsPerGame || 0,
      stats.pointsAllowedPerGame || 0,
      stats.offensiveRating || 0,
      stats.defensiveRating || 0,
      stats.homeWinPercentage || 0.5,
      stats.awayWinPercentage || 0.5,
      stats.recentFormScore || 0.5,
      stats.headToHeadRecord || 0.5
    ];
  }

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(url: string, options?: RequestInit, attempt = 1): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok && attempt < (this.config.retryAttempts || 3)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.fetchWithRetry(url, options, attempt + 1);
      }

      return response;
    } catch (error) {
      if (attempt < (this.config.retryAttempts || 3)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.fetchWithRetry(url, options, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Get fallback prediction when ML service is unavailable
   */
  private getFallbackPrediction(input: PredictionInput): PredictionOutput {
    return {
      winProbability: 0.5,
      confidence: 0.3,
      modelVersion: 'fallback',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Check if model is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const health = await this.getHealth();
      return health.status !== 'offline';
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const mlModelClient = new MLModelClient({
  mlServiceUrl: typeof window !== 'undefined' 
    ? window.location.origin + '/api/ml'
    : 'http://0.0.0.0:8000'
});

// Factory function
export function createMLModelClient(config: ModelConfig): MLModelClient {
  return new MLModelClient(config);
}

// Export for backward compatibility
export const PytorchModel = MLModelClient;
export const pytorchModelInstance = mlModelClient;
export const initializePytorchModel = async (mlServiceUrl: string): Promise<MLModelClient> => {
  return new MLModelClient({ mlServiceUrl });
};
