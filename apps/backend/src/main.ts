// apps/backend/src/main.ts - Enhanced version with MagajiCo integration
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { connectDB } from "./config/db";

// Existing routes
import { healthRoutes } from "./routes/health";
// import { matchRoutes } from "./routes/matches";
// import { predictionRoutes } from "./routes/predictions";
// import { scraperRoutes } from "./routes/scraper";
// import { mlRoutes } from "./routes/ml";
// import { newsAuthorRoutes } from "./routes/newsAuthors";
// import { newsAuthorRoutes as newsRoutes } from "./routes/news";

// Enhanced MagajiCo routes
// import { enhancedPredictionRoutes } from "./routes/enhanced-predictions";
// import { ceoAnalysisRoutes } from "./routes/ceo-analysis"; // Route file missing
// import { marketIntelligenceRoutes } from "./routes/market-intelligence";

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV === 'development' ? {
      target: 'pino-pretty'
    } : undefined
  }
});

// Security middleware
server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// Rate limiting
server.register(rateLimit, {
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  timeWindow: '1 minute'
});

// Enhanced CORS configuration
const allowedOrigins = [
  'https://flashscore-study-app.vercel.app',
  'https://302a3520-1a25-488e-b2d3-26ceed56ba96-00-4e1xep2o5f5l.kirk.replit.dev',
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined,
  'http://localhost:5000',
  'http://0.0.0.0:5000',
  'http://localhost:3000',
  'http://0.0.0.0:3000'
].filter((origin): origin is string => typeof origin === 'string');

server.register(cors, {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true
});

// Request logging middleware
server.addHook('onRequest', async (request, reply) => {
  request.log.info({
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  }, 'Incoming request');
});

// Response time tracking
server.addHook('onResponse', async (request, reply) => {
  request.log.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    // Fixed: getResponseTime doesn't exist, use elapsedTime
    responseTime: reply.elapsedTime
  }, 'Request completed');
});

// Error handler
server.setErrorHandler((error, request, reply) => {
  request.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method
  }, 'Request error');

  if (process.env.NODE_ENV === 'production') {
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong',
      timestamp: new Date().toISOString()
    });
  } else {
    reply.status(500).send({
      error: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  }
});

// 404 handler
server.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Not Found',
    message: `Route ${request.method} ${request.url} not found`,
    timestamp: new Date().toISOString()
  });
});

// Register existing routes
server.register(healthRoutes, { prefix: "/api" });
// Database-dependent routes commented out until DB is configured
// server.register(matchRoutes, { prefix: "/api" });
// server.register(predictionRoutes, { prefix: "/api" });
// server.register(scraperRoutes, { prefix: "/api" });
// server.register(mlRoutes, { prefix: "/api/ml" });
// server.register(newsAuthorRoutes, { prefix: "/api" });
// server.register(newsRoutes, { prefix: "/api" });

// Register enhanced MagajiCo routes
// server.register(enhancedPredictionRoutes, { prefix: "/api/v2/predictions" });
// server.register(ceoAnalysisRoutes, { prefix: "/api/v2/ceo" }); // Route file missing
// server.register(marketIntelligenceRoutes, { prefix: "/api/v2/market" });

// Root endpoint
server.get('/', async (request, reply) => {
  return {
    name: 'MagajiCo Enhanced Prediction API',
    version: '2.0.0',
    description: 'Advanced sports prediction system with market intelligence',
    endpoints: {
      health: '/api/health',
      predictions_v1: '/api/predictions',
      predictions_v2: '/api/v2/predictions',
      ceo_analysis: '/api/v2/ceo',
      market_intelligence: '/api/v2/market',
      machine_learning: '/api/ml'
    },
    features: [
      'Kalshi-style market intelligence',
      'Pinnacle-sharp odds analysis',
      'Warren Buffett value investing principles',
      'Zuckerberg Meta scaling strategies',
      'MagajiCo 7(1) filter system'
    ],
    documentation: '/api/docs'
  };
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  server.log.info(`Received ${signal}, shutting down gracefully...`);

  try {
    await server.close();
    server.log.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    server.log.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

const start = async () => {
  try {
    await connectDB();
    server.log.info('✅ Database connected successfully');

    await server.listen({
      port: Number(process.env.PORT) || 3000,
      host: "localhost",
    });

    server.log.info({
      port: Number(process.env.PORT) || 3000,
      host: "localhost",
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    }, '🚀 MagajiCo Enhanced Server started successfully');

  } catch (err) {
    server.log.error({ err }, '❌ Failed to start server');
    process.exit(1);
  }
};

start();