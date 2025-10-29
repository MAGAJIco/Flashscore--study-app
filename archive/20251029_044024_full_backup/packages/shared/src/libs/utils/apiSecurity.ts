
import { NextApiRequest, NextApiResponse } from 'next';
import { SecurityUtils } from './securityUtils';

export interface SecureApiRequest extends NextApiRequest {
  user?: any;
  rateLimited?: boolean;
}

export function withSecurity(handler: (req: SecureApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: SecureApiRequest, res: NextApiResponse) => {
    try {
      // CORS Protection
      const origin = req.headers.origin;
      const allowedOrigins = [
        'http://localhost:3001',
        'https://your-app-domain.replit.app'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');

      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }

      // Rate limiting
      const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
      if (!SecurityUtils.checkRateLimit(`api_${clientIP}`, 100, 60000)) { // 100 requests per minute
        SecurityUtils.logSecurityEvent('api_rate_limit_exceeded', { ip: clientIP, path: req.url });
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
      }

      // Input validation for POST/PUT requests
      if ((req.method === 'POST' || req.method === 'PUT') && req.body) {
        // Sanitize all string inputs
        const sanitizeObject = (obj: any): any => {
          if (typeof obj === 'string') {
            return SecurityUtils.sanitizeInput(obj);
          }
          if (Array.isArray(obj)) {
            return obj.map(sanitizeObject);
          }
          if (obj && typeof obj === 'object') {
            const sanitized: any = {};
            for (const key in obj) {
              sanitized[key] = sanitizeObject(obj[key]);
            }
            return sanitized;
          }
          return obj;
        };

        req.body = sanitizeObject(req.body);
      }

      // Log API access
      SecurityUtils.logSecurityEvent('api_access', {
        method: req.method,
        path: req.url,
        ip: clientIP,
        userAgent: req.headers['user-agent']
      });

      await handler(req, res);
    } catch (error: any) {
      SecurityUtils.logSecurityEvent('api_error', {
        error: error.message,
        path: req.url,
        method: req.method
      });
      
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

export function requireAuth(handler: (req: SecureApiRequest, res: NextApiResponse) => Promise<void>) {
  return withSecurity(async (req: SecureApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer token

    if (!token || !SecurityUtils.validateSession(token)) {
      SecurityUtils.logSecurityEvent('unauthorized_api_access', {
        path: req.url,
        token: token ? 'invalid' : 'missing'
      });
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // In production, validate token against database/cache
    req.user = { token }; // Simplified for demo

    await handler(req, res);
  });
}
