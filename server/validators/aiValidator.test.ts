import { describe, it, expect, vi } from 'vitest';
import { validateAIWrite } from './aiValidator';
import { ValidationError } from '../utils/errors';
import { Request, Response } from 'express';

describe('aiValidator - validateAIWrite', () => {
  it('should call next() without errors for valid action and text', () => {
    const req = {
      body: {
        action: 'improve',
        text: 'Hello world romantic note'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateAIWrite(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith();
  });

  it('should call next(ValidationError) if action is missing or invalid type', () => {
    const req = {
      body: {
        text: 'Some text'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateAIWrite(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Missing or invalid required field: action');
    expect(err.errors).toEqual({ field: 'action' });
  });

  it('should call next(ValidationError) if action is not in allowedActions list', () => {
    const req = {
      body: {
        action: 'hacked_action',
        text: 'Some text'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateAIWrite(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Invalid action: hacked_action');
    expect(err.errors).toEqual({ field: 'action' });
  });

  it('should call next(ValidationError) if text is missing', () => {
    const req = {
      body: {
        action: 'rewrite'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateAIWrite(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Missing or invalid required field: text');
    expect(err.errors).toEqual({ field: 'text' });
  });

  it('should call next(ValidationError) if text exceeds 5000 characters', () => {
    const longText = 'a'.repeat(5001);
    const req = {
      body: {
        action: 'rewrite',
        text: longText
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateAIWrite(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('exceeds maximum limit of 5000 characters');
    expect(err.errors).toEqual({ field: 'text' });
  });

  it('should pass if text is exactly 5000 characters', () => {
    const validText = 'a'.repeat(5000);
    const req = {
      body: {
        action: 'rewrite',
        text: validText
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateAIWrite(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith();
  });
});
