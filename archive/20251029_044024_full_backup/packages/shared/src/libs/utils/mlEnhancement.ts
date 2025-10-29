
/**
 * Machine Learning Enhancement Utilities
 * Advanced ML features for prediction optimization
 */

export interface MLModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastTrained: Date;
  features: string[];
  hyperparameters: Record<string, any>;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  impact: 'positive' | 'negative';
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  rocAuc?: number;
}

class MLEnhancement {
  private models: Map<string, MLModel> = new Map();

  // Register a new model
  registerModel(model: MLModel): void {
    this.models.set(model.id, model);
    this.saveModels();
  }

  // Get feature importance analysis
  analyzeFeatureImportance(predictions: Array<{ features: Record<string, number>; correct: boolean }>): FeatureImportance[] {
    const featureNames = Object.keys(predictions[0]?.features || {});
    
    return featureNames.map(feature => {
      const correctPredictions = predictions.filter(p => p.correct);
      const incorrectPredictions = predictions.filter(p => !p.correct);

      const correctAvg = correctPredictions.reduce((sum, p) => sum + (p.features[feature] || 0), 0) / correctPredictions.length;
      const incorrectAvg = incorrectPredictions.reduce((sum, p) => sum + (p.features[feature] || 0), 0) / incorrectPredictions.length;

      const importance = Math.abs(correctAvg - incorrectAvg);
      const impact: 'positive' | 'negative' = correctAvg > incorrectAvg ? 'positive' : 'negative';

      return { feature, importance, impact };
    }).sort((a, b) => b.importance - a.importance);
  }

  // Calculate model performance metrics
  calculatePerformance(predictions: Array<{ predicted: boolean; actual: boolean }>): ModelPerformance {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    predictions.forEach(({ predicted, actual }) => {
      if (predicted && actual) tp++;
      else if (predicted && !actual) fp++;
      else if (!predicted && !actual) tn++;
      else fn++;
    });

    const accuracy = (tp + tn) / predictions.length;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix: [[tp, fp], [fn, tn]]
    };
  }

  // Auto-tune hyperparameters
  autoTuneHyperparameters(
    baseParams: Record<string, number>,
    performanceCallback: (params: Record<string, number>) => number
  ): Record<string, number> {
    const paramRanges: Record<string, number[]> = {};
    
    // Generate search space
    for (const [key, value] of Object.entries(baseParams)) {
      paramRanges[key] = [value * 0.5, value, value * 1.5, value * 2];
    }

    let bestParams = baseParams;
    let bestScore = performanceCallback(baseParams);

    // Simple grid search
    const keys = Object.keys(baseParams);
    const tryParams = (index: number, current: Record<string, number>) => {
      if (index === keys.length) {
        const score = performanceCallback(current);
        if (score > bestScore) {
          bestScore = score;
          bestParams = { ...current };
        }
        return;
      }

      const key = keys[index];
      for (const value of paramRanges[key]) {
        tryParams(index + 1, { ...current, [key]: value });
      }
    };

    tryParams(0, {});
    return bestParams;
  }

  // Ensemble predictions (combine multiple models)
  ensemblePredictions(predictions: Array<{ modelId: string; prediction: number; confidence: number }>): { prediction: number; confidence: number } {
    const weightedSum = predictions.reduce((sum, p) => {
      const model = this.models.get(p.modelId);
      const weight = model ? model.accuracy : 0.5;
      return sum + (p.prediction * weight * p.confidence);
    }, 0);

    const totalWeight = predictions.reduce((sum, p) => {
      const model = this.models.get(p.modelId);
      const weight = model ? model.accuracy : 0.5;
      return sum + (weight * p.confidence);
    }, 0);

    const prediction = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
    const confidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;

    return { prediction, confidence };
  }

  // Detect concept drift (model degradation)
  detectConceptDrift(
    recentPerformance: number[],
    historicalAverage: number,
    threshold: number = 0.1
  ): { isDrifting: boolean; severity: number } {
    const recentAvg = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length;
    const drift = Math.abs(recentAvg - historicalAverage);
    const severity = drift / historicalAverage;

    return {
      isDrifting: severity > threshold,
      severity
    };
  }

  // A/B test models
  abTestModels(modelA: string, modelB: string, testSize: number = 100): { winner: string; improvement: number } {
    const performanceA = Math.random(); // Simulated - replace with actual performance
    const performanceB = Math.random();

    const winner = performanceA > performanceB ? modelA : modelB;
    const improvement = Math.abs(performanceA - performanceB) * 100;

    return { winner, improvement };
  }

  // Generate synthetic training data
  generateSyntheticData(
    realData: Array<Record<string, number>>,
    count: number
  ): Array<Record<string, number>> {
    const synthetic: Array<Record<string, number>> = [];

    for (let i = 0; i < count; i++) {
      const sample1 = realData[Math.floor(Math.random() * realData.length)];
      const sample2 = realData[Math.floor(Math.random() * realData.length)];

      const syntheticSample: Record<string, number> = {};
      for (const key of Object.keys(sample1)) {
        const alpha = Math.random();
        syntheticSample[key] = alpha * sample1[key] + (1 - alpha) * sample2[key];
      }

      synthetic.push(syntheticSample);
    }

    return synthetic;
  }

  private saveModels(): void {
    if (typeof localStorage === 'undefined') return;
    const modelsArray = Array.from(this.models.values());
    localStorage.setItem('ml_models', JSON.stringify(modelsArray));
  }

  private loadModels(): void {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem('ml_models');
    if (stored) {
      try {
        const modelsArray: MLModel[] = JSON.parse(stored);
        modelsArray.forEach(model => this.models.set(model.id, model));
      } catch (e) {
        console.error('Failed to load ML models:', e);
      }
    }
  }
}

export const mlEnhancement = new MLEnhancement();
