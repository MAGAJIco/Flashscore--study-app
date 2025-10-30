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

// Start server
async function start() {
  try {
    await connectDB();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '3001');
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log(`✅ API Server running at http://0.0.0.0:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();