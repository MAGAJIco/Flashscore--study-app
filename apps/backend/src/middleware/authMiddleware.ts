import { FastifyRequest, FastifyReply } from 'fastify';

// Simple auth middleware for permission checking
export const authMiddleware = {
  // Check if user has permission to read full content
  requireMemberAccess: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.code(401).send({
          success: false,
          message: 'Member access required'
        });
      }

      const token = authHeader.substring(7);
      
      // Validate token format (at minimum)
      if (!token || token.length < 32 || !/^[a-zA-Z0-9_\-\.]+$/.test(token)) {
        return reply.code(401).send({
          success: false,
          message: 'Invalid token format'
        });
      }

      // TODO: Implement JWT validation or session lookup with database
      // For now, require proper implementation before deployment
      if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET must be configured for production');
      }

      // Temporary check - replace with actual JWT validation
      const isDevelopmentBypass = process.env.NODE_ENV === 'development' && (token === 'member' || token === 'admin');
      
      if (!isDevelopmentBypass && process.env.NODE_ENV === 'production') {
        // Implement actual JWT validation here
        return reply.code(401).send({
          success: false,
          message: 'Token validation not implemented'
        });
      }

      return;
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Authentication error'
      });
    }
  },

  // Check if user is guest (for limited access)
  isGuest: (request: FastifyRequest): boolean => {
    const authHeader = request.headers.authorization;
    const authQuery = (request.query as any)?.auth;

    return !authHeader && !authQuery;
  },

  // Get user type for response filtering
  getUserType: (request: FastifyRequest): 'guest' | 'member' => {
    const authHeader = request.headers.authorization;
    const authQuery = (request.query as any)?.auth;

    const isValidAuth = authHeader?.includes('Bearer member') || authQuery === 'member';

    return isValidAuth ? 'member' : 'guest';
  }
};