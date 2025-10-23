
import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTUtils } from '../utils/jwtUtils.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      email?: string;
      role?: string;
    };
  }
}

export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = JWTUtils.verifyAccessToken(token);

    // Attach user info to request
    request.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };

  } catch (error) {
    return reply.status(401).send({ error: 'Invalid or expired token' });
  }
}

// Optional: Role-based authorization
export function requireRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    if (!request.user.role || !allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Insufficient permissions' });
    }
  };
}
