import { PermissionMatrix } from './PermissionMatrix';
import { RiskEngine } from './RiskEngine';
import { ComplianceEngine } from './ComplianceEngine';

export class AuthorizationService {
  public static authorize(agent: string, action: string, request: any): boolean {
    return PermissionMatrix.check(agent, action) && 
           RiskEngine.analyze(request) < 0.8 &&
           ComplianceEngine.validate(request);
  }
}
