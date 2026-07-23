import { AITool } from './AITool';

export class PermissionManager {
  private static rolePermissions: Map<string, string[]> = new Map([
    [
      'PlannerAgent',
      ['workflow-planner', 'prompt-optimizer', 'toast-notify']
    ],
    [
      'LoveLetterAgent',
      ['text-generator', 'prompt-optimizer', 'sqlite-database', 'toast-notify']
    ],
    [
      'VideoAgent',
      ['image-generator', 'video-generator', 'toast-notify']
    ],
    [
      'SystemAdmin',
      ['*'] // Access to all registered tooling
    ]
  ]);

  /**
   * Evaluates if the given requester agent has permissions to execute a specific tool.
   */
  public static authorize(agentRole: string, toolId: string): boolean {
    const allowedTools = this.rolePermissions.get(agentRole);
    if (!allowedTools) {
      // Default sandbox role permissions: only safe, low-cost notifications
      return ['toast-notify'].includes(toolId);
    }

    if (allowedTools.includes('*')) {
      return true;
    }

    return allowedTools.includes(toolId);
  }

  /**
   * Registers custom permissions dynamically for extended composite agents.
   */
  public static grantPermission(agentRole: string, toolId: string): void {
    const existing = this.rolePermissions.get(agentRole) || [];
    if (!existing.includes(toolId)) {
      existing.push(toolId);
      this.rolePermissions.set(agentRole, existing);
    }
  }
}
