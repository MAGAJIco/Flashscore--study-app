
import { mlPredictionService } from '@/services/mlPredictionService';

interface PredictionOutcome {
  features: number[];
  predicted: string;
  actual: string;
  correct: boolean;
}

class AutoTrainingService {
  private outcomes: PredictionOutcome[] = [];
  private readonly MIN_ACCURACY = 0.75;
  private readonly MIN_SAMPLES = 100;

  recordOutcome(features: number[], predicted: string, actual: string) {
    this.outcomes.push({
      features,
      predicted,
      actual,
      correct: predicted === actual
    });

    if (this.outcomes.length >= this.MIN_SAMPLES) {
      this.checkAndRetrain();
    }
  }

  private getCurrentAccuracy(): number {
    const recent = this.outcomes.slice(-this.MIN_SAMPLES);
    const correct = recent.filter(o => o.correct).length;
    return correct / recent.length;
  }

  private async checkAndRetrain() {
    const accuracy = this.getCurrentAccuracy();

    if (accuracy < this.MIN_ACCURACY) {
      console.log(`🔄 Accuracy dropped to ${accuracy.toFixed(2)}, triggering retraining...`);
      
      const trainingData = this.outcomes.slice(-500).map(o => o.features);
      const labels = this.outcomes.slice(-500).map(o => 
        o.actual === 'home' ? 0 : o.actual === 'draw' ? 1 : 2
      );

      try {
        const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://0.0.0.0:8000";
        await fetch(`${ML_SERVICE_URL}/train`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: trainingData, labels })
        });

        console.log('✅ Model retrained successfully');
        this.outcomes = []; // Reset tracking
      } catch (error) {
        console.error('❌ Auto-retraining failed:', error);
      }
    }
  }

  getStats() {
    return {
      totalPredictions: this.outcomes.length,
      currentAccuracy: this.getCurrentAccuracy(),
      needsRetraining: this.getCurrentAccuracy() < this.MIN_ACCURACY
    };
  }
}

export const autoTrainingService = new AutoTrainingService();
export default autoTrainingService;
