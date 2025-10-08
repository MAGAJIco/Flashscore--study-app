
import { Request, Response, NextFunction } from 'express';
import { User as UserModel } from '../models/User';

export const preventKidsModeMonetization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId || req.body.userId || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Block if user is in Kids Mode or under 18
    if (user.isMinor || user.age < 18 || !user.accessRestrictions.paymentsAllowed) {
      // Log audit trail
      console.warn(`[KIDS_MODE_VIOLATION] User ${userId} attempted monetization action`, {
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date()
      });

      return res.status(403).json({
        error: 'Payment operations are restricted for your account',
        reason: 'age_restriction',
        kidsMode: true
      });
    }

    next();
  } catch (error) {
    console.error('Kids Mode gating error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const preventKidsModeBetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId || req.body.userId || req.query.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await UserModel.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isMinor || user.age < 18 || !user.accessRestrictions.bettingAllowed) {
      console.warn(`[KIDS_MODE_VIOLATION] User ${userId} attempted betting action`, {
        endpoint: req.path,
        method: req.method,
        ip: req.ip,
        timestamp: new Date()
      });

      return res.status(403).json({
        error: 'Betting operations are restricted for your account',
        reason: 'age_restriction',
        kidsMode: true
      });
    }

    next();
  } catch (error) {
    console.error('Kids Mode betting gating error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
