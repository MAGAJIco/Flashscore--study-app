
export interface Prediction {
  _id?: string;
  id?: string;
  matchId?: string;
  homeTeam: string;
  awayTeam: string;
  prediction: 'home' | 'draw' | 'away';
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  features?: number[];
  source: 'ml' | 'scraper' | 'user' | 'fallback';
  modelVersion?: string;
  userId?: string;
  isCorrect?: boolean;
  stake?: number;
  result?: 'win' | 'loss' | 'pending';
  payout?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface MLPrediction {
  matchId?: string;
  homeTeam?: string;
  awayTeam?: string;
  prediction: 'home' | 'draw' | 'away';
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  model_version?: string;
  modelVersion?: string;
  source?: 'ml' | 'fallback';
  features?: number[];
}

export interface PredictionFactor {
  name: string;
  weight: number;
  value: number;
}
