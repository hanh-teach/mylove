import { ExecutionContext, ArtifactItem } from './ExecutionContext';
import { TaskDefinition } from '../creative-workflow/TaskDefinition';

export interface WorkflowResult {
  workflowId: string;
  sessionId: string;
  goal: string;
  status: 'completed' | 'failed' | 'cancelled';
  summaryText: string;
  artifacts: ArtifactItem[];
  taskOutputs: Record<string, any>;
  durationMs: number;
  totalCostUsd: number;
}

export class ResultAggregator {
  public static aggregate(context: ExecutionContext, status: 'completed' | 'failed' | 'cancelled'): WorkflowResult {
    const durationMs = (context.endTime || Date.now()) - context.startTime;
    
    // Extract summary from task results
    let summaryText = `Workflow completed for goal: "${context.goal}"`;
    for (const [taskId, output] of Object.entries(context.results)) {
      if (typeof output === 'string' && output.length > 20) {
        summaryText = output;
        break;
      } else if (output && typeof output === 'object' && output.text) {
        summaryText = output.text;
        break;
      }
    }

    return {
      workflowId: context.workflowId,
      sessionId: context.sessionId,
      goal: context.goal,
      status,
      summaryText,
      artifacts: context.artifacts,
      taskOutputs: context.results,
      durationMs,
      totalCostUsd: context.currentCostUsd
    };
  }

  public static registerArtifact(context: ExecutionContext, task: TaskDefinition, output: any): void {
    let type: ArtifactItem['type'] = 'text';
    if (task.type === 'image') type = 'image';
    if (task.type === 'video') type = 'video';
    if (task.type === 'music' || task.type === 'voice') type = 'audio';

    const artifact: ArtifactItem = {
      id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${task.name} Result`,
      type,
      content: typeof output === 'string' ? output : JSON.stringify(output),
      url: output?.url || output?.imageUrl || output?.videoUrl,
      createdAt: new Date().toISOString()
    };

    context.artifacts.push(artifact);
  }
}
