import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import mongoose from "mongoose";
import newsAuthorsRoutes from "./routes/newsAuthors";
import paymentsRoutes from "./routes/payment.js";
import predictionsRoutes from './routes/predictions';
import errorsRoutes from './routes/errors';
import { ErrorLog } from './models/ErrorLog';

import newsRoutes from "./routes/news.js";
import predictionsRoutes from "./routes/predictions.js";
import { matchRoutes } from "./routes/matches.js";
import coppaRoutes from "./routes/coppa.js";
import errorsRoutes from "./routes/errors.js";
import { healthRoutes } from "./routes/health.js";

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
        severity: error.statusCode >= 500 ? 'high' : 'medium',
        metadata: {
          statusCode: error.statusCode,
          method: request.method,
          url: request.url,
          ip: request.ip
        }
      });
    } catch (logError) {
      fastify.log.error('Failed to log error to database:', logError);
    }
  }

  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    success: false,
    error: error.message || 'Internal Server Error',
    statusCode
  });
});

// Enable CORS for frontend access
fastify.register(fastifyCors, {
  origin: ["http://localhost:3001", "http://127.0.0.1:5173"], // adjust to your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sportscentral");
    fastify.log.info("✅ MongoDB connected successfully");
  } catch (error) {
    fastify.log.warn({ error }, "⚠️ MongoDB connection failed - continuing without database");
  }
}

// Register routes
fastify.register(newsAuthorsRoutes, { prefix: "/news" });
fastify.register(paymentsRoutes, { prefix: "/api" });
fastify.register(predictionsRoutes, { prefix: '/api/predictions' });
fastify.register(errorsRoutes, { prefix: '/api' });

await fastify.register(helmet, {
  contentSecurityPolicy: false
});

await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

// No global Content-Type hook needed - let routes set their own MIME types

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sportscentral";
const REQUIRE_DB = process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production';

mongoose
  .connect(MONGODB_URI)
  .then(() => fastify.log.info("✅ MongoDB connected successfully"))
  .catch((err) => {
    fastify.log.error("❌ MongoDB connection failed:", err.message);
    
    if (REQUIRE_DB) {
      fastify.log.error("Database required in production. Exiting...");
      process.exit(1);
    } else {
      fastify.log.warn("⚠️  Running without database (development only)");
    }
  });

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  reply.status(error.statusCode || 500).send({
    error: error.name || 'Internal Server Error',
    message: error.message || 'An unexpected error occurred',
    statusCode: error.statusCode || 500
  });
});

// Register routes
fastify.register(healthRoutes, { prefix: "/health" });
fastify.register(newsRoutes, { prefix: "/news" });
fastify.register(predictionsRoutes, { prefix: "/predictions" });
fastify.register(matchRoutes, { prefix: "/matches" });
fastify.register(coppaRoutes, { prefix: "/coppa" });
fastify.register(errorsRoutes, { prefix: "/errors" });

// Start server
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

fastify.listen({ port: PORT, host: HOST }).then((address) => {
  fastify.log.info(`✅ Backend running at ${address}`);
}).catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
