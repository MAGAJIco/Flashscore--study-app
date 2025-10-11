// apps/backend/src/routes/health.ts
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    const dbConnected = mongoose.connection.readyState === 1;
    const dbStatus = dbConnected ? 'ok' : 'down';
    const requireDb = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

    const health = {
      api: 'ok',
      db: {
        status: dbStatus,
        required: requireDb,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host || 'N/A',
        name: mongoose.connection.name || 'N/A'
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    // Return 503 if DB is required but not available
    if (requireDb && !dbConnected) {
      reply.code(503);
    }

    return health;
  });
}