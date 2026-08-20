import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export function validateGenerateVideo(req: Request, res: Response, next: NextFunction) {
  const { title, message, scene } = req.body;

  if (title === undefined || title === null) {
    return next(new ValidationError('Missing required field: title', { field: 'title' }));
  }

  if (message === undefined || message === null) {
    return next(new ValidationError('Missing required field: message', { field: 'message' }));
  }

  if (!scene) {
    return next(new ValidationError('Missing required field: scene', { field: 'scene' }));
  }

  next();
}

