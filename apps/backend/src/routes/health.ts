// apps/backend/src/routes/health.ts
import { FastifyInstance, RouteHandlerMethod } from 'fastify';
import mongoose from 'mongoose';

export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async (request, reply) => {
    try {
      const dbConnected = mongoose.connection.readyState === 1;
      const dbStatus = dbConnected ? 'ok' : 'down';
      const requireDb = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

      // Check ML service
      let mlStatus = 'unknown';
      try {
        const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';
        const mlResponse = await fetch(`${ML_SERVICE_URL}/health`, {
          signal: AbortSignal.timeout(2000)
        }).catch(() => null);
        mlStatus = mlResponse?.ok ? 'ok' : 'down';
      } catch {
        mlStatus = 'down';
      }

      // Determine overall status
      let overallStatus = 'ok';
      if (requireDb && !dbConnected) {
        overallStatus = 'degraded';
      }
      if (!dbConnected && mlStatus === 'down') {
        overallStatus = 'unhealthy';
      }

      const health = {
        status: overallStatus,
        api: 'ok',
        db: {
          status: dbStatus,
          required: requireDb,
          readyState: mongoose.connection.readyState,
          readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
          host: mongoose.connection.host || 'N/A',
          name: mongoose.connection.name || 'N/A'
        },
        ml: {
          status: mlStatus,
          endpoint: process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000'
        },
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          unit: 'MB'
        },
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      };

      // Return appropriate status code
      const statusCode = overallStatus === 'ok' ? 200 : overallStatus === 'degraded' ? 503 : 500;
      reply.code(statusCode);
      return health;
    } catch (error) {
      fastify.log.error({ error }, 'Health check failed');
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
        collections: dbConnected ? await mongoose.connection.db?.listCollections().toArray() : []
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

}