import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geminiProvider } from './geminiProvider';
import { AIProviderError } from '../utils/errors';

const mockGenerateContent = vi.fn();
const mockGenerateImages = vi.fn();
const mockGenerateVideos = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      public models = {
        generateContent: mockGenerateContent,
        generateImages: mockGenerateImages,
        generateVideos: mockGenerateVideos
      };
    }
  };
});

describe('geminiProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateText', () => {
    it('should successfully return generated text', async () => {
      mockGenerateContent.mockResolvedValue({
        text: 'Hello from Gemini!'
      } as any);

      const result = await geminiProvider.generateText('Say hello', 'mock-api-key');
      expect(result).toBe('Hello from Gemini!');
      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-2.5-flash',
        contents: 'Say hello',
        config: undefined
      });
    });

    it('should throw AIProviderError on failure', async () => {
      mockGenerateContent.mockRejectedValue(new Error('Network connection failed'));

      await expect(geminiProvider.generateText('Say hello', 'mock-api-key')).rejects.toThrow(AIProviderError);
    });
  });

  describe('generateImage', () => {
    it('should successfully return a base64 data URL', async () => {
      mockGenerateImages.mockResolvedValue({
        generatedImages: [
          {
            image: {
              imageBytes: 'abc123bytes'
            }
          }
        ]
      } as any);

      const result = await geminiProvider.generateImage('Draw a heart', 'mock-api-key');
      expect(result).toBe('data:image/jpeg;base64,abc123bytes');
    });

    it('should throw an error if no image is returned', async () => {
      mockGenerateImages.mockResolvedValue({
        generatedImages: []
      } as any);

      await expect(geminiProvider.generateImage('Draw a heart', 'mock-api-key')).rejects.toThrow(AIProviderError);
    });

    it('should throw AIProviderError on API failure', async () => {
      mockGenerateImages.mockRejectedValue(new Error('Internal server error'));

      await expect(geminiProvider.generateImage('Draw a heart', 'mock-api-key')).rejects.toThrow(AIProviderError);
    });
  });

  describe('generateVideo', () => {
    it('should successfully return generated video Bytes or URL and pass the correct model', async () => {
      mockGenerateVideos.mockResolvedValue({
        generatedVideos: [
          {
            video: {
              videoBytes: 'https://example.com/gemini-video.mp4'
            }
          }
        ]
      } as any);

      const result = await geminiProvider.generateVideo('Create a video of garden', 'mock-api-key');
      expect(result).toBe('https://example.com/gemini-video.mp4');
      
      expect(mockGenerateVideos).toHaveBeenCalledWith(expect.objectContaining({
        model: 'veo-3.1-fast-generate-preview'
      }));
    });

    it('should throw AIProviderError on API failure', async () => {
      mockGenerateVideos.mockRejectedValue(new Error('Invalid video model'));

      await expect(geminiProvider.generateVideo('Create a video', 'mock-api-key')).rejects.toThrow(AIProviderError);
    });
  });
});
