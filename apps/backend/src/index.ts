import Fastify from "fastify";
import mongoose from "mongoose";
import { mlRoutes } from "./routes/mlRoutes.js";

const fastify = Fastify({ logger: true });

fastify.addHook("onRequest", async (_req, reply) => {
  reply.header("Content-Type", "application/json");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sportscentral");
    fastify.log.info("✅ MongoDB connected");

    await fastify.register(mlRoutes, { prefix: "/api" });

    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    fastify.log.info(`✅ Backend running at http://0.0.0.0:${PORT}`);
  } catch (err: unknown) {
    if (err instanceof Error) fastify.log.error(`❌ Server error: ${err.message}`);
    else fastify.log.error(`❌ Server error: ${err}`);
    process.exit(1);
  }
};

startServer();