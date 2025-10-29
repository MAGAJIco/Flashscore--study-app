
import { FastifyInstance } from 'fastify';
import { authController } from './controllers/authController';

export async function authModuleRoutes(fastify: FastifyInstance) {
  // Register
  fastify.post('/register', authController.register);
  
  // Login
  fastify.post('/login', authController.login);
  
  // Get profile
  fastify.get('/profile', authController.getProfile);
  
  // Refresh token
  fastify.post('/refresh', authController.refreshToken);
}
