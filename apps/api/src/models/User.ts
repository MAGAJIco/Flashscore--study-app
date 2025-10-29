
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  role: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, default: 'user' }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
