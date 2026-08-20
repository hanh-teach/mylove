import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwtSecret';

export interface AuthUser {
  userId: string;
  email: string;
  name?: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as AuthUser;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }
}
