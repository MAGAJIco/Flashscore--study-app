import Fastify from 'fastify';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import { newsModuleRoutes } from './modules/news/routes';

const fastify = Fastify({
  logger: true,
});

// CORS
fastify.register(cors, {
  origin: true,
  credentials: true,
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/magajico';
mongoose.connect(MONGODB_URI)
  .then(() => fastify.log.info('✅ Connected to MongoDB'))
  .catch((err) => fastify.log.error('❌ MongoDB connection error:', err));

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', service: 'api', timestamp: new Date().toISOString() };
});

// ML Service proxy
fastify.get('/api/ml/health', async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();
    return { ml_service: data, status: 'connected' };
  } catch (error) {
    return { ml_service: null, status: 'disconnected', error: String(error) };
  }
});

// Register routes
fastify.register(newsModuleRoutes, { prefix: '/api/news' });

// Start server
const start = async () => {
  try {
    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    fastify.log.info(`✅ API Server running at http://0.0.0.0:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();