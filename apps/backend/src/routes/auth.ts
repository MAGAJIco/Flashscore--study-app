import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { JWTUtils } from '../utils/jwtUtils.js';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

interface LoginBody {
  email: string;
  password: string;
}

interface RefreshBody {
  refreshToken: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  // Login endpoint
  fastify.post<{ Body: LoginBody }>('/login', async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    const { email, password } = request.body;

    try {
      // Find user (you'll need to implement password hashing/verification)
      const user = await User.findOne({ email });

      if (!user) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Verify password using bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      // Generate tokens
      const tokens = JWTUtils.generateTokenPair({
        userId: user._id.toString(),
        email: user.email,
        role: user.role || 'user'
      });

      return reply.send({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          username: user.username
        },
        ...tokens
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Login failed' });
    }
  });

  // Refresh token endpoint
  fastify.post<{ Body: RefreshBody }>('/refresh', async (request: FastifyRequest<{ Body: RefreshBody }>, reply: FastifyReply) => {
    const { refreshToken } = request.body;

    try {
      // Verify refresh token
      const payload = JWTUtils.verifyRefreshToken(refreshToken);

      // Generate new access token
      const newAccessToken = JWTUtils.generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        role: payload.role
      });

      return reply.send({
        success: true,
        accessToken: newAccessToken
      });
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });

  // Verify token endpoint (for testing)
  fastify.post('/verify', async (request: FastifyRequest<{ Body: { token: string } }>, reply: FastifyReply) => {
    const { token } = request.body;

    try {
      const payload = JWTUtils.verifyAccessToken(token);
      return reply.send({
        valid: true,
        payload
      });
    } catch (error) {
      return reply.status(401).send({
        valid: false,
        error: 'Invalid token'
      });
    }
  });
}