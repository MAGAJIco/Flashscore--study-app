import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import mongoose from "mongoose";
import newsAuthorsRoutes from "./routes/newsAuthors.js";
import paymentsRoutes from "./routes/payment.js";
import newsRoutes from "./routes/news.js";
import predictionsRoutes from "./routes/predictions.js";
import { matchRoutes } from "./routes/matches.js";
import coppaRoutes from "./routes/coppa.js";
import errorsRoutes from "./routes/errors.js";
import { healthRoutes } from "./routes/health.js";
import { ErrorLog } from './models/ErrorLog';

// Create Fastify instance
const fastify = Fastify({
  logger: true
});

// Enable CORS with secure allowlist
const allowedOrigins: string[] = [];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

if (process.env.REPLIT_DEV_DOMAIN) {
  allowedOrigins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
}

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5000', 'http://127.0.0.1:5000');
}

fastify.register(cors, {
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some(allowed => {
      const normalizedAllowed = allowed.replace(/\/$/, '');
      return normalizedAllowed === normalizedOrigin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      fastify.log.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
});

// Register security plugins
fastify.register(helmet, {
  contentSecurityPolicy: false
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// MongoDB connection with verification
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sportscentral";
const REQUIRE_DB = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

let dbConnectionPromise: Promise<void>;

if (MONGODB_URI) {
  dbConnectionPromise = mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      fastify.log.info("✅ MongoDB connected successfully");
      
      // Verify connection health
      try {
        const isHealthy = await mongoose.connection.db?.admin().ping();
        if (isHealthy) {
          fastify.log.info("✅ Database health check passed");
        }
      } catch (healthErr) {
        fastify.log.error("⚠️  Database health check failed:", healthErr);
        if (REQUIRE_DB) {
          throw healthErr;
        }
      }
    })
    .catch((err) => {
      fastify.log.error("❌ MongoDB connection failed:", err.message);

      if (REQUIRE_DB) {
        fastify.log.error("💥 Database required but connection failed. Exiting...");
        process.exit(1);
      } else {
        fastify.log.warn("⚠️  Running without database (development only)");
      }
    });
} else {
  if (REQUIRE_DB) {
    fastify.log.error("💥 MONGODB_URI not set but database is required. Exiting...");
    process.exit(1);
  }
  fastify.log.warn("⚠️  No MONGODB_URI set, running without database");
  dbConnectionPromise = Promise.resolve();
}

// Global error handler
fastify.setErrorHandler(async (error, request, reply) => {
  fastify.log.error(error);

  // Log to database if MongoDB is connected
  if (mongoose.connection.readyState === 1) {
    try {
      await ErrorLog.create({
        type: 'api',
        message: error.message,
        stack: error.stack,
        source: `${request.method} ${request.url}`,
        severity: (error as any).statusCode >= 500 ? 'high' : 'medium',
        metadata: {
          statusCode: (error as any).statusCode,
          method: request.method,
          url: request.url,
          ip: request.ip
        }
      });
    } catch (logError) {
      fastify.log.error({ err: logError }, 'Failed to log error to database');
    }
  }

  const statusCode = (error as any).statusCode || 500;
  reply.status(statusCode).send({
    success: false,
    error: error.message || 'Internal Server Error',
    statusCode
  });
});

// Register routes
fastify.register(healthRoutes, { prefix: "/health" });
fastify.register(newsRoutes, { prefix: "/news" });
fastify.register(newsAuthorsRoutes, { prefix: "/news" });
fastify.register(paymentsRoutes, { prefix: "/api" });
fastify.register(predictionsRoutes, { prefix: "/api/predictions" });
fastify.register(matchRoutes, { prefix: "/matches" });
fastify.register(coppaRoutes, { prefix: "/coppa" });
fastify.register(errorsRoutes, { prefix: "/errors" });

// Start server
const PORT = Number(process.env.PORT) || 3001;
const HOST = '0.0.0.0';

const start = async () => {
  try {
    // Wait for database connection if required
    if (dbConnectionPromise) {
      await dbConnectionPromise;
      fastify.log.info("✅ Database initialization complete");
    }

    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`✅ Backend running at http://${HOST}:${PORT}`);
    fastify.log.info(`📊 Health check: http://${HOST}:${PORT}/health`);
    
    // Final connection status
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    fastify.log.info(`🗄️  Database status: ${dbStatus}`);
  } catch (err) {
    fastify.log.error("💥 Server startup failed:", err);
    process.exit(1);
  }
};

start();