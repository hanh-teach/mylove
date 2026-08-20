import { describe, it, expect, vi, beforeEach } from 'vitest';
import { huggingFaceProvider } from './huggingFaceProvider';
import { AIProviderError } from '../utils/errors';

const mockTextToImage = vi.fn();

vi.mock('@huggingface/inference', () => {
  return {
    HfInference: class {
      public textToImage = mockTextToImage;
    }
  };
});

describe('huggingFaceProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully generate an image and return a base64 string', async () => {
    const mockArrayBuffer = new Uint8Array([1, 2, 3]).buffer;
    const mockBlob = {
      arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer)
    };

    mockTextToImage.mockResolvedValue(mockBlob as any);

    const result = await huggingFaceProvider.generateImage('cyberpunk garden', 'mock-key');
    expect(result).toContain('data:image/jpeg;base64,');
    expect(mockTextToImage).toHaveBeenCalledWith({
      model: 'black-forest-labs/FLUX.1-schnell',
      inputs: 'cyberpunk garden',
      provider: 'fal-ai'
    });
  });

  it('should throw AIProviderError when image generation fails', async () => {
    mockTextToImage.mockRejectedValue(new Error('Inference API is down'));

    await expect(huggingFaceProvider.generateImage('cyberpunk garden', 'mock-key')).rejects.toThrow(AIProviderError);
  });
});
