import { WorkflowDefinition } from './WorkflowDefinition';

export class WorkflowRepository {
  private storage: Map<string, WorkflowDefinition> = new Map();

  public async save(workflow: WorkflowDefinition): Promise<void> {
    this.storage.set(workflow.id, workflow);
  }

  public async get(id: string): Promise<WorkflowDefinition | undefined> {
    return this.storage.get(id);
  }
}

export const workflowRepository = new WorkflowRepository();
