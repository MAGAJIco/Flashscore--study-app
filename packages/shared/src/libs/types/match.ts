
export interface Team {
  id: string;
  name: string;
  logo?: string;
  shortName?: string;
}

export interface Match {
  _id?: string;
  id?: string;
  homeTeam: string;
  awayTeam: string;
  date: Date | string;
  competition: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed' | '1H' | '2H';
  score?: {
    home: number;
    away: number;
  };
  odds?: Array<{
    home: number;
    draw: number;
    away: number;
    source?: string;
    timestamp?: Date | string;
  }>;
  venue?: string;
  scrapedAt?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface LiveMatch extends Match {
  status: 'live' | '1H' | '2H';
  liveMinute?: number;
  events?: MatchEvent[];
}

export interface MatchEvent {
  type: 'goal' | 'card' | 'substitution' | 'var';
  minute: number;
  team: 'home' | 'away';
  player?: string;
  description?: string;
}
