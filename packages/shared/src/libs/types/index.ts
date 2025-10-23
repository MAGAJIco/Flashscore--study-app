
export interface SportsPrediction {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  prediction: string;
  confidence: number;
  date: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  piCoins: number;
  level: number;
  provider?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MatchData {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  startTime: Date;
}

// Re-export prediction types
export * from './predictions';
