import { FastifyReply, FastifyRequest } from 'fastify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { promisify } from 'util';

// NOTE: Ensure these environment variables are set in your Render/production envs:
// - JWT_PRIVATE_KEY (PEM, for signing)
// - JWT_PUBLIC_KEY  (PEM, for verification)
// - JWT_ACCESS_EXPIRES = "15m"
// - JWT_REFRESH_EXPIRES = "7d"

const signAsync = promisify<string | Buffer | object, jwt.SignOptions, string>(jwt.sign as any);
const verifyAsync = promisify<string, jwt.VerifyOptions, JwtPayload | string>(jwt.verify as any);

// Types used by middleware
export interface TokenPayload {
  userId: string;
  role?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}

function getPublicKey(): string {
  const key = process.env.JWT_PUBLIC_KEY;
  if (!key) throw new Error('JWT_PUBLIC_KEY is not set');
  return key;
}

function getPrivateKey(): string {
  const key = process.env.JWT_PRIVATE_KEY;
  if (!key) throw new Error('JWT_PRIVATE_KEY is not set');
  return key;
}

export async function signAccessToken(payload: object) {
  return jwt.sign(payload, getPrivateKey(), {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });
}

export async function signRefreshToken(payload: object) {
  return jwt.sign(payload, getPrivateKey(), {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, getPublicKey(), { algorithms: ['RS256'] }) as TokenPayload;
    return decoded;
  } catch (err) {
    throw err;
  }
}

/**
 * Fastify preHandler / hook middleware
 * - Accepts Authorization: Bearer <token> or token in cookie named 'access_token'
 * - Attaches request.user if verified
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = (request.headers['authorization'] as string) || '';
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    // Prefer cookie if present (HttpOnly cookie expected in browser flows)
    // @ts-ignore - fastify request cookies shape may vary depending on plugin
    if (!token && (request as any).cookies && (request as any).cookies.access_token) {
      // @ts-ignore
      token = (request as any).cookies.access_token;
    }

    if (!token) {
      reply.status(401).send({ error: 'Missing token' });
      return;
    }

    const payload = verifyToken(token);
    // attach to request for later handlers
    // @ts-ignore
    request.user = payload;
    return;
  } catch (err: any) {
    // Token expired / invalid -> 401
    reply.status(401).send({ error: 'Invalid or expired token' });
    return;
  }
}

export {
  authMiddleware as default,
  authMiddleware,
  signAccessToken,
  signRefreshToken,
  verifyToken,
  type TokenPayload
};
