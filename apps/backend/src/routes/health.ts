
// apps/backend/src/routes/health.ts
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async (request, reply) => {
    const dbConnected = mongoose.connection.readyState === 1;
    const dbStatus = dbConnected ? 'ok' : 'down';
    const requireDb = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

    const health = {
      status: (requireDb && !dbConnected) ? 'degraded' : 'ok',
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
      version: process.env.npm_package_version || '1.0.0'
    };

    // Return 503 if DB is required but not available
    if (requireDb && !dbConnected) {
      reply.code(503);
    }

    return health;
  });

  // Detailed metrics endpoint
  fastify.get('/health/metrics', async (request, reply) => {
    const dbConnected = mongoose.connection.readyState === 1;
    const memUsage = process.memoryUsage();

    return {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        connected: dbConnected,
        host: mongoose.connection.host || 'N/A',
        readyState: mongoose.connection.readyState,
        collections: dbConnected ? await mongoose.connection.db.listCollections().toArray() : []
      },
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
  });

  // Liveness probe (for container orchestration)
  fastify.get('/health/live', async (request, reply) => {
    return { status: 'alive' };
  });

  // Readiness probe (for load balancers)
  fastify.get('/health/ready', async (request, reply) => {
    const dbConnected = mongoose.connection.readyState === 1;
    const requireDb = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

    if (requireDb && !dbConnected) {
      reply.code(503);
      return { status: 'not ready', reason: 'database not connected' };
    }

    return { status: 'ready' };
  });
}
