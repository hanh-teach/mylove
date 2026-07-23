import { PolicyEngine as RealPolicyEngine } from '../policy/PolicyEngine';

export class PolicyEngine {
  public static validate(request: any): boolean {
    // Default agent and action for AIOS integration
    return RealPolicyEngine.validate('SYSTEM', 'EXECUTE', request);
  }
}
