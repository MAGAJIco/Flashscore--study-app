
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authController = {
  async register(req: FastifyRequest<{ Body: { email: string; password: string; username: string } }>, res: FastifyReply) {
    try {
      const { email, password, username } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).send({ success: false, error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword, username });
      await user.save();

      const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).send({
        success: true,
        data: { id: user._id, email: user.email, username: user.username },
        token
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Registration failed' });
    }
  },

  async login(req: FastifyRequest<{ Body: { email: string; password: string } }>, res: FastifyReply) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).send({ success: false, error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).send({ success: false, error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '7d' });

      res.send({
        success: true,
        data: { id: user._id, email: user.email, username: user.username },
        token
      });
    } catch (error) {
      req.log.error(error);
      res.status(500).send({ success: false, error: 'Login failed' });
    }
  },

  async getProfile(req: FastifyRequest, res: FastifyReply) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).send({ success: false, error: 'No token provided' });
      }

      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(404).send({ success: false, error: 'User not found' });
      }

      res.send({ success: true, data: user });
    } catch (error) {
      req.log.error(error);
      res.status(401).send({ success: false, error: 'Invalid token' });
    }
  },

  async refreshToken(req: FastifyRequest<{ Body: { token: string } }>, res: FastifyReply) {
    try {
      const { token } = req.body;
      const decoded: any = jwt.verify(token, JWT_SECRET);

      const newToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ success: true, token: newToken });
    } catch (error) {
      req.log.error(error);
      res.status(401).send({ success: false, error: 'Invalid token' });
    }
  }
};
