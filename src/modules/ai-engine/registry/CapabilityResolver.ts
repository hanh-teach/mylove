import { capabilityRegistry } from './CapabilityRegistry';
import { CapabilityId } from './CapabilityDefinition';
import { AIProvider } from '../types';
import { ProviderFactory } from '../providers/ProviderFactory';

export class CapabilityResolver {
  public resolve(capabilityId: CapabilityId): { providerId: AIProvider; model: string } | undefined {
    const def = capabilityRegistry.get(capabilityId);
    if (!def) return undefined;

    // Logic: Try preferred -> fallback -> any available
    const candidates = [def.preferredProvider, def.fallbackProvider, ...def.providers].filter(Boolean) as AIProvider[];
    
    for (const providerId of candidates) {
      const provider = ProviderFactory.getProvider(providerId);
      // Assuming health check is implemented on provider
      if ((provider as any).isHealthy) {
        const model = def.supportedModels[providerId]?.[0] || 'default';
        return { providerId, model };
      }
    }

    return undefined;
  }
}

export const capabilityResolver = new CapabilityResolver();
