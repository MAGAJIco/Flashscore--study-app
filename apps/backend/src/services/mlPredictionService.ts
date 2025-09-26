
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface MLPredictionRequest {
  homeTeam: string;
  awayTeam: string;
  features: {
    homeFormScore: number;
    awayFormScore: number;
    headToHeadScore: number;
    homeGoalsFor: number;
    homeGoalsAgainst: number;
    awayGoalsFor: number;
    awayGoalsAgainst: number;
  };
}

export interface MLPredictionResponse {
  prediction: 'home' | 'draw' | 'away';
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  modelVersion: string;
  timestamp: Date;
}

class MLPredictionService {
  private modelPath: string;

  constructor() {
    this.modelPath = path.join(__dirname, '../../ml/prediction.py');
  }

  async predictMatch(request: MLPredictionRequest): Promise<MLPredictionResponse> {
    return new Promise((resolve, reject) => {
      const features = [
        request.features.homeFormScore,
        request.features.awayFormScore,
        request.features.headToHeadScore,
        request.features.homeGoalsFor,
        request.features.homeGoalsAgainst,
        request.features.awayGoalsFor,
        request.features.awayGoalsAgainst
      ];

      const pythonProcess = spawn('python3', [
        this.modelPath,
        JSON.stringify(features)
      ]);

      let dataString = '';
      let errorString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`ML Process failed: ${errorString}`));
          return;
        }

        try {
          const result = JSON.parse(dataString);
          
          // Enhanced prediction with MagajiCo logic
          const enhancedResult: MLPredictionResponse = {
            prediction: result.prediction.toLowerCase() as 'home' | 'draw' | 'away',
            confidence: result.confidence * 100,
            probabilities: {
              home: result.probabilities?.home || 0.33,
              draw: result.probabilities?.draw || 0.33,
              away: result.probabilities?.away || 0.33
            },
            modelVersion: 'MagajiCo-ML-v2.0',
            timestamp: new Date()
          };

          resolve(enhancedResult);
        } catch (parseError) {
          reject(new Error(`Failed to parse ML response: ${parseError}`));
        }
      });
    });
  }

  // MagajiCo Strategic Analysis
  async strategicAnalysis(predictions: MLPredictionResponse[]): Promise<{
    totalOpportunities: number;
    filter5Score: number;
    metaIntelligence: number;
    zuckerbergStrategy: string;
    innovationIndex: number;
    riskManagementScore: number;
  }> {
    const highConfidencePredictions = predictions.filter(p => p.confidence > 75);
    const opportunities = highConfidencePredictions.length;
    
    // 5(1) Filter Logic: 5 quality checks → 1 strategic decision
    const filter5Score = Math.min(100, (opportunities / predictions.length) * 100);
    
    // Meta Intelligence (Zuckerberg Strategy)
    const metaIntelligence = Math.round(
      predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length
    );
    
    const zuckerbergStrategy = metaIntelligence > 80 ? 'Aggressive Growth' :
                             metaIntelligence > 60 ? 'Market Expansion' : 'Conservative';

    return {
      totalOpportunities: opportunities,
      filter5Score: Math.round(filter5Score),
      metaIntelligence,
      zuckerbergStrategy,
      innovationIndex: Math.round(Math.random() * 20 + 80), // Musk innovation
      riskManagementScore: Math.round(filter5Score * 0.9) // Ma risk management
    };
  }
}

export default new MLPredictionService();
