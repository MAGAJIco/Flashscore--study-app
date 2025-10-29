
import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
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
}

const PredictionSchema = new Schema<IPrediction>(
  {
    matchId: String,
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    prediction: {
      type: String,
      enum: ['home', 'draw', 'away'],
      required: true
    },
    confidence: { type: Number, required: true, min: 0, max: 100 },
    probabilities: {
      home: { type: Number, required: true },
      draw: { type: Number, required: true },
      away: { type: Number, required: true }
    },
    features: [Number],
    source: {
      type: String,
      enum: ['ml', 'scraper', 'user', 'fallback'],
      default: 'ml'
    },
    modelVersion: String,
    userId: String,
    isCorrect: Boolean
  },
  { timestamps: true }
);

export const Prediction = mongoose.model<IPrediction>('Prediction', PredictionSchema);
