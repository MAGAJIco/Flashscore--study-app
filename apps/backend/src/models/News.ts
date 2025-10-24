
import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  id: number;
  title: string;
  preview: string;
  fullContent: string;
  author: string | {
    id: string;
    name: string;
    icon: string;
    bio?: string;
    expertise?: string[];
    collaborationCount?: number;
  };
  collaborationType?: "prediction" | "analysis" | "community" | "update";
  tags: string[];
  imageUrl?: string;
  isActive: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema: Schema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    preview: { type: String, required: true, maxlength: 500 },
    fullContent: { type: String, required: true },
    author: {
      type: Schema.Types.Mixed,
      required: true,
      default: "Admin"
    },
    collaborationType: {
      type: String,
      enum: ["prediction", "analysis", "community", "update"],
      default: null
    },
    tags: { type: [String], default: [] },
    imageUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    viewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Indexes for performance
NewsSchema.index({ isActive: 1, createdAt: -1 });
NewsSchema.index({ tags: 1 });

export const News = mongoose.models.News || mongoose.model<INews>("News", NewsSchema);
