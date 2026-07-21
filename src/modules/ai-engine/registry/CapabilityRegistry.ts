import { CapabilityDefinition, CapabilityId } from './CapabilityDefinition';

export class CapabilityRegistry {
  private capabilities: Map<CapabilityId, CapabilityDefinition> = new Map();
  private enabled: Map<CapabilityId, boolean> = new Map();

  public register(definition: CapabilityDefinition) {
    this.capabilities.set(definition.capabilityId, definition);
    this.enabled.set(definition.capabilityId, true);
    console.log(`[CapabilityRegistry] Registered: ${definition.capabilityId}`);
  }

  public remove(id: CapabilityId) {
    this.capabilities.delete(id);
    this.enabled.delete(id);
  }

  public setEnabled(id: CapabilityId, enabled: boolean) {
    this.enabled.set(id, enabled);
  }

  public get(id: CapabilityId): CapabilityDefinition | undefined {
    if (!this.enabled.get(id)) return undefined;
    return this.capabilities.get(id);
  }
}

export const capabilityRegistry = new CapabilityRegistry();
