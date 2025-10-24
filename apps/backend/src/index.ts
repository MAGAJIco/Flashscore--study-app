import Fastify from "fastify";
import cors from "@fastify/cors";
import { connectDB } from "@/config/db";
import { matchRoutes } from "@/routes/matches";
import { newsRoutes } from "@/routes/news";
import { predictionsRoutes } from "@/routes/prediction";
import { healthRoutes } from "@/routes/health";
import { authRoutes } from "@/routes/auth";
import { stripeRoutes } from "@/routes/stripe";
import { paymentsRoutes } from "@/routes/payment";
import { foundationRoutes } from "@/routes/foundation";
import { errorsRoutes } from "@/routes/errors";
import { newsAuthorsRoutes } from "@/routes/newsAuthors";
import { authorsRoutes } from "@/routes/authors";

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

    // Register routes
    await fastify.register(healthRoutes);
    await fastify.register(authRoutes, { prefix: "/api/auth" });
    await fastify.register(predictionsRoutes, { prefix: "/api/predictions" });
    await fastify.register(matchRoutes, { prefix: "/api" });
    await fastify.register(newsRoutes, { prefix: "/api/news" });
    await fastify.register(newsAuthorsRoutes, { prefix: "/api/news-authors" });
    await fastify.register(foundationRoutes, { prefix: "/api" });
    await fastify.register(errorsRoutes, { prefix: "/api" });
    await fastify.register(stripeRoutes, { prefix: "/api/stripe" });
    await fastify.register(paymentsRoutes, { prefix: "/api/payments" });

    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    fastify.log.info(`✅ Backend running at http://0.0.0.0:${PORT}`);
    fastify.log.info(`📍 Core Routes Connected:`);
    fastify.log.info(`   ✓ Health & Monitoring: /health, /health/metrics`);
    fastify.log.info(`   ✓ Predictions: /api/predictions/* (ML-powered)`);
    fastify.log.info(`   ✓ Matches: /api/matches/* (MongoDB)`);
    fastify.log.info(`   ✓ News: /api/news/* (MongoDB)`);
    fastify.log.info(`   ✓ Authors: /api/news-authors/* (Service Layer)`);
    fastify.log.info(`   ✓ Foundation: /api/foundation/:userId (MongoDB)`);
    fastify.log.info(`   ✓ Errors: /api/errors/* (MongoDB)`);
    fastify.log.info(`   ✓ Authentication: /api/auth/* (JWT)`);
    fastify.log.info(`   ✓ Stripe Payments: /api/stripe/* (Stripe)`);
    fastify.log.info(`   ✓ Payments: /api/payments/* (General)`);
    fastify.log.info(`📊 Models: Match, News, NewsAuthor, Prediction, User, Foundation, ErrorLog, Payment`);
  } catch (err: unknown) {
    if (err instanceof Error) fastify.log.error(`❌ Server error: ${err.message}`);
    else fastify.log.error(`❌ Server error: ${err}`);
    process.exit(1);
  }
};

startServer();
// Re-export all major backend modules
export * from './config';
export * from './models';
export * from './routes';
export * from './services';
export * from './middleware';
export * from './utils';
export * from './types';
