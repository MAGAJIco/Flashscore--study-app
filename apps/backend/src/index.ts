import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { connectDB } from "./config/db";
import { validateProductionEnv, logEnvironmentStatus } from "./utils/validateEnv";
import { BackendErrorBoundary } from "./middleware/globalErrorHandler";

// Core modules
// Core routes
import { healthRoutes } from "./routes/health";
import { authRoutes } from "./routes/auth";
import { errorsRoutes } from "./routes/errors";

// Feature modules (modular architecture)
import { predictionModuleRoutes } from "./modules/predictions/routes";
import { matchModuleRoutes } from "./modules/matches/routes";
import { newsModuleRoutes } from "./modules/news/routes";
import { socialModuleRoutes } from "./modules/social/routes";
import { rewardsModuleRoutes } from "./modules/rewards/routes";
import { kidsModuleRoutes } from "./modules/kids/routes";
// Import the new scraper module routes
import { scraperModuleRoutes } from "./modules/scraper/routes";


// Payment & foundation
import { stripeRoutes } from "./routes/stripe";
import { paymentsRoutes } from "./routes/payment";
import { foundationRoutes } from "./routes/foundation";

const fastify = Fastify({
  logger: true,
  requestTimeout: 30000,
  bodyLimit: 10485760 // 10MB
});

// Security middleware
fastify.register(cors, {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://magajico.com', /\.vercel\.app$/]
    : true,
  credentials: true
});

fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

const startServer = async () => {
  try {
    // Validate environment
    logEnvironmentStatus();
    validateProductionEnv();

    // Connect to MongoDB
    await connectDB();

    // Health check (public)
    await fastify.register(healthRoutes);

    // All API routes under /api prefix
    await fastify.register(async (instance) => {
      // Authentication
      await instance.register(authRoutes, { prefix: "/auth" });

      // Feature modules (organized by domain)
      await instance.register(predictionModuleRoutes, { prefix: "/predictions" });
      await instance.register(matchModuleRoutes, { prefix: "/matches" });
      await instance.register(newsModuleRoutes, { prefix: "/news" });
      await instance.register(socialModuleRoutes, { prefix: "/social" });
      await instance.register(rewardsModuleRoutes, { prefix: "/rewards" });
      await instance.register(kidsModuleRoutes, { prefix: "/kids" });
      // Register the scraper module routes
      await instance.register(scraperModuleRoutes, { prefix: "/scraper" });


      // Payment services
      await instance.register(stripeRoutes, { prefix: "/stripe" });
      await instance.register(paymentsRoutes, { prefix: "/payments" });

      // Foundation & utilities
      await instance.register(foundationRoutes, { prefix: "/foundation" });
      await instance.register(errorsRoutes, { prefix: "/errors" });
    }, { prefix: "/api" });

    // Global error handler
    fastify.setErrorHandler((error, request, reply) => {
      BackendErrorBoundary.handle(error, request, reply);
    });

    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: "0.0.0.0" });

    fastify.log.info(`✅ Server running at http://0.0.0.0:${PORT}`);
    fastify.log.info(`📍 API available at http://0.0.0.0:${PORT}/api`);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    fastify.log.error(`❌ Server error: ${errorMessage}`);
    process.exit(1);
  }
};

startServer();