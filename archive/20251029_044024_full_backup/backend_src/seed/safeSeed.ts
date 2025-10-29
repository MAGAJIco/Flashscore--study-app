import mongoose from 'mongoose';
import { NewsAuthor } from '../models/NewsAuthor'; // Named import
import { News } from '../models/News'; // Named import
import { Prediction } from '../models/Predictions'; // Named import
import { User } from '../models/User'; // Named import

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is required');
  }
  
  await mongoose.connect(mongoUri);
}

// Rest of your seed logic...