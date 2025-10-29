
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserReward extends Document {
  userId: string;
  totalPoints: number;
  achievements: {
    name: string;
    earnedAt: Date;
  }[];
  streak: number;
  lastActiveDate?: Date;
}

const UserRewardSchema = new Schema<IUserReward>(
  {
    userId: { type: String, required: true, unique: true },
    totalPoints: { type: Number, default: 0 },
    achievements: [{
      name: String,
      earnedAt: Date
    }],
    streak: { type: Number, default: 0 },
    lastActiveDate: Date
  },
  { timestamps: true }
);

export const UserReward = mongoose.model<IUserReward>('UserReward', UserRewardSchema);
