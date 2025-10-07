// apps/backend/src/main.ts - Enhanced version with MagajiCo integration
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { connectDB } from "./config/db";

// Existing routes
import { healthRoutes } from "./routes/health";
import { foundationRoutes } from "./routes/foundation";
import newsAuthorsRoutes from "./routes/newsAuthors";
import { mlRoutes } from "./routes/ml";
// import matchRoutes from "./routes/matches";
import predictionsRoutes from "./routes/predictions";
import authorsRoutes from "./routes/authors";
// import scraperRoutes from "./routes/scraper";
// import newsRoutes from "./routes/news";

// Enhanced MagajiCo routes
import { enhancedPredictionRoutes } from "./routes/enhanced-predictions";
// import { ceoAnalysisRoutes } from "./routes/ceo-analysis"; // Route file missing
import { marketIntelligenceRoutes } from "./routes/market-intelligence";
import { confidenceEvolutionRoutes } from "./routes/confidence-evolution";

// Payments route
import paymentsRoutes from './routes/payments';

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
const normalizeOrigin = (url: string): string => {
  // Trim whitespace
  let normalized = url.trim();

  // Remove trailing slash
  if (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
};

const buildAllowedOrigins = (): string[] => {
  const origins: string[] = [];

  // Add origins from environment variable (comma-separated)
  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS
      .split(',')
      .map(o => normalizeOrigin(o))
      .filter(o => o.length > 0);
    origins.push(...envOrigins);
  }

  // Add frontend URL if specified
  if (process.env.FRONTEND_URL) {
    origins.push(normalizeOrigin(process.env.FRONTEND_URL));
  }

  // Add Replit dev domain (normalize to handle full URLs or bare domains)
  if (process.env.REPLIT_DEV_DOMAIN) {
    const replitDomain = process.env.REPLIT_DEV_DOMAIN.trim();
    // Check if it already has a scheme
    const replitUrl = replitDomain.startsWith('http')
      ? replitDomain
      : `https://${replitDomain}`;
    origins.push(normalizeOrigin(replitUrl));
  }

  // Development fallbacks (normalize these too for consistency)
  if (process.env.NODE_ENV === 'development') {
    origins.push(
      normalizeOrigin('http://localhost:5000'),
      normalizeOrigin('http://0.0.0.0:5000'),
      normalizeOrigin('http://localhost:3001'),
      normalizeOrigin('http://0.0.0.0:3001')
    );
  }

  return [...new Set(origins)]; // Remove duplicates
};

const allowedOrigins = buildAllowedOrigins();

server.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Normalize the incoming origin for comparison
    const normalizedOrigin = normalizeOrigin(origin);

    // Check if origin is in allowed list
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Allow all origins in development mode
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Reject in production
    server.log.warn({ origin, normalizedOrigin, allowedOrigins }, 'CORS request rejected');
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
    statusCode: reply.statusCode
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
server.register(foundationRoutes, { prefix: "/api" });
server.register(newsAuthorsRoutes, { prefix: "/api" });
server.register(mlRoutes, { prefix: "/api/ml" });
server.register(predictionsRoutes, { prefix: "/api/predictions" });
// server.register(matchRoutes, { prefix: "/api" });
// server.register(scraperRoutes, { prefix: "/api" });
// server.register(newsRoutes, { prefix: "/api" });

// Register enhanced MagajiCo routes
// server.register(enhancedPredictionRoutes, { prefix: "/api/v2/predictions" });
// server.register(ceoAnalysisRoutes, { prefix: "/api/v2/ceo" }); // Route file missing
// server.register(marketIntelligenceRoutes, { prefix: "/api/v2/market" });
server.register(confidenceEvolutionRoutes, { prefix: "/api/confidence-evolution" });
server.register(authorsRoutes, { prefix: "/api/authors" });

// Register payments routes
server.register(paymentsRoutes, { prefix: '/api/payments' });


// Root endpoint
server.get('/', async (request, reply) => {
  return {
    name: 'MagajiCo Enhanced Prediction API',
    version: '2.0.0',
    description: 'Advanced sports prediction system with market intelligence',
    endpoints: {
      health: '/api/health',
      foundation: '/api/foundation/:userId',
      foundation_leaderboard: '/api/foundation/leaderboard',
      predictions_v1: '/api/predictions',
      predictions_v2: '/api/v2/predictions',
      ceo_analysis: '/api/v2/ceo',
      market_intelligence: '/api/v2/market',
      machine_learning: '/api/ml',
      authors: '/api/authors',
      payments: '/api/payments'
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

    const port = Number(process.env.PORT) || 3001;
    const host = '0.0.0.0';

    await server.listen({
      port,
      host,
    });

    server.log.info({
      port,
      host,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    }, '🚀 MagajiCo Enhanced Server started successfully');

  } catch (err) {
    server.log.error({ err }, '❌ Failed to start server');
    process.exit(1);
  }
};

start();