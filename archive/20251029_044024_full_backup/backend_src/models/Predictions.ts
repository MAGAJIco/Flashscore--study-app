import { Schema, model, Document } from "mongoose";

export interface IPrediction extends Document { /* same as before */ }

const predictionSchema = new Schema<IPrediction>({ /* same as before */ }, { timestamps: true });

predictionSchema.index({ matchId: 1 });
predictionSchema.index({ userId: 1, createdAt: -1 });
predictionSchema.index({ result: 1 });

export const Prediction = model<IPrediction>("Prediction", predictionSchema);