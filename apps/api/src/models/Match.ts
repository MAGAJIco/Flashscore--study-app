
import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  competition: string;
  status: 'scheduled' | 'live' | 'completed' | 'postponed' | '1H' | '2H';
  score?: {
    home: number;
    away: number;
  };
  odds?: {
    home: number;
    draw: number;
    away: number;
    source?: string;
    timestamp?: Date;
  }[];
  venue?: string;
  scrapedAt?: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
    competition: { type: String, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'postponed', '1H', '2H'],
      default: 'scheduled'
    },
    score: {
      home: Number,
      away: Number
    },
    odds: [{
      home: Number,
      draw: Number,
      away: Number,
      source: String,
      timestamp: Date
    }],
    venue: String,
    scrapedAt: Date
  },
  { timestamps: true }
);

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
