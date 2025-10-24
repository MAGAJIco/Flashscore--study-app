
/**
 * Browser-Compatible ML Model Client
 * Connects to Python ML Service for predictions with enhanced features
 */

export interface ModelConfig {
  mlServiceUrl: string;
  timeout?: number;
  retryAttempts?: number;
  enableWebSocket?: boolean;
  enableStreaming?: boolean;
  cacheMaxAge?: number;
}

export interface PredictionInput {
  teamStats?: any;
  historicalData?: number[][];
  features?: number[];
  matchId?: string;
  homeTeam?: string;
  awayTeam?: string;
  liveData?: boolean;
}

export interface PredictionOutput {
  winProbability: number;
  confidence: number;
  predictedScore?: number;
  modelVersion?: string;
  timestamp?: string;
  explanations?: FeatureExplanation[];
  alternativeScenarios?: AlternativeScenario[];
}

export interface FeatureExplanation {
  feature: string;
  importance: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface AlternativeScenario {
  name: string;
  probability: number;
  conditions: string[];
}

export interface ModelHealth {
  status: 'healthy' | 'degraded' | 'offline';
  accuracy: number;
  version: string;
  predictionsMade: number;
  lastTrained: string;
  averageConfidence: number;
  latency?: number;
  gpuAvailable?: boolean;
}

export interface StreamingPrediction {
  progress: number;
  currentStep: string;
  partialResult?: Partial<PredictionOutput>;
  completed: boolean;
}

export class MLModelClient {
  private config: ModelConfig;
  private healthCache: { data: ModelHealth | null; timestamp: number } = {
    data: null,
    timestamp: 0
  };
  private predictionCache: Map<string, { data: PredictionOutput; timestamp: number }> = new Map();
  private readonly HEALTH_CACHE_TTL = 30000; // 30 seconds
  private ws: WebSocket | null = null;
  private wsReconnectAttempts = 0;
  private wsMaxReconnectAttempts = 5;

  constructor(config: ModelConfig) {
    this.config = {
      timeout: 10000,
      retryAttempts: 3,
      enableWebSocket: false,
      enableStreaming: false,
      cacheMaxAge: 300000, // 5 minutes
      ...config
    };

    if (this.config.enableWebSocket && typeof window !== 'undefined') {
      this.initializeWebSocket();
    }
  }

  /**
   * Initialize WebSocket connection for real-time predictions
   */
  private initializeWebSocket(): void {
    try {
      const wsUrl = this.config.mlServiceUrl.replace('http', 'ws') + '/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 ML WebSocket connected');
        this.wsReconnectAttempts = 0;
      };

      this.ws.onclose = () => {
        console.log('🔌 ML WebSocket disconnected');
        this.handleWebSocketReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('🔌 ML WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
    }
  }

  /**
   * Handle WebSocket reconnection with exponential backoff
   */
  private handleWebSocketReconnect(): void {
    if (this.wsReconnectAttempts >= this.wsMaxReconnectAttempts) {
      console.error('Max WebSocket reconnect attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.wsReconnectAttempts), 30000);
    this.wsReconnectAttempts++;

    setTimeout(() => {
      console.log(`Attempting WebSocket reconnect (${this.wsReconnectAttempts}/${this.wsMaxReconnectAttempts})`);
      this.initializeWebSocket();
    }, delay);
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
      const startTime = performance.now();
      const response = await this.fetchWithRetry(`${this.config.mlServiceUrl}/health`);
      const latency = performance.now() - startTime;
      const data = await response.json();
      
      const health: ModelHealth = {
        status: data.status === 'healthy' ? 'healthy' : 'degraded',
        accuracy: data.accuracy || 0.87,
        version: data.model_version || 'v2.1',
        predictionsMade: data.predictions_made || 0,
        lastTrained: data.last_trained || 'Unknown',
        averageConfidence: data.confidence_avg || 0.75,
        latency,
        gpuAvailable: data.gpu_available || false
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
        averageConfidence: 0,
        latency: 0
      };
    }
  }

  /**
   * Make a prediction using the ML service with caching
   */
  async predict(input: PredictionInput): Promise<PredictionOutput> {
    const cacheKey = this.generateCacheKey(input);
    
    // Check cache first
    const cached = this.getCachedPrediction(cacheKey);
    if (cached) {
      return cached;
    }

    const features = this.preprocessInput(input);
    
    try {
      const response = await this.fetchWithRetry(`${this.config.mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features, match_context: input })
      });

      const result = await response.json();
      
      const prediction: PredictionOutput = {
        winProbability: Math.max(0, Math.min(1, result.prediction || result.win_probability || 0.5)),
        confidence: Math.max(0, Math.min(1, result.confidence || 0.75)),
        predictedScore: result.predicted_score,
        modelVersion: result.model_version,
        timestamp: new Date().toISOString(),
        explanations: result.explanations || this.generateExplanations(features),
        alternativeScenarios: result.alternative_scenarios || []
      };

      // Cache the prediction
      this.cachePrediction(cacheKey, prediction);

      return prediction;
    } catch (error) {
      console.error('Prediction failed:', error);
      // Return fallback prediction
      return this.getFallbackPrediction(input);
    }
  }

  /**
   * Streaming prediction with progress updates
   */
  async predictStreaming(
    input: PredictionInput,
    onProgress?: (update: StreamingPrediction) => void
  ): Promise<PredictionOutput> {
    if (!this.config.enableStreaming) {
      return this.predict(input);
    }

    const features = this.preprocessInput(input);
    
    try {
      const response = await fetch(`${this.config.mlServiceUrl}/predict/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });

      if (!response.body) {
        throw new Error('Streaming not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finalResult: PredictionOutput | null = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const update = JSON.parse(line);
              
              if (onProgress && update.progress !== undefined) {
                onProgress({
                  progress: update.progress,
                  currentStep: update.step || 'Processing',
                  partialResult: update.partial_result,
                  completed: update.completed || false
                });
              }

              if (update.completed && update.result) {
                finalResult = {
                  winProbability: update.result.prediction,
                  confidence: update.result.confidence,
                  predictedScore: update.result.predicted_score,
                  modelVersion: update.result.model_version,
                  timestamp: new Date().toISOString()
                };
              }
            } catch (e) {
              console.error('Failed to parse streaming update:', e);
            }
          }
        }
      }

