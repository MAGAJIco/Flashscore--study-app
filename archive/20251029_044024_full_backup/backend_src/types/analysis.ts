export interface TeamStats {
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  avgPossession: number;
  shotsPerGame: number;
}

export interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeForm: string[];
  awayForm: string[];
  headToHead: string[];
  homeStats: TeamStats;
  awayStats: TeamStats;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
  venue?: 'home' | 'neutral';
  importance?: 'low' | 'medium' | 'high';
}