
export interface BasePrediction {
  id: string;
  title: string;
  content?: string;
  sport?: string;
  confidence?: string | number;
  source?: string;
}

export interface DisplayPrediction extends BasePrediction {
  match: string;
  prediction: string;
  status: 'pending' | 'won' | 'lost' | 'active' | 'completed';
}

export interface APIPrediction extends BasePrediction {
  matchDetails?: {
    home: string;
    away: string;
    date: Date;
  };
  authorId?: number;
  result?: 'win' | 'loss' | 'draw';
  publishedAt?: Date;
  createdAt?: Date;
}
