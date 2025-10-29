
import { FastifyRequest, FastifyReply } from 'fastify';

export const securityHeaders = async (request: FastifyRequest, reply: FastifyReply) => {
  // Prevent clickjacking
  reply.header('X-Frame-Options', 'DENY');
  
  // XSS Protection
  reply.header('X-Content-Type-Options', 'nosniff');
  reply.header('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  reply.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.replit.com; " +
    "frame-ancestors 'none';"
  );
  
  // HTTPS enforcement
  reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Permissions Policy
  reply.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Referrer Policy
  reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
};
