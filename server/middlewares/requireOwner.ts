import { Request, Response, NextFunction } from 'express';
import { isOwnerEmail } from '../config/ownerEmails';

export function requireOwner(req: Request, res: Response, next: NextFunction) {
  if (!req.user || (!isOwnerEmail(req.user.email) && req.user.role !== 'owner')) {
    return res.status(403).json({ success: false, error: 'Forbidden: Owner permission required' });
  }
  next();
}
