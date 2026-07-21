import { WorkflowDefinition } from './WorkflowDefinition';

export class WorkflowRegistry {
  private workflows: Map<string, WorkflowDefinition> = new Map();

  public register(workflow: WorkflowDefinition) {
    this.workflows.set(workflow.id, workflow);
  }

  public get(id: string): WorkflowDefinition | undefined {
    return this.workflows.get(id);
  }
}

export const workflowRegistry = new WorkflowRegistry();
