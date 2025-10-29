export interface MatchData {
  id: string;
  home: string;
  away: string;
  date: Date;
  score?: string;
  odds?: number;
}

export interface EnhancedMatchData extends MatchData {
  competition: string;
  status: 'scheduled' | 'live' | 'completed';
  additionalStats?: Record<string, any>;
}