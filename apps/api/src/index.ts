import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { authModuleRoutes } from './modules/auth/routes';
import { matchesModuleRoutes } from './modules/matches/routes';
import { newsModuleRoutes } from './modules/news/routes';
import { predictionsModuleRoutes } from './modules/predictions/routes';
import { rewardsModuleRoutes } from './modules/rewards/routes';
import { scraperModuleRoutes } from './modules/scraper/routes';
import { piCoinModuleRoutes } from './modules/picoins/routes';
import { gracefulDegradationMiddleware } from './middleware/gracefulDegradation';

dotenv.config({ debug: false });

const fastify = Fastify({
  logger: true,
  requestTimeout: 30000,
});

// CORS configuration
fastify.register(cors, {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
});

// Graceful degradation for failed services
fastify.addHook('preHandler', gracefulDegradationMiddleware);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/magajico';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('⚠️  MongoDB connection failed - API will run in limited mode:', message);
  }
}

// Health check
fastify.get('/health', async () => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  };
});

// Register module routes
async function registerRoutes() {
  fastify.register(authModuleRoutes, { prefix: '/api/auth' });
  fastify.register(matchesModuleRoutes, { prefix: '/api/matches' });
  fastify.register(newsModuleRoutes, { prefix: '/api/news' });
  fastify.register(predictionsModuleRoutes, { prefix: '/api/predictions' });
  fastify.register(rewardsModuleRoutes, { prefix: '/api/rewards' });
  fastify.register(scraperModuleRoutes, { prefix: '/api/scraper' });
  fastify.register(piCoinModuleRoutes, { prefix: '/api/picoins' });
}

// Start server with retry logic
async function start(retries = 3) {
  try {
    await connectDB();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '10000');
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log(`✅ API Server running at http://0.0.0.0:${port}`);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE' && retries > 0) {
      console.warn(`⚠️  Port ${process.env.PORT || '3001'} in use, retrying in 2s... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return start(retries - 1);
    }
    fastify.log.error(err);
    console.error('❌ Failed to start server. Please check if another process is using the port.');
    process.exit(1);
  }
}

start();