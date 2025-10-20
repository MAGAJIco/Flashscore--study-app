import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { processPayment } from "../controllers/paymentController";

export default async function apiRoutes(fastify: FastifyInstance) {
  // Health check route
  fastify.get("/health", async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({ status: "ok" });
  });

  // Payment route
  fastify.post("/payment", async (request: FastifyRequest, reply: FastifyReply) => {
    return processPayment(request as any, reply);
  });
}