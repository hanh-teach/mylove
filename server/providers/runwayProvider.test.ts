import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runwayProvider } from './runwayProvider';
import { ValidationError, AIProviderError } from '../utils/errors';

// Mock the @runwayml/sdk dynamic import
const createMock = vi.fn();
vi.mock('@runwayml/sdk', () => {
  class MockRunwayML {
    public imageToVideo = {
      create: createMock
    };
  }
  return {
    default: MockRunwayML
  };
});

describe('runwayProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw ValidationError if no imageUrl or promptImage is passed in options', async () => {
    await expect(
      runwayProvider.generateVideo('gentle breeze', 'runway-key-123')
    ).rejects.toThrow(ValidationError);
  });

  it('should successfully wait for and return runway task output', async () => {
    const mockOutputVideo = 'https://example.com/runway-output.mp4';
    const waitForTaskOutputMock = vi.fn().mockResolvedValue({
      output: [mockOutputVideo]
    });

    // Make create return a promise adorned with waitForTaskOutput
    const mockPromise = Promise.resolve({}) as any;
    mockPromise.waitForTaskOutput = waitForTaskOutputMock;
    createMock.mockReturnValue(mockPromise);

    const result = await runwayProvider.generateVideo('gentle breeze', 'runway-key-123', {
      imageUrl: 'data:image/jpeg;base64,mockBytes'
    });

    expect(createMock).toHaveBeenCalledWith({
      model: 'gen4_turbo',
      promptImage: 'data:image/jpeg;base64,mockBytes',
      promptText: 'gentle breeze',
      ratio: '1280:720',
    });
    expect(waitForTaskOutputMock).toHaveBeenCalled();
    expect(result).toBe(mockOutputVideo);
  });

  it('should throw error when task output is empty', async () => {
    const waitForTaskOutputMock = vi.fn().mockResolvedValue({
      output: []
    });

    const mockPromise = Promise.resolve({}) as any;
    mockPromise.waitForTaskOutput = waitForTaskOutputMock;
    createMock.mockReturnValue(mockPromise);

    await expect(
      runwayProvider.generateVideo('gentle breeze', 'runway-key-123', {
        imageUrl: 'data:image/jpeg;base64,mockBytes'
      })
    ).rejects.toThrow(AIProviderError);
  });

  it('should throw AIProviderError when SDK throws an error', async () => {
    createMock.mockImplementation(() => {
      const mockPromise = Promise.reject(new Error('Invalid key or unauthorized'));
      (mockPromise as any).waitForTaskOutput = vi.fn();
      return mockPromise;
    });

    await expect(
      runwayProvider.generateVideo('gentle breeze', 'runway-key-123', {
        imageUrl: 'data:image/jpeg;base64,mockBytes'
      })
    ).rejects.toThrow(AIProviderError);
  });
});
