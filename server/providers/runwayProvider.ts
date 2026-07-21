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

      // Use Gen-3 Alpha Turbo to animate the image
      const createPromise = runwayClient.imageToVideo.create({
        model: 'gen3a_turbo' as any,
        promptImage: imageUrl,
        promptText: prompt,
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
