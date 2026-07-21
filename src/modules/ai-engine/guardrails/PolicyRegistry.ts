import { PolicyDefinition } from './PolicyDefinition';

export class PolicyRegistry {
  private policies: Map<string, PolicyDefinition> = new Map();

  public register(policy: PolicyDefinition) {
    this.policies.set(policy.id, policy);
  }

  public get(id: string): PolicyDefinition | undefined {
    return this.policies.get(id);
  }

  public getAll(): PolicyDefinition[] {
    return Array.from(this.policies.values());
  }

  public remove(id: string) {
    this.policies.delete(id);
  }
}

export const policyRegistry = new PolicyRegistry();
