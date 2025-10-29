
export interface Prediction {
  id: string;
  matchId: string;
  userId: string;
  prediction: 'home' | 'draw' | 'away';
  confidence: number;
  stake?: number;
  createdAt: Date | string;
  result?: 'win' | 'loss' | 'pending';
  payout?: number;
}

export interface MLPrediction {
  matchId: string;
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  confidence: number;
  modelVersion?: string;
  factors?: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  weight: number;
  value: number;
}
