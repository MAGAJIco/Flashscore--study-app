// apps/backend/src/config/db.ts
import mongoose from 'mongoose';

interface MagajicoDatabase {
  isConnected?: number;
  connectionType?: 'primary' | 'replica' | 'local';
}

const db: MagajicoDatabase = {};

export const connectDB = async (): Promise<void | null> => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || '';
    const REQUIRE_DB = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

    if (!MONGODB_URI) {
      const errorMsg = 'MONGODB_URI environment variable is not set';

      if (REQUIRE_DB) {
        console.error(`❌ ${errorMsg} - Database is required in this environment`);
        throw new Error(errorMsg);
      }

      console.warn('⚠️  MONGODB_URI not set, running without database (development mode)');
      console.warn('⚠️  Set REQUIRE_DB=true to enforce database connection');
      return null;
    }

    console.log('🔄 Connecting to MongoDB...');

    // Determine connection type
    if (MONGODB_URI.includes('mongodb+srv')) {
      db.connectionType = 'primary';
      console.log('📡 Using MongoDB Atlas (Primary)');
    } else if (MONGODB_URI.includes('replica')) {
      db.connectionType = 'replica';
      console.log('🔗 Using Replica Set');
    } else {
      db.connectionType = 'local';
      console.log('💻 Using Local MongoDB');
    }

    // MongoDB connection options
    const options: Record<string, any> = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    };

    // Add server API settings for Atlas connections
    if (db.connectionType === 'primary') {
      options.serverApi = {
        version: '1',
        strict: true,
        deprecationErrors: true,
      };
    }

    // Add TLS certificate for production
    if (process.env.NODE_ENV === 'production' && process.env.TLS_CERT_PATH) {
      options.tlsCertificateKeyFile = process.env.TLS_CERT_PATH;
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI, options);

    db.isConnected = conn.connection.readyState;

    console.log('✅ MongoDB Connected Successfully');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔌 Connection State: ${getConnectionState(conn.connection.readyState)}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err: Error) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
      db.isConnected = 0;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🛑 Mongoose connection closed due to app termination');
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ MongoDB connection error:', err);

    if (err instanceof Error) {
      console.error('Error details:', err.message);
      console.error('Stack trace:', err.stack);
    } else {
      console.error('Unknown error:', err);
    }

    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Retrying connection in 5 seconds...');
      setTimeout(() => connectDB(), 50000);
    } else {
      process.exit(1);
    }
  }
};

function getConnectionState(state: number): string {
  const states: Record<number, string> = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    99: 'Uninitialized'
  };
  return states[state] || 'Unknown';
}

export const disconnectDB = async (): Promise<void> => {
  try {
    if (db.isConnected === 1) {
      await mongoose.connection.close();
      db.isConnected = 0;
      console.log('✅ MongoDB disconnected successfully');
    }
  } catch (err) {
    console.error('❌ Error disconnecting from MongoDB:', err);
    if (err instanceof Error) {
      throw new Error(`Failed to disconnect: ${err.message}`);
    }
    throw err;
  }
};

export const getDBStatus = () => {
  return {
    isConnected: db.isConnected === 1,
    connectionType: db.connectionType || 'unknown',
    readyState: mongoose.connection.readyState,
    readyStateText: getConnectionState(mongoose.connection.readyState),
    host: mongoose.connection.host || 'N/A',
    name: mongoose.connection.name || 'N/A'
  };
};

// ✅ FIXED: Line 159 - Added null check for mongoose.connection.db
export const checkDBHealth = async (): Promise<boolean> => {
  try {
    if (db.isConnected !== 1) {
      return false;
    }

    // Add null check before accessing db
    if (!mongoose.connection.db) {
      console.error('❌ Database connection exists but db object is undefined');
      return false;
    }

    await mongoose.connection.db.admin().ping();
    return true;
  } catch (err) {
    console.error('❌ Database health check failed:', err);
    return false;
  }
};

export const verifyConnection = async (): Promise<void> => {
  const REQUIRE_DB = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

  if (!REQUIRE_DB && db.isConnected !== 1) {
    console.warn('⚠️  Database connection not required in this environment');
    return;
  }

  if (db.isConnected !== 1) {
    throw new Error('Database connection verification failed: Not connected');
  }

  const isHealthy = await checkDBHealth();
  if (!isHealthy) {
    throw new Error('Database connection verification failed: Health check failed');
  }

  console.log('✅ Database connection verified successfully');
};

export default mongoose;