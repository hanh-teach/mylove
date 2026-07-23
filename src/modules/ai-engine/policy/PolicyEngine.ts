import { PolicyEvaluator } from './PolicyEvaluator';
import { AuthorizationService } from './AuthorizationService';
import { PolicyAudit } from './PolicyAudit';

export class PolicyEngine {
  public static validate(agent: string, action: string, request: any): boolean {
    const authorized = AuthorizationService.authorize(agent, action, request);
    PolicyAudit.log({ agent, action, authorized });
    return authorized;
  }
}
