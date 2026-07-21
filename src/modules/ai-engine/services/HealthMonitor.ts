import { ProviderFactory } from '../providers/ProviderFactory';

export class HealthMonitor {
  public getStatus() {
    const providers = ['gemini', 'openai', 'claude', 'huggingface', 'local'];
    return providers.map(id => {
      const provider = ProviderFactory.getProvider(id as any);
      return {
        id,
        isHealthy: (provider as any).isHealthy,
        failureCount: (provider as any).failureCount
      };
    });
  }
}

export const healthMonitor = new HealthMonitor();
