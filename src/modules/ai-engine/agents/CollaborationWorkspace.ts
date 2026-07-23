export interface WorkspaceState {
  workflowId: string;
  currentGoal: string;
  context: any;
  artifacts: Record<string, any>;
  decisions: any[];
  notes: string[];
}

export class CollaborationWorkspace {
  private static workspaces = new Map<string, WorkspaceState>();

  public static create(workflowId: string, currentGoal: string): WorkspaceState {
    const state: WorkspaceState = {
      workflowId,
      currentGoal,
      context: {},
      artifacts: {},
      decisions: [],
      notes: []
    };
    this.workspaces.set(workflowId, state);
    console.log(`[Workspace] Created workspace for workflow ${workflowId}`);
    return state;
  }

  public static get(workflowId: string): WorkspaceState | undefined {
    return this.workspaces.get(workflowId);
  }

  public static updateArtifact(workflowId: string, key: string, value: any): void {
    const ws = this.get(workflowId);
    if (ws) {
      ws.artifacts[key] = value;
      console.log(`[Workspace] WORKSPACE_UPDATED: Artifact ${key} in workflow ${workflowId}`);
    }
  }

  public static addDecision(workflowId: string, decision: any): void {
    const ws = this.get(workflowId);
    if (ws) {
      ws.decisions.push(decision);
    }
  }
}
