import { describe, it, expect, vi } from 'vitest';
import { validateGenerateVideo } from './videoValidator';
import { ValidationError } from '../utils/errors';
import { Request, Response } from 'express';

describe('videoValidator - validateGenerateVideo', () => {
  it('should call next() without errors if all required fields are present and valid', () => {
    const req = {
      body: {
        title: 'My Video Title',
        message: 'Hello World',
        scene: 'cyberpunk'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateGenerateVideo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith(); // should be called with no arguments
  });

  it('should call next(ValidationError) if title is missing (undefined)', () => {
    const req = {
      body: {
        message: 'Hello World',
        scene: 'cyberpunk'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateGenerateVideo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Missing required field: title');
    expect(err.errors).toEqual({ field: 'title' });
  });

  it('should call next(ValidationError) if title is null', () => {
    const req = {
      body: {
        title: null,
        message: 'Hello World',
        scene: 'cyberpunk'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateGenerateVideo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Missing required field: title');
    expect(err.errors).toEqual({ field: 'title' });
  });

  it('should call next(ValidationError) if message is missing (undefined)', () => {
    const req = {
      body: {
        title: 'My Title',
        scene: 'cyberpunk'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateGenerateVideo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Missing required field: message');
    expect(err.errors).toEqual({ field: 'message' });
  });

  it('should call next(ValidationError) if scene is missing (undefined)', () => {
    const req = {
      body: {
        title: 'My Title',
        message: 'My Message'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateGenerateVideo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Missing required field: scene');
    expect(err.errors).toEqual({ field: 'scene' });
  });

  it('should call next(ValidationError) if scene is empty string', () => {
    const req = {
      body: {
        title: 'My Title',
        message: 'My Message',
        scene: ''
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateGenerateVideo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(ValidationError);
    expect(err.message).toContain('Missing required field: scene');
    expect(err.errors).toEqual({ field: 'scene' });
  });

  it('should allow title and message to be empty strings', () => {
    const req = {
      body: {
        title: '',
        message: '',
        scene: 'lofi'
      }
    } as unknown as Request;

    const res = {} as Response;
    const next = vi.fn();

    validateGenerateVideo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenLastCalledWith();
  });
});
