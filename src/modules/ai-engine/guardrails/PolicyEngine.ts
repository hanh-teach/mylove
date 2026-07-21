import { GuardrailRequestContext } from './GuardrailTypes';
import { PolicyDefinition } from './PolicyDefinition';
import { policyRegistry } from './PolicyRegistry';

export class PolicyEngine {
  public evaluate(context: GuardrailRequestContext): PolicyDefinition[] {
    const policies = policyRegistry.getAll().filter(p => p.enabled);
    return policies.filter(policy => this.checkConditions(policy, context));
  }

  private checkConditions(policy: PolicyDefinition, context: GuardrailRequestContext): boolean {
    return policy.conditions.every(condition => {
      const contextValue = (context as any)[condition.key];
      switch (condition.operator) {
        case 'equals': return contextValue === condition.value;
        case 'greaterThan': return contextValue > condition.value;
        case 'lessThan': return contextValue < condition.value;
        case 'contains': return Array.isArray(contextValue) && contextValue.includes(condition.value);
        default: return false;
      }
    });
  }
}

export const policyEngine = new PolicyEngine();
