
import { FastifyInstance } from 'fastify';
import { authenticateToken } from '@/middleware/authMiddleware';
import * as authController from './controllers/authController';

export async function authModuleRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  fastify.post('/refresh', authController.refreshToken);
  
  // Protected routes
  fastify.get('/profile', {
    preHandler: authenticateToken
  }, authController.getProfile);
  
  fastify.post('/logout', {
    preHandler: authenticateToken
  }, authController.logout);
}
