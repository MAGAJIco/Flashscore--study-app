
export interface Team {
  id: string;
  name: string;
  logo?: string;
  shortName?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  league: string;
  startTime: Date | string;
  status: 'scheduled' | 'live' | 'finished' | 'postponed';
  score?: {
    home: number;
    away: number;
  };
  liveMinute?: number;
  venue?: string;
}

export interface LiveMatch extends Match {
  status: 'live';
  liveMinute: number;
  events?: MatchEvent[];
}

export interface MatchEvent {
  type: 'goal' | 'card' | 'substitution' | 'var';
  minute: number;
  team: 'home' | 'away';
  player?: string;
  description?: string;
}
