import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import mongoose from "mongoose";
import newsAuthorsRoutes from "./routes/newsAuthors";
import paymentsRoutes from "./routes/payment.js";

// Initialize Fastify
const fastify = Fastify({
  logger: true,
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

// Start the Fastify server
const start = async () => {
  try {
    await connectDB();

    const PORT = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: PORT, host: "0.0.0.0" });

    fastify.log.info(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();