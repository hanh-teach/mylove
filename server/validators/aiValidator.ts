import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export function validateAIWrite(req: Request, res: Response, next: NextFunction) {
  const { action, text } = req.body;

  if (!action || typeof action !== 'string') {
    return next(new ValidationError('Missing or invalid required field: action', { field: 'action' }));
  }

  if (!text || typeof text !== 'string') {
    return next(new ValidationError('Missing or invalid required field: text', { field: 'text' }));
  }

  if (text.length > 5000) {
    return next(new ValidationError('Text length exceeds maximum limit of 5000 characters', { field: 'text' }));
  }

  // Validate allowed actions to prevent unexpected behavior
  const allowedActions = ['improve', 'rewrite', 'shorten', 'expand', 'grammar', 'translate', 'generate'];
  if (!allowedActions.includes(action)) {
    return next(new ValidationError(`Invalid action: ${action}. Allowed: ${allowedActions.join(', ')}`, { field: 'action' }));
  }

  next();
}
