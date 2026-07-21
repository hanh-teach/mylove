import { AIProvider, AIRequestOptions, AIResponse } from '../types';
import { ProviderFactory } from '../providers/ProviderFactory';
import { RetryEngine } from './RetryEngine';
import { rateLimiter } from './RateLimiter';

export class AIRouter {
  private defaultPriority: AIProvider[] = ['gemini', 'openai', 'claude', 'huggingface', 'local'];
  private defaultRetries = 2;

  /**
   * Điều hướng request đến provider phù hợp và xử lý fallback/retry.
   */
  public async route(prompt: string, options: AIRequestOptions): Promise<AIResponse> {
    const priority = options.priority || this.defaultPriority;
    const initialProvider = options.provider;
    const fallbackProviders = options.fallbackProviders || [];
    const maxRetries = options.retries !== undefined ? options.retries : this.defaultRetries;

    // Xác định danh sách providers sẽ thử theo thứ tự
    let providersToTry: AIProvider[] = [];
    
    if (initialProvider) {
      providersToTry = [initialProvider, ...fallbackProviders];
    } else {
      providersToTry = [...priority];
    }

    // Đảm bảo không trùng lặp
    providersToTry = Array.from(new Set(providersToTry));

    let lastError: any;

    for (const providerId of providersToTry) {
      const provider = ProviderFactory.getProvider(providerId);
      
      // Skip unhealthy providers
      if (!(provider as any).isHealthy) {
        console.warn(`[AIRouter] Skipping unhealthy provider: ${providerId}`);
        continue;
      }

      // Skip rate limited providers
      if (!rateLimiter.canExecute(providerId)) {
        console.warn(`[AIRouter] Skipping rate limited provider: ${providerId}`);
        continue;
      }

      try {
        console.log(`[AIRouter] Trying provider: ${providerId}`);
        return await RetryEngine.execute(
          provider,
          () => provider.generateText(prompt, options),
          maxRetries
        );
      } catch (e) {
        lastError = e;
        console.warn(`[AIRouter] All retries failed for ${providerId}, falling back to next provider if available...`);
      }
    }

    throw new Error(`All AI providers failed after retries. Last error: ${lastError?.message}`);
  }
}

export const aiRouter = new AIRouter();
