import { BaseProvider } from './BaseProvider';
import { AIProvider, AIRequestOptions, AIResponse } from '../types';

export class GeminiProvider extends BaseProvider {
  public id: AIProvider = 'gemini';
  public name = 'Google Gemini';

  public async generateText(prompt: string, options: AIRequestOptions = {}): Promise<AIResponse> {
    const start = Date.now();
    // In a real implementation, call @google/genai
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.createResponse(
      `Gemini text response for: ${prompt.substring(0, 30)}...`,
      { status: 'ok', source: 'gemini-sdk' },
      options,
      start
    );
  }

  public async generateImage(prompt: string, options: AIRequestOptions = {}): Promise<AIResponse> {
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1500));
    return this.createResponse(
      'https://example.com/gemini-generated-image.jpg',
      { status: 'ok', type: 'image' },
      options,
      start
    );
  }
}
