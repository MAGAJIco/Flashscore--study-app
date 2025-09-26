
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Check if MONGODB_URI is provided
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        autoIndex: true,
      });
      console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
      return 'mongodb';
    } else {
      console.log("📊 No MONGODB_URI found, checking for PostgreSQL...");
      
      // If PostgreSQL is available, we could use it instead
      if (process.env.DATABASE_URL) {
        console.log("✅ PostgreSQL database available (not connected via Mongoose)");
        console.log("💡 To use MongoDB, set MONGODB_URI environment variable");
        return 'postgresql';
      } else {
        console.log("⚠️  No database configuration found");
        console.log("💡 Set MONGODB_URI for MongoDB or DATABASE_URL for PostgreSQL");
        return null;
      }
    }
  } catch (err) {
    console.error("❌ Database connection error:", err);
    console.log("⚠️  Running without database connection for development");
    // Don't exit in development, continue without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

// Graceful disconnection
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("📤 MongoDB disconnected");
  } catch (err) {
    console.error("❌ MongoDB disconnect error:", err);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('📤 Mongoose disconnected');
});
