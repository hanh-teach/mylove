import { TaskDefinition } from './TaskDefinition';
import { taskEngine } from './TaskEngine';

export class TaskExecutor {
  public async execute(tasks: TaskDefinition[]): Promise<any[]> {
    // Basic implementation: sequential
    const results = [];
    for (const task of tasks) {
      const result = await taskEngine.execute(task);
      results.push(result);
    }
    return results;
  }
}

export const taskExecutor = new TaskExecutor();
