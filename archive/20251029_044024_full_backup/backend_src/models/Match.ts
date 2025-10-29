
import { Schema, model, Document } from "mongoose";

export interface IOdds {
  home: number;
  draw?: number;
  away: number;
  source: string;
  timestamp: Date;
}

export interface IMatch extends Document {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  competition: string;
  score?: {
    home: number;
    away: number;
  };
  status: "scheduled" | "live" | "completed" | "postponed" | "cancelled";
  odds: IOdds[];
  metadata: {
    venue?: string;
    referee?: string;
    weather?: string;
    attendance?: number;
  };
  predictions: Schema.Types.ObjectId[];
  scrapedAt: Date;
}

const oddsSchema = new Schema<IOdds>({
  home: { type: Number, required: true },
  draw: { type: Number },
  away: { type: Number, required: true },
  source: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const matchSchema = new Schema<IMatch>(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
    competition: { type: String, required: true },
    score: {
      home: { type: Number },
      away: { type: Number }
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "postponed", "cancelled"],
      default: "scheduled",
    },
    odds: [oddsSchema],
    metadata: {
      venue: { type: String },
      referee: { type: String },
      weather: { type: String },
      attendance: { type: Number }
    },
    predictions: [{ type: Schema.Types.ObjectId, ref: "Prediction" }],
    scrapedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Compound index for efficient queries
matchSchema.index({ homeTeam: 1, awayTeam: 1, date: 1 });
matchSchema.index({ competition: 1, date: -1 });

export const Match = model<IMatch>("Match", matchSchema);
