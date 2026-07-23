import { TaskDefinition } from '../creative-workflow/TaskDefinition';
import { ExecutionContext } from './ExecutionContext';
import { TaskDispatcher } from './TaskDispatcher';
import { RetryPolicy } from './RetryPolicy';
import { runtimeEventBus } from './ExecutionEvents';
import { ResultAggregator } from './ResultAggregator';

export class TaskScheduler {
  public static async executeBatches(
    batches: TaskDefinition[][],
    context: ExecutionContext,
    isCancelledRef: { value: boolean }
  ): Promise<void> {
    const totalTasks = batches.reduce((acc, b) => acc + b.length, 0);
    let completedCount = 0;

    for (let i = 0; i < batches.length; i++) {
      if (isCancelledRef.value) {
        throw new Error('Workflow execution cancelled by user.');
      }

      const batch = batches[i];
      const batchPromises = batch.map(async (task) => {
        if (isCancelledRef.value) return;

        context.currentTaskId = task.id;
        task.status = 'running';

        runtimeEventBus.emit({
          type: 'TASK_STARTED',
          sessionId: context.sessionId,
          workflowId: context.workflowId,
          taskId: task.id,
          taskName: task.name,
          message: `Starting task: ${task.name}`,
          timestamp: new Date().toISOString()
        });

        // Resolve dependencies input
        const resolvedInput = { ...task.input };
        for (const depId of task.dependencies) {
          if (context.results[depId]) {
            resolvedInput[`dep_${depId}`] = context.results[depId];
          }
        }
        task.input = resolvedInput;

        try {
          const maxRetries = task.retry?.maxRetries ?? 2;
          const output = await RetryPolicy.executeWithRetry(
            async () => await TaskDispatcher.dispatch(task, context),
            { maxRetries, initialDelayMs: 1000, backoffMultiplier: 2 },
            (attempt, err, delay) => {
              runtimeEventBus.emit({
                type: 'PROGRESS_UPDATED',
                sessionId: context.sessionId,
                workflowId: context.workflowId,
                taskId: task.id,
                taskName: task.name,
                message: `Task ${task.name} failed attempt ${attempt}. Retrying in ${delay}ms...`,
                timestamp: new Date().toISOString()
              });
            }
          );

          task.status = 'completed';
          task.output = output;
          context.results[task.id] = output;
          context.currentTokenUsage += 250;
          context.currentCostUsd += 0.005;

          ResultAggregator.registerArtifact(context, task, output);
          completedCount++;

          const percent = Math.round((completedCount / totalTasks) * 100);

          runtimeEventBus.emit({
            type: 'TASK_COMPLETED',
            sessionId: context.sessionId,
            workflowId: context.workflowId,
            taskId: task.id,
            taskName: task.name,
            progressPercent: percent,
            message: `Completed task: ${task.name}`,
            payload: output,
            timestamp: new Date().toISOString()
          });

        } catch (err: any) {
          task.status = 'failed';
          runtimeEventBus.emit({
            type: 'TASK_FAILED',
            sessionId: context.sessionId,
            workflowId: context.workflowId,
            taskId: task.id,
            taskName: task.name,
            message: `Task ${task.name} failed: ${err.message}`,
            timestamp: new Date().toISOString()
          });
          throw err;
        }
      });

      await Promise.all(batchPromises);
    }
  }
}
