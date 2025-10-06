// apps/backend/src/routes/health.ts
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';
import fetch from 'node-fetch';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'ok' : 'down';

    return {
      api: 'ok',
      db: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  });
}