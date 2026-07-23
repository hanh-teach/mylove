import { TaskDefinition } from './TaskDefinition';
import { taskEngine } from './TaskEngine';

export interface TaskExecutionProgress {
  taskId: string;
  taskName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: any;
  error?: string;
}

export class TaskExecutor {
  /**
   * Executes tasks grouped in topological DAG batches.
   */
  public async executeBatches(
    batches: TaskDefinition[][], 
    onProgress?: (progress: TaskExecutionProgress) => void
  ): Promise<Record<string, any>> {
    const taskOutputs: Record<string, any> = {};

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      // Execute current topological batch in parallel
      const batchPromises = batch.map(async (task) => {
        task.status = 'running';
        if (onProgress) {
          onProgress({ taskId: task.id, taskName: task.name, status: 'running' });
        }

        // Merge outputs from dependency tasks into current task input
        const resolvedInput = { ...task.input };
        for (const depId of task.dependencies) {
          if (taskOutputs[depId]) {
            resolvedInput[`dep_${depId}`] = taskOutputs[depId];
          }
        }
        task.input = resolvedInput;

        try {
          const output = await this.executeTaskWithRetry(task);
          task.status = 'completed';
          task.output = output;
          taskOutputs[task.id] = output;

          if (onProgress) {
            onProgress({ taskId: task.id, taskName: task.name, status: 'completed', output });
          }

          return { taskId: task.id, success: true, output };
        } catch (err: any) {
          task.status = 'failed';
          const errorMessage = err.message || 'Task execution failed';

          if (onProgress) {
            onProgress({ taskId: task.id, taskName: task.name, status: 'failed', error: errorMessage });
          }

          throw new Error(`Task ${task.name} (${task.id}) failed: ${errorMessage}`);
        }
      });

      // Wait for all tasks in this batch to finish before moving to dependent downstream batch
      await Promise.all(batchPromises);
    }

    return taskOutputs;
  }

  /**
   * Executes a single task with retry backoff policy.
   */
  private async executeTaskWithRetry(task: TaskDefinition): Promise<any> {
    let attempts = 0;
    const maxAttempts = (task.retry?.maxRetries || 0) + 1;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        task.retry.currentRetry = attempts - 1;
        return await taskEngine.execute(task);
      } catch (error) {
        if (attempts >= maxAttempts) {
          throw error;
        }
        // Exponential backoff delay
        const delay = Math.pow(2, attempts) * 300;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  public async execute(tasks: TaskDefinition[]): Promise<any[]> {
    const results = [];
    for (const task of tasks) {
      const result = await taskEngine.execute(task);
      results.push(result);
    }
    return results;
  }
}

export const taskExecutor = new TaskExecutor();

