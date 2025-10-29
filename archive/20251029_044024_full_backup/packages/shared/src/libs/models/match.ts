// packages/shared/src/libs/models/match.ts
import { Team } from "./team";

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: Date;
  competition: string;
  status: "scheduled" | "live" | "completed";
  score?: {
    home: number;
    away: number;
  };
  createdAt: Date;
  updatedAt: Date;
}