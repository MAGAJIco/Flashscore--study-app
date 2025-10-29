
import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTUtils } from '@/utils/jwtUtils';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  age?: number;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function register(request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) {
  try {
    const { username, email, password, age } = request.body;

    // Validate required fields
    if (!username || !email || !password) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return reply.status(409).send({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine if user is a minor
    const isMinor = age ? age < 18 : false;
    const isUnder13 = age ? age < 13 : false;

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      age,
      isMinor,
      accessRestrictions: {
        bettingAllowed: !isMinor,
        paymentsAllowed: !isUnder13
      },
      coppaConsent: isUnder13 ? {
        granted: false,
        grantedAt: undefined,
        parentEmail: undefined
      } : undefined
    });

    // Generate tokens
    const accessToken = JWTUtils.generateAccessToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role || 'user'
    });

    const refreshToken = JWTUtils.generateRefreshToken({
      userId: newUser._id.toString()
    });

    return reply.status(201).send({
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isMinor,
        isUnder13
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    request.log.error({ error }, 'Registration failed');
    return reply.status(500).send({ error: 'Registration failed' });
  }
}

export async function login(request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send({ error: 'Missing credentials' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = JWTUtils.generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    });

    const refreshToken = JWTUtils.generateRefreshToken({
      userId: user._id.toString()
    });

    // Update last active
    user.lastActive = new Date();
    await user.save();

    return reply.send({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    request.log.error({ error }, 'Login failed');
    return reply.status(500).send({ error: 'Login failed' });
  }
}

export async function refreshToken(request: FastifyRequest<{ Body: { refreshToken: string } }>, reply: FastifyReply) {
  try {
    const { refreshToken } = request.body;

    if (!refreshToken) {
      return reply.status(400).send({ error: 'Refresh token required' });
    }

    const payload = JWTUtils.verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(payload.userId);
    if (!user) {
      return reply.status(401).send({ error: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = JWTUtils.generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role || 'user'
    });

    return reply.send({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    request.log.error({ error }, 'Token refresh failed');
    return reply.status(401).send({ error: 'Invalid refresh token' });
  }
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  // In a stateless JWT system, logout is handled client-side
  // You could implement token blacklisting here if needed
  return reply.send({ success: true, message: 'Logged out successfully' });
}

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const user = await User.findById(request.user.userId).select('-password');
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        role: user.role,
        isMinor: user.isMinor,
        accessRestrictions: user.accessRestrictions,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    request.log.error({ error }, 'Failed to get profile');
    return reply.status(500).send({ error: 'Failed to get profile' });
  }
}
