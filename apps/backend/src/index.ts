import Fastify from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";

// Import all route handlers
import { healthRoutes } from "./routes/health.js";
import { predictionsRoutes } from "./routes/prediction.js";
import { matchRoutes } from "./routes/matches.js";
import { newsRoutes } from "./routes/news.js";
import { newsAuthorsRoutes } from "./routes/newsAuthors.js";
import { foundationRoutes } from "./routes/foundation.js";
import errorsRoutes from "./routes/errors.js";

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
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sportscentral");
    fastify.log.info("✅ MongoDB connected");

    // Register routes
    await fastify.register(healthRoutes);
    await fastify.register(predictionsRoutes, { prefix: "/api/predictions" });
    await fastify.register(matchRoutes, { prefix: "/api" });
    await fastify.register(newsRoutes, { prefix: "/api/news" });
    await fastify.register(newsAuthorsRoutes, { prefix: "/api/news-authors" });
    await fastify.register(foundationRoutes, { prefix: "/api" });
    await fastify.register(errorsRoutes, { prefix: "/api" });

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
    fastify.log.info(`📊 Models: Match, News, NewsAuthor, Prediction, User, Foundation, ErrorLog`);
  } catch (err: unknown) {
    if (err instanceof Error) fastify.log.error(`❌ Server error: ${err.message}`);
    else fastify.log.error(`❌ Server error: ${err}`);
    process.exit(1);
  }
};

startServer();