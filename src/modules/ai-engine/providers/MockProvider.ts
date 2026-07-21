import { BaseProvider } from './BaseProvider';
import { AIProvider, AIRequestOptions, AIResponse } from '../types';

export class MockProvider extends BaseProvider {
  constructor(public id: AIProvider, public name: string) {
    super();
  }

  public async generateText(prompt: string, options: AIRequestOptions = {}): Promise<AIResponse> {
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Simulate some failures for testing the router if needed
    if (Math.random() > 0.8) {
      throw new Error(`Mock failure for ${this.name}`);
    }

    return this.createResponse(
      `Mock response from ${this.name} for: ${prompt.substring(0, 20)}...`,
      { status: 'ok', source: 'mock' },
      options,
      start
    );
  }

  public async generateImage(prompt: string, options: AIRequestOptions = {}): Promise<AIResponse> {
    const start = Date.now();
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.createResponse(
      'https://example.com/mock-image.jpg',
      { status: 'ok', type: 'image' },
      options,
      start
    );
  }
}
