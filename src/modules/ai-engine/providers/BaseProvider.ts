import { IAIProvider } from './AIProvider';
import { AIProvider, AIRequestOptions, AIResponse } from '../types';

export abstract class BaseProvider implements IAIProvider {
  public abstract id: AIProvider;
  public abstract name: string;

  public isHealthy: boolean = true;
  public lastFailure: number = 0;
  public failureCount: number = 0;

  public abstract generateText(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
  public abstract generateImage(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;

  public reportFailure() {
    this.failureCount++;
    this.lastFailure = Date.now();
    if (this.failureCount >= 3) {
      this.isHealthy = false;
    }
  }

  public reportSuccess() {
    this.failureCount = 0;
    this.isHealthy = true;
  }

  protected createResponse(content: string, raw: any, options: AIRequestOptions, start: number): AIResponse {
    return {
      id: `ai-res-${Math.random().toString(36).substr(2, 9)}`,
      provider: this.id,
      model: options.model || 'default-model',
      content,
      rawResponse: raw,
      usage: {
        promptTokens: 0, // Should be calculated per provider
        completionTokens: 0,
        totalTokens: 0,
        costEstimate: 0
      },
      latency: Date.now() - start
    };
  }
}
