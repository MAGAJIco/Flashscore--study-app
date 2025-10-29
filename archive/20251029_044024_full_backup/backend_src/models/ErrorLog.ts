
import { Schema, model, Document } from "mongoose";

export interface IErrorLog extends Document {
  type: 'scraper' | 'prediction' | 'api' | 'system';
  message: string;
  stack?: string;
  metadata?: Record<string, any>;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

const errorLogSchema = new Schema<IErrorLog>(
  {
    type: { 
      type: String, 
      enum: ['scraper', 'prediction', 'api', 'system'], 
      required: true 
    },
    message: { type: String, required: true },
    stack: { type: String },
    metadata: { type: Schema.Types.Mixed },
    source: { type: String, required: true },
    severity: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'critical'], 
      default: 'medium' 
    },
    resolved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const ErrorLog = model<IErrorLog>("ErrorLog", errorLogSchema);
