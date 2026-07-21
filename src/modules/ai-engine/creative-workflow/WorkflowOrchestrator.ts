import { WorkflowDefinition } from './WorkflowDefinition';
import { taskExecutor } from './TaskExecutor';

export class WorkflowOrchestrator {
  public async execute(workflow: WorkflowDefinition) {
    console.log(`[WorkflowOrchestrator] Executing workflow: ${workflow.name}`);
    return await taskExecutor.execute(workflow.tasks);
  }
}

export const workflowOrchestrator = new WorkflowOrchestrator();
