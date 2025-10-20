import Fastify from "fastify";
import mongoose from "mongoose";
import newsRoutes from "./routes/news";
// pytorchModel import removed - not needed for current backend setup

const fastify = Fastify({ logger: true });

// Register JSON body parser (Fastify does this by default)
fastify.addHook("onRequest", async (request, reply) => {
  reply.header("Content-Type", "application/json");
});

// 🧩 MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/sportscentral")
  .then(() => fastify.log.info("✅ MongoDB connected successfully"))
  .catch((err) => {
    fastify.log.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

// 🗞️ Register routes
fastify.register(newsRoutes, { prefix: "/news" });

// 🧠 Predictions route removed – handled by frontend

// 🚀 Start server
const PORT = Number(process.env.PORT) || 3001;

fastify.listen({ port: PORT, host: "0.0.0.0" }).then((address) => {
  fastify.log.info(`✅ Backend 💯 running at ${address}`);
});