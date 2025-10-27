
import Fastify from "fastify";
import cors from "@fastify/cors";
import { BackendErrorBoundary } from './middleware';
import { connectDB } from "@/config/db";

// Import feature modules
import { predictionModuleRoutes } from "@/modules/predictions/routes";
import { matchModuleRoutes } from "@/modules/matches/routes";
import { socialModuleRoutes } from "@/modules/social/routes";
import { rewardsModuleRoutes } from "@/modules/rewards/routes";
import { kidsModuleRoutes } from "@/modules/kids/routes";
import { newsModuleRoutes } from "@/modules/news/routes";

// Import core routes
import { healthRoutes } from "@/routes/health";
import { authRoutes } from "@/routes/auth";
import { stripeRoutes } from "@/routes/stripe";
import { paymentsRoutes } from "@/routes/payment";
import { foundationRoutes } from "@/routes/foundation";
import { errorsRoutes } from "@/routes/errors";

const fastify = Fastify({ logger: true });

// Enable CORS
fastify.register(cors, {
  origin: true,
  credentials: true
});

fastify.addHook("onRequest", async (_req, reply) => {
  reply.header("Content-Type", "application/json");
});

const startServer = async () => {
  try {
    // Connect to MongoDB (optional if REQUIRE_DB=false)
    await connectDB();

    // Register core services
    await fastify.register(healthRoutes);
    
    // Register all feature modules under /api
    await fastify.register(async (instance) => {
      // Authentication
      await instance.register(authRoutes, { prefix: "/auth" });
      
      // Feature modules
      await instance.register(predictionModuleRoutes, { prefix: "/predictions" });
      await instance.register(matchModuleRoutes, { prefix: "/matches" });
      await instance.register(newsModuleRoutes);
      await instance.register(socialModuleRoutes, { prefix: "/social" });
      await instance.register(rewardsModuleRoutes, { prefix: "/rewards" });
      await instance.register(kidsModuleRoutes, { prefix: "/kids" });
      
      // Core services
      await instance.register(foundationRoutes);
      await instance.register(errorsRoutes);
      await instance.register(stripeRoutes, { prefix: "/stripe" });
      await instance.register(paymentsRoutes, { prefix: "/payments" });
    }, { prefix: "/api" });

    // Global error handler
    fastify.setErrorHandler((error, request, reply) => {
      BackendErrorBoundary.handle(error, request, reply);
    });

    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    
    fastify.log.info(`✅ MagajiCo Backend running at http://0.0.0.0:${PORT}`);
    fastify.log.info(`📦 Feature Modules Loaded:`);
    fastify.log.info(`   ✓ Predictions Module: /api/predictions/*`);
    fastify.log.info(`   ✓ Matches Module: /api/matches/*`);
    fastify.log.info(`   ✓ News Module: /api/news/*, /api/news-authors/*`);
    fastify.log.info(`   ✓ Social Module: /api/social/*`);
    fastify.log.info(`   ✓ Rewards Module: /api/rewards/*`);
    fastify.log.info(`   ✓ Kids Module: /api/kids/*`);
    fastify.log.info(`📍 Core Services:`);
    fastify.log.info(`   ✓ Health Monitoring: /health, /health/metrics`);
    fastify.log.info(`   ✓ Authentication: /api/auth/*`);
    fastify.log.info(`   ✓ Payments: /api/stripe/*, /api/payments/*`);
    fastify.log.info(`   ✓ Foundation: /api/foundation/*`);
    fastify.log.info(`   ✓ Error Logs: /api/errors/*`);
  } catch (err: unknown) {
    if (err instanceof Error) fastify.log.error(`❌ Server error: ${err.message}`);
    else fastify.log.error(`❌ Server error: ${err}`);
    process.exit(1);
  }
};

startServer();
