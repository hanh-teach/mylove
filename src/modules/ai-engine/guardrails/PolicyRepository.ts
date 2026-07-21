import { PolicyDefinition } from './PolicyDefinition';

export class PolicyRepository {
  private storage: Map<string, PolicyDefinition> = new Map();

  public async save(policy: PolicyDefinition): Promise<void> {
    this.storage.set(policy.id, policy);
  }

  public async get(id: string): Promise<PolicyDefinition | undefined> {
    return this.storage.get(id);
  }

  public async getAll(): Promise<PolicyDefinition[]> {
    return Array.from(this.storage.values());
  }
}

export const policyRepository = new PolicyRepository();
