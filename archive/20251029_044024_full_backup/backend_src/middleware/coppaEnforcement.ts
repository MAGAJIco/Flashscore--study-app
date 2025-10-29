import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * COPPA Enforcement Middleware (DISABLED)
 */
export async function coppaEnforcementMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  // COPPA enforcement disabled - allow all access
  return;
}

/**
 * Apply COPPA enforcement to Fastify instance (DISABLED)
 */
export function registerCoppaEnforcement(fastify: any) {
  // No enforcement applied
  return;
}