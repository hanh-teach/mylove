import { capabilityRegistry } from './CapabilityRegistry';
import { capabilityResolver } from './CapabilityResolver';
import { CapabilityDefinition, CapabilityId } from './CapabilityDefinition';
import { AIProvider } from '../types';

export class CapabilityService {
  public register(definition: CapabilityDefinition) {
    capabilityRegistry.register(definition);
  }

  public resolve(capabilityId: CapabilityId) {
    return capabilityResolver.resolve(capabilityId);
  }

  public findBestProvider(capabilityId: CapabilityId): AIProvider | undefined {
    return capabilityResolver.resolve(capabilityId)?.providerId;
  }
}

export const capabilityService = new CapabilityService();
