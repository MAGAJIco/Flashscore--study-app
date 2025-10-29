
import mongoose, { Schema, Document } from 'mongoose';

export interface IPiTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend' | 'transfer';
  description: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  metadata?: any;
}

export interface IPiWallet extends Document {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: IPiTransaction[];
  level: number;
  achievements: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PiTransactionSchema = new Schema({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['earn', 'spend', 'transfer'], required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  metadata: { type: Schema.Types.Mixed }
});

const PiWalletSchema = new Schema<IPiWallet>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    transactions: [PiTransactionSchema],
    level: { type: Number, default: 1 },
    achievements: [{ type: String }]
  },
  { timestamps: true }
);

// Index for leaderboard queries
PiWalletSchema.index({ balance: -1 });
PiWalletSchema.index({ totalEarned: -1 });

export const PiWallet = mongoose.model<IPiWallet>('PiWallet', PiWalletSchema);
