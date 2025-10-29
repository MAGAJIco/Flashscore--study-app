import mongoose, { Schema, Document } from "mongoose";

export interface INewsAuthor extends Document {
  id: string;
  name: string;
  icon: string;
  bio: string;
  expertise: string[];
  collaborationCount: number;
  isActive: boolean;
  lastCollaboration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsAuthorSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  icon: { type: String, required: true, default: '👤' },
  bio: { type: String, maxlength: 500, default: '' },
  expertise: { type: [String], default: [] },
  collaborationCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  lastCollaboration: { type: Date, default: null }
}, { timestamps: true });

// Indexes
NewsAuthorSchema.index({ isActive: 1 });
NewsAuthorSchema.index({ expertise: 1 });
NewsAuthorSchema.index({ collaborationCount: -1 });

export const NewsAuthor = mongoose.models.NewsAuthor || mongoose.model<INewsAuthor>('NewsAuthor', NewsAuthorSchema);