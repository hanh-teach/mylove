import { describe, it, expect, vi, beforeEach } from 'vitest';
import { videoController } from './videoController';
import { taskRepository } from '../repositories/taskRepository';
import { aiRouter } from '../utils/aiRouter';
import { videoService } from '../services/videoService';
import { Request, Response } from 'express';

vi.mock('../utils/aiRouter', () => {
  return {
    aiRouter: {
      routeVideo: vi.fn()
    }
  };
});

vi.mock('../services/videoService', () => {
  return {
    videoService: {
      generateVideo: vi.fn()
    }
  };
});

describe('VideoController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    taskRepository.destroy();
  });

  it('should return synchronous response for other providers or in preview mode', async () => {
    // Mock other provider
    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: { name: 'Gemini' } as any,
      apiKey: 'test-key',
      isFallbackToPreview: false
    });

    const mockResult = { success: true, videoUrl: 'https://example.com/sync-video.mp4' };
    vi.mocked(videoService.generateVideo).mockResolvedValue(mockResult as any);

    const req = {
      body: {
        title: 'Title',
        message: 'Msg',
        scene: 'sunset',
        bgStyle: 'bg',
        musicTrack: {},
        placedItems: []
      },
      traceId: 'trace-123',
      headers: {}
    } as unknown as Request;

    const res = {
      json: vi.fn()
    } as unknown as Response;

    const next = vi.fn();

    await videoController.generateVideo(req, res, next);

    expect(videoService.generateVideo).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockResult);
  });

  it('should return 202 and process task in background for Agnes AI when NOT in preview mode', async () => {
    // Mock Agnes AI provider
    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: { name: 'Agnes' } as any,
      apiKey: 'agnes-key-123',
      isFallbackToPreview: false
    });

    const mockResult = { success: true, videoUrl: 'https://example.com/agnes-video.mp4' };
    
    // Solve instantly or after delay
    let resolveGen: (value: any) => void = () => {};
    const genPromise = new Promise((resolve) => {
      resolveGen = resolve;
    });
    vi.mocked(videoService.generateVideo).mockReturnValue(genPromise as any);

    const req = {
      body: {
        title: 'Title',
        message: 'Msg',
        scene: 'sunset',
        bgStyle: 'bg',
        musicTrack: {},
        placedItems: []
      },
      traceId: 'trace-123',
      headers: {}
    } as unknown as Request;

    let responseStatus: number | null = null;
    let responseJson: any = null;

    const res = {
      status: vi.fn().mockImplementation((code) => {
        responseStatus = code;
        return res;
      }),
      json: vi.fn().mockImplementation((data) => {
        responseJson = data;
        return res;
      })
    } as unknown as Response;

    const next = vi.fn();

    await videoController.generateVideo(req, res, next);

    // Should return 202 Accepted immediately
    expect(responseStatus).toBe(202);
    expect(responseJson).toBeDefined();
    expect(responseJson.taskId).toBeDefined();
    expect(responseJson.statusUrl).toBe(`/api/tasks/${responseJson.taskId}`);

    // Inspect task store
    const taskId = responseJson.taskId;
    // Wait for microtasks so background processing update has run
    await new Promise((resolve) => setTimeout(resolve, 20));
    const task = taskRepository.getTask(taskId);
    expect(task).toBeDefined();
    expect(task?.status).toBe('processing'); // background task updates it to processing first

    // Complete background promise
    resolveGen(mockResult);

    // Wait for microtasks
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Task store should be updated
    const finalTask = taskRepository.getTask(taskId);
    expect(finalTask?.status).toBe('completed');
    expect(finalTask?.result).toEqual(mockResult);
  });

  it('should handle background task failure and record failed status', async () => {
    vi.mocked(aiRouter.routeVideo).mockReturnValue({
      provider: { name: 'Agnes' } as any,
      apiKey: 'agnes-key-123',
      isFallbackToPreview: false
    });

    const errorMsg = 'Agnes API Error: Rate limit exceeded';
    let rejectGen: (reason: any) => void = () => {};
    const genPromise = new Promise((_, reject) => {
      rejectGen = reject;
    });
    // Attach dummy catch to prevent unhandled rejection before controller awaits it
    genPromise.catch(() => {});
    vi.mocked(videoService.generateVideo).mockReturnValue(genPromise as any);

    const req = {
      body: {
        title: 'Title',
        message: 'Msg',
        scene: 'sunset',
        bgStyle: 'bg',
        musicTrack: {},
        placedItems: []
      },
      traceId: 'trace-123',
      headers: {}
    } as unknown as Request;

    let responseStatus: number | null = null;
    let responseJson: any = null;

    const res = {
      status: vi.fn().mockImplementation((code) => {
        responseStatus = code;
        return res;
      }),
      json: vi.fn().mockImplementation((data) => {
        responseJson = data;
        return res;
      })
    } as unknown as Response;

    const next = vi.fn();

    await videoController.generateVideo(req, res, next);

    expect(responseStatus).toBe(202);
    const taskId = responseJson.taskId;

    // Reject background promise
    rejectGen(new Error(errorMsg));

    // Wait for microtasks
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Task should be in failed state with the correct error message
    const finalTask = taskRepository.getTask(taskId);
    expect(finalTask?.status).toBe('failed');
    expect(finalTask?.error).toBe(errorMsg);
  });
});
