
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  piCoins: number;
  level: number;
  predictions: Schema.Types.ObjectId[];
  createdAt: Date;
  lastActive: Date;
  age: number;
  ageVerified: boolean;
  isMinor: boolean;
  parentalConsent?: {
    provided: boolean;
    parentEmail: string;
    consentDate: Date;
  };
  accessRestrictions: {
    bettingAllowed: boolean;
    paymentsAllowed: boolean;
    fullContentAccess: boolean;
  };
  preferences: {
    favoriteLeagues: string[];
    notifications: boolean;
    theme: 'light' | 'dark';
  };
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    piCoins: { type: Number, default: 100 },
    level: { type: Number, default: 1 },
    predictions: [{ type: Schema.Types.ObjectId, ref: "Prediction" }],
    lastActive: { type: Date, default: Date.now },
    age: { type: Number, required: true, min: 13, max: 120 },
    ageVerified: { type: Boolean, default: false },
    isMinor: { type: Boolean, default: false },
    parentalConsent: {
      provided: { type: Boolean, default: false },
      parentEmail: { type: String },
      consentDate: { type: Date }
    },
    accessRestrictions: {
      bettingAllowed: { type: Boolean, default: true },
      paymentsAllowed: { type: Boolean, default: true },
      fullContentAccess: { type: Boolean, default: true }
    },
    preferences: {
      favoriteLeagues: [{ type: String }],
      notifications: { type: Boolean, default: true },
      theme: { type: String, enum: ['light', 'dark'], default: 'light' }
    }
  },
  { timestamps: true }
);

// Middleware to set access restrictions based on age
userSchema.pre('save', function(next) {
  if (this.isMinor || this.age < 18) {
    this.accessRestrictions.bettingAllowed = false;
    this.accessRestrictions.paymentsAllowed = false;
    this.isMinor = true;
  } else {
    this.accessRestrictions.bettingAllowed = true;
    this.accessRestrictions.paymentsAllowed = true;
    this.isMinor = false;
  }
  next();
});

export const User = model<IUser>("User", userSchema);
