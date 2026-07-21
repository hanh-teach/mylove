import { IAIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { MockProvider } from './MockProvider';
import { AIProvider } from '../types';

export class ProviderFactory {
  private static providers: Map<AIProvider, IAIProvider> = new Map();

  static {
    // Initialize default providers
    this.register(new GeminiProvider());
    this.register(new MockProvider('openai', 'OpenAI'));
    this.register(new MockProvider('claude', 'Anthropic Claude'));
    this.register(new MockProvider('huggingface', 'Hugging Face'));
    this.register(new MockProvider('local', 'Local Model'));
    this.register(new MockProvider('runway', 'Runway'));
    this.register(new MockProvider('fal', 'Fal.ai'));
  }

  public static register(provider: IAIProvider) {
    this.providers.set(provider.id as AIProvider, provider);
  }

  public static getProvider(id: AIProvider): IAIProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`AI Provider ${id} is not registered.`);
    }
    return provider;
  }
}
