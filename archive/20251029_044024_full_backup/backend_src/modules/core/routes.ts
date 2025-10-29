
import { FastifyInstance } from "fastify";
import { healthRoutes } from "@/routes/health";
import { stripeRoutes } from "@/routes/stripe";
import { paymentsRoutes } from "@/routes/payment";
import { foundationRoutes } from "@/routes/foundation";
import { errorsRoutes } from "@/routes/errors";

export async function coreModuleRoutes(fastify: FastifyInstance) {
  // Health & Monitoring
  await fastify.register(healthRoutes);
  
  // Payments & Foundation
  await fastify.register(stripeRoutes, { prefix: "/stripe" });
  await fastify.register(paymentsRoutes, { prefix: "/payments" });
  await fastify.register(foundationRoutes);
  await fastify.register(errorsRoutes);
}
