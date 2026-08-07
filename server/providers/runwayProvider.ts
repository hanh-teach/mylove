import { AIProvider } from './aiProviderInterface';
import { ValidationError, AIProviderError } from '../utils/errors';

export class RunwayProvider implements AIProvider {
  public readonly name = 'Runway';

  public async generateVideo(prompt: string, apiKey: string, options?: { imageUrl?: string; [key: string]: any }): Promise<string> {
    const imageUrl = options?.imageUrl || options?.promptImage;
    if (!imageUrl) {
      throw new ValidationError('Runway requires an input image URL for image-to-video generation.');
    }

    try {
      const RunwayML = (await import('@runwayml/sdk')).default;
      const runwayClient = new RunwayML({ apiKey });

      // Use Gen-4 Turbo to animate the image.
      // Note: Upgraded from 'gen3a_turbo' because it is deprecated and sunsetted on July 30, 2026.
      // 'gen4_turbo' is chosen as a fast, cost-effective (turbo tier) equivalent, avoiding 'gen4.5' which is ~2.4x more expensive.
      const createPromise = runwayClient.imageToVideo.create({
        model: 'gen4_turbo',
        promptImage: imageUrl,
        promptText: prompt,
        ratio: '1280:720',
      });
      
      // Prevent Unhandled Promise Rejection crash if create fails immediately while polling
      createPromise.catch(() => {});

      const taskResponse = await createPromise.waitForTaskOutput();
      if (taskResponse?.output?.[0]) {
        return taskResponse.output[0];
      }
      throw new Error('Runway task output was empty');
    } catch (err: any) {
      throw new AIProviderError(err.message || 'Video generation failed', 'Runway', err);
    }
  }
}

export const runwayProvider = new RunwayProvider();
