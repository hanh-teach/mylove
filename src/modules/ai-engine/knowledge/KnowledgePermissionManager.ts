import { KnowledgePolicy } from './KnowledgePolicy';

export class KnowledgePermissionManager {
  /**
   * Evaluates if the given requester agent has permissions to access a specific knowledge type.
   */
  public static authorize(agentRole: string, itemType: string): boolean {
    return KnowledgePolicy.isAccessAllowed(agentRole, itemType);
  }
}
