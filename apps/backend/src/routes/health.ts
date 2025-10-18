// apps/backend/src/routes/health.ts
import { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async (request, reply) => {
    try {
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
      } else {
        reply.code(200);
      }

      return health;
    } catch (error) {
      reply.code(500);
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
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
    reply.code(200);
    return { status: 'alive', timestamp: new Date().toISOString() };
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

  // Health check for ML service
  fastify.get("/ml-status", async (request, reply) => {
    try {
      // Check if ML service is actually reachable
      const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';
      const mlResponse = await fetch(`${ML_SERVICE_URL}/health`, {
        signal: AbortSignal.timeout(3000)
      }).catch(() => null);

      const isHealthy = mlResponse?.ok ?? false;
      const statusCode = isHealthy ? 200 : 503;

      return reply.status(statusCode).send({
        status: isHealthy ? "operational" : "degraded",
        version: "MagajiCo-ML-v2.0",
        ceo_dashboard: isHealthy ? "active" : "unavailable",
        strategic_intelligence: isHealthy ? "online" : "offline",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return reply.status(503).send({
        status: "error",
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });
}