
import { FastifyRequest, FastifyReply } from 'fastify';

interface DegradationRule {
  path: RegExp;
  fallback: (req: FastifyRequest, res: FastifyReply) => Promise<void>;
  condition: () => boolean;
}

const degradationRules: DegradationRule[] = [
  {
    path: /\/api\/predictions/,
    condition: () => {
      // Check if ML service is down
      return process.env.ML_SERVICE_DOWN === 'true';
    },
    fallback: async (req, res) => {
      res.send({
        success: true,
        data: {
          prediction: 'draw',
          confidence: 50,
          model_version: 'fallback-v1',
          source: 'degraded-mode'
        },
        warning: 'Running in degraded mode - using fallback predictions'
      });
    }
  }
];

export async function gracefulDegradationMiddleware(
  req: FastifyRequest,
  res: FastifyReply
) {
  const rule = degradationRules.find(
    r => r.path.test(req.url) && r.condition()
  );

  if (rule) {
    req.log.warn(`Degraded mode activated for ${req.url}`);
    await rule.fallback(req, res);
    return;
  }
}
