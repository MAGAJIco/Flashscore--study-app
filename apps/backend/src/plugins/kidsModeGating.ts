import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { User as UserModel } from '../models/User';

// --- Define interfaces for clarity ---
interface AccessRestrictions {
  paymentsAllowed: boolean;
  bettingAllowed: boolean;
}

interface IUser {
  _id: string;
  age: number;
  isMinor: boolean;
  accessRestrictions: AccessRestrictions;
}

// --- Helper to extract userId ---
const extractUserId = (req: FastifyRequest): string | undefined => {
  const body: any = (req as any).body;
  const query: any = (req as any).query;
  const userId = (req as any).userId || body?.userId || query?.userId;
  return userId;
};

// --- Core gating function factory ---
const preventKidsModeAction = (action: 'payments' | 'betting') => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = extractUserId(req);
      if (!userId) {
        return reply.status(401).send({ error: 'Authentication required' });
      }

      const user = await UserModel.findById<IUser>(userId);
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      const allowed = user.accessRestrictions?.[`${action}Allowed` as keyof AccessRestrictions];
      if (user.isMinor || user.age < 18 || !allowed) {
        req.log.warn(`[KIDS_MODE_VIOLATION] User ${userId} attempted ${action} action`, {
          endpoint: req.url,
          method: req.method,
          ip: req.ip,
          timestamp: new Date(),
        });

        return reply.status(403).send({
          error: `${action.charAt(0).toUpperCase() + action.slice(1)} operations restricted`,
          reason: 'age_restriction',
          kidsMode: true,
        });
      }

      // Pass request to next handler
    } catch (error) {
      req.log.error(`Kids Mode ${action} gating error: ${error}`);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  };
};

// --- Export Fastify Plugin ---
const kidsModeGatingPlugin: FastifyPluginAsync = async (fastify) => {
  // Register hooks for monetization and betting
  fastify.decorate('preventKidsModeMonetization', preventKidsModeAction('payments'));
  fastify.decorate('preventKidsModeBetting', preventKidsModeAction('betting'));
};

export default kidsModeGatingPlugin;