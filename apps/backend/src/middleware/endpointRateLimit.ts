
import { FastifyRequest, FastifyReply } from 'fastify';
import { RateLimitPluginOptions } from '@fastify/rate-limit';

interface RateLimitConfig {
  max: number;
  timeWindow: string;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const endpointRateLimitMiddleware = (config: Record<string, RateLimitConfig>) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const endpoint = request.routeOptions.url || request.url.split('?')[0];
    const limitConfig = config[endpoint];

    if (!limitConfig) return; // No specific limit for this endpoint

    const clientIP = request.headers['x-forwarded-for'] || request.ip || 'unknown';
    const key = `${endpoint}:${clientIP}`;
    const now = Date.now();

    const timeWindowMs = parseTimeWindow(limitConfig.timeWindow);
    
    let record = rateLimitStore.get(key);
    
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + timeWindowMs };
      rateLimitStore.set(key, record);
    }

    record.count++;

    if (record.count > limitConfig.max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      reply.header('Retry-After', retryAfter.toString());
      reply.header('X-RateLimit-Limit', limitConfig.max.toString());
      reply.header('X-RateLimit-Remaining', '0');
      reply.header('X-RateLimit-Reset', record.resetTime.toString());
      
      request.log.warn({
        endpoint,
        ip: clientIP,
        limit: limitConfig.max,
        window: limitConfig.timeWindow
      }, 'Endpoint rate limit exceeded');

      return reply.status(429).send({
        error: 'Too Many Requests',
        message: `Rate limit exceeded for ${endpoint}. Try again in ${retryAfter} seconds.`,
        retryAfter
      });
    }

    reply.header('X-RateLimit-Limit', limitConfig.max.toString());
    reply.header('X-RateLimit-Remaining', (limitConfig.max - record.count).toString());
    reply.header('X-RateLimit-Reset', record.resetTime.toString());
  };
};

function parseTimeWindow(timeWindow: string): number {
  const match = timeWindow.match(/^(\d+)\s*(minute|minutes|hour|hours|second|seconds)$/i);
  if (!match) return 60000; // Default 1 minute

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'second':
    case 'seconds':
      return value * 1000;
    case 'minute':
    case 'minutes':
      return value * 60 * 1000;
    case 'hour':
    case 'hours':
      return value * 60 * 60 * 1000;
    default:
      return 60000;
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime + 60000) { // Clean up 1 minute after reset
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes
