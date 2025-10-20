// Example additions to your shared user model.
// Adapt to your actual ORM (Mongoose, TypeORM, Prisma).
// packages/shared/src/libs/models/user.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ICoppaConsent {
  status: "pending" | "approved" | "rejected" | null;
  parentEmail?: string | null;
  requestedAt?: Date | null;
  verifiedAt?: Date | null;
}

export interface IUser extends Document {
  email: string;
  age?: number | null;
  isUnder13?: boolean;
  kidsMode?: boolean;
  coppaConsent?: ICoppaConsent;
  // ...other fields
}

const CoppaConsentSchema = new Schema<ICoppaConsent>({
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", null],
    default: null,
  },
  parentEmail: { type: String, default: null },
  requestedAt: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
});

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    age: { type: Number, default: null },
    isUnder13: { type: Boolean, default: false },
    kidsMode: { type: Boolean, default: false },
    coppaConsent: { type: CoppaConsentSchema, default: {} },
    // ... existing fields
  },
  { timestamps: true },
);
export interface user {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "user";
  createdAt: Date;
  updatedAt: Date;
}
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
