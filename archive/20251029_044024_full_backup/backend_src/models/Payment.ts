import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  provider: 'stripe' | 'paypal' | 'pi_network';
  providerTransactionId: string;
  description?: string;
  metadata?: Record<string, any>;
  isMinorTransaction: boolean;
  ageVerified: boolean;
  userAge?: number;
  parentalConsent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    provider: {
      type: String,
      enum: ['stripe', 'paypal', 'pi_network'],
      required: true,
    },
    providerTransactionId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    isMinorTransaction: {
      type: Boolean,
      default: false,
    },
    ageVerified: {
      type: Boolean,
      default: false,
    },
    userAge: {
      type: Number,
    },
    parentalConsent: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
PaymentSchema.index({ userId: 1, createdAt: -1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ providerTransactionId: 1 }, { unique: true });

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
