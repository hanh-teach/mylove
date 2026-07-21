import { fal } from '@fal-ai/client';
import { AIProvider } from './aiProviderInterface';
import { AIProviderError } from '../utils/errors';

export class FalProvider implements AIProvider {
  public readonly name = 'Fal';

  public async generateVideo(prompt: string, apiKey: string): Promise<{ url: string; raw: any }> {
    try {
      fal.config({ credentials: apiKey });
      
      const result: any = await fal.subscribe("fal-ai/pika", {
        input: {
          prompt: prompt,
          aspect_ratio: "16:9"
        }
      });

      const finalVideoUrl = result?.video?.url || result?.video_url || result?.url;
      if (!finalVideoUrl) {
        throw new Error("Video URL not found in Fal response");
      }

      return { url: finalVideoUrl, raw: result };
    } catch (err: any) {
      throw new AIProviderError(err.message || 'Video generation failed', 'Fal', err);
    }
  }
}

export const falProvider = new FalProvider();
