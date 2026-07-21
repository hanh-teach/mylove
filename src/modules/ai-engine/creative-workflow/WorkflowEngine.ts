import { WorkflowDefinition } from './WorkflowDefinition';
import { workflowOrchestrator } from './WorkflowOrchestrator';

export class WorkflowEngine {
  public async run(workflow: WorkflowDefinition) {
    return await workflowOrchestrator.execute(workflow);
  }
}

export const workflowEngine = new WorkflowEngine();
