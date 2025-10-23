import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role?: string;
  age: number;
  isMinor?: boolean;
  accessRestrictions: {
    bettingAllowed: boolean;
    paymentsAllowed: boolean;
  };
  coppaConsent?: {
    granted: boolean;
    grantedAt?: Date;
    parentEmail?: string;
    verificationToken?: string;
  };
  preferences?: {
    notifications?: boolean;
    theme?: string;
    language?: string;
  };
  lastActive?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'user'
  },
  age: {
    type: Number,
    required: true
  },
  isMinor: {
    type: Boolean,
    default: false
  },
  accessRestrictions: {
    bettingAllowed: {
      type: Boolean,
      default: true
    },
    paymentsAllowed: {
      type: Boolean,
      default: true
    }
  },
  coppaConsent: {
    granted: {
      type: Boolean,
      default: false
    },
    grantedAt: Date,
    parentEmail: String,
    verificationToken: String
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'light'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  lastActive: Date
}, { timestamps: true });

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