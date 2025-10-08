import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import mongoose from "mongoose";
import newsAuthorsRoutes from "./routes/newsAuthors";
import paymentsRoutes from "./routes/payment.js";

// Initialize Fastify
const fastify = Fastify({
  logger: true,
});

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