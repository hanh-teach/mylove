import { Buffer } from 'buffer';
import { AIProvider } from './aiProviderInterface';
import { AIProviderError } from '../utils/errors';

export class HuggingFaceProvider implements AIProvider {
  public readonly name = 'HuggingFace';

  public async generateImage(prompt: string, apiKey: string): Promise<string> {
    try {
      const { HfInference } = await import('@huggingface/inference');
      const hf = new HfInference(apiKey);

      const blob = await hf.textToImage({
        model: 'black-forest-labs/FLUX.1-schnell',
        inputs: prompt,
        // Note: Explicitly setting provider to 'fal-ai' (or another partner) because 
        // the default 'hf-inference' provider deprecated and sunsetted FLUX.1-schnell on July 15-16, 2026.
        provider: 'fal-ai'
      });

      const arrayBuffer = await (blob as any).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (err: any) {
      throw new AIProviderError(err.message || 'Image generation failed', 'HuggingFace', err);
    }
  }
}

export const huggingFaceProvider = new HuggingFaceProvider();