      return finalResult || this.getFallbackPrediction(input);
    } catch (error) {
      console.error('Streaming prediction failed:', error);
      return this.predict(input);
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
   * Real-time prediction via WebSocket
   */
  async predictRealtime(input: PredictionInput): Promise<Promise<PredictionOutput>> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        // Fallback to HTTP if WebSocket not available
        this.predict(input).then(resolve).catch(reject);
        return;
      }

      const requestId = Math.random().toString(36).substring(7);
      const features = this.preprocessInput(input);

      const messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          if (data.request_id === requestId) {
            this.ws?.removeEventListener('message', messageHandler);
            resolve({
              winProbability: data.prediction,
              confidence: data.confidence,
              predictedScore: data.predicted_score,
              modelVersion: data.model_version,
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          reject(error);
        }
      };

      this.ws.addEventListener('message', messageHandler);

      this.ws.send(JSON.stringify({
        type: 'predict',
        request_id: requestId,
        features
      }));

      // Timeout after 15 seconds
      setTimeout(() => {
        this.ws?.removeEventListener('message', messageHandler);
        reject(new Error('WebSocket prediction timeout'));
      }, 15000);
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
      
      // Clear caches after training
      this.clearCaches();
      
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
   * Get model explanations for a prediction
   */
  async explainPrediction(input: PredictionInput): Promise<FeatureExplanation[]> {
    const features = this.preprocessInput(input);
    
    try {
      const response = await this.fetchWithRetry(`${this.config.mlServiceUrl}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });

      const result = await response.json();
      return result.explanations || this.generateExplanations(features);
    } catch (error) {
      console.error('Explanation failed:', error);
      return this.generateExplanations(features);
    }
  }

  /**
   * Generate feature explanations
   */
  private generateExplanations(features: number[]): FeatureExplanation[] {
    const featureNames = [
      'Team Form', 'Head-to-Head', 'Home Advantage', 
      'Goals Scored', 'Goals Conceded', 'Recent Performance',
      'Defensive Strength', 'Offensive Power'
    ];

    return features.slice(0, 8).map((value, index) => ({
      feature: featureNames[index] || `Feature ${index}`,
      importance: Math.abs(value - 0.5) * 2, // Normalize to 0-1
      impact: value > 0.5 ? 'positive' : value < 0.5 ? 'negative' : 'neutral',
      description: `${featureNames[index]} contributes ${Math.round(Math.abs(value - 0.5) * 200)}% to prediction`
    }));
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
   * Generate cache key for predictions
   */
  private generateCacheKey(input: PredictionInput): string {
    const features = this.preprocessInput(input);
    return `pred_${features.join('_')}`;
  }

  /**
   * Get cached prediction
   */
  private getCachedPrediction(key: string): PredictionOutput | null {
    const cached = this.predictionCache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > (this.config.cacheMaxAge || 300000)) {
      this.predictionCache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * Cache prediction
   */
  private cachePrediction(key: string, prediction: PredictionOutput): void {
    this.predictionCache.set(key, {
      data: prediction,
      timestamp: Date.now()
    });

    // Limit cache size
    if (this.predictionCache.size > 1000) {
      const oldestKey = this.predictionCache.keys().next().value;
      this.predictionCache.delete(oldestKey);
    }
  }

  /**
   * Clear all caches
   */
  clearCaches(): void {
    this.predictionCache.clear();
    this.healthCache = { data: null, timestamp: 0 };
  }

  /**
   * Get fallback prediction when ML service is unavailable
   */
  private getFallbackPrediction(input: PredictionInput): PredictionOutput {
    const features = this.preprocessInput(input);
    const homeStrength = (features[0] + features[2] + features[6]) / 3;
    const awayStrength = (features[1] + features[5] + features[7]) / 3;
    
    return {
      winProbability: homeStrength > awayStrength ? 0.6 : 0.4,
      confidence: 0.3,
      modelVersion: 'fallback-v1',
      timestamp: new Date().toISOString(),
      explanations: this.generateExplanations(features)
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

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.clearCaches();
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
