import { FastifyRequest, FastifyReply } from "fastify";

export class ConfigController {
  // Get sanitized config for frontend
  static getConfig = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const config = {
        nodeEnv: process.env.NODE_ENV || "unknown",
        frontendUrl: process.env.FRONTEND_URL || "not set",
        hasDatabase: (process.env.MONGODB_URI || process.env.DATABASE_URL) ? "🟢" : "🔴",
        hasSportsApi: process.env.SPORTS_API_KEY ? "⚽🟢" : "⚽🔴",
      };

      reply.send({
        success: true,
        config,
        message: "Configuration loaded successfully",
      });
    } catch (error) {
      console.error("❌ Error getting config:", error);
      reply.status(500).send({
        success: false,
        message: "Failed to load configuration",
      });
    }
  };

  // Health check with emoji
  static healthCheck = async (request: FastifyRequest, reply: FastifyReply) => {
    const health = {
      status: "✅ healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "unknown",
      checks: {
        database: (process.env.MONGODB_URI || process.env.DATABASE_URL) ? "🟢" : "🔴",
        admin: (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD) ? "👤🟢" : "👤🔴",
        sportsApi: process.env.SPORTS_API_KEY ? "⚽🟢" : "⚽🔴",
      },
    };

    reply.send(health);
  };
}