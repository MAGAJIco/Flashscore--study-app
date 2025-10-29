
import { FastifyRequest, FastifyReply } from 'fastify';
import { createHash } from 'crypto';

interface CacheConfig {
  ttl: number;
  keyPrefix: string;
}

const cache = new Map<string, { data: any; timestamp: number }>();

export const responseCacheMiddleware = (config: CacheConfig = { ttl: 60000, keyPrefix: 'api' }) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Only cache GET requests
    if (request.method !== 'GET') return;

    const cacheKey = `${config.keyPrefix}:${createHash('md5').update(request.url).digest('hex')}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < config.ttl) {
      reply.header('X-Cache-Hit', 'true');
      return reply.send(cached.data);
    }

    // Intercept the response
    const originalSend = reply.send.bind(reply);
    reply.send = function(data: any) {
      cache.set(cacheKey, { data, timestamp: Date.now() });
      reply.header('X-Cache-Hit', 'false');
      return originalSend(data);
    };
  };
};

// Auto-cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > 300000) {
      cache.delete(key);
    }
  }
}, 300000);
