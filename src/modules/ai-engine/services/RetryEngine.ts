import { IAIProvider } from '../providers/AIProvider';

export class RetryEngine {
  public static async execute<T>(
    provider: IAIProvider,
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (!(provider as any).isHealthy && Date.now() - (provider as any).lastFailure < 60000) {
           throw new Error('Circuit breaker active for provider');
        }

        const result = await operation();
        (provider as any).reportSuccess();
        return result;
      } catch (e: any) {
        lastError = e;
        (provider as any).reportFailure();
        console.warn(`[RetryEngine] Attempt ${attempt + 1} failed for ${provider.id}:`, e.message);

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  }
}
