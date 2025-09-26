import { FastifyInstance } from "fastify";

export async function healthRoutes(server: FastifyInstance) {
  server.get("/health", async (request, reply) => {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      environment: process.env.NODE_ENV || 'development',
      version: "1.0.0",
      services: {
        database: "checking...", // Will be updated when DB is connected
        scraper: "operational",
        predictions: "operational"
      }
    };
    
    return healthData;
  });
}