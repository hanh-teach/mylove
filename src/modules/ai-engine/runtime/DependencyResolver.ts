import { TaskDefinition } from '../creative-workflow/TaskDefinition';

export class DependencyResolver {
  public static validateAndSort(tasks: TaskDefinition[]): { isValid: boolean; error?: string; batches: TaskDefinition[][] } {
    const taskMap = new Map<string, TaskDefinition>();
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    for (const t of tasks) {
      taskMap.set(t.id, t);
      inDegree.set(t.id, 0);
      adjList.set(t.id, []);
    }

    for (const t of tasks) {
      for (const depId of t.dependencies) {
        if (!taskMap.has(depId)) {
          return {
            isValid: false,
            error: `Task ${t.id} depends on missing task ${depId}`,
            batches: []
          };
        }
        adjList.get(depId)?.push(t.id);
        inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
      }
    }

    const batches: TaskDefinition[][] = [];
    let currentQueue: string[] = [];

    inDegree.forEach((deg, id) => {
      if (deg === 0) currentQueue.push(id);
    });

    let processedCount = 0;

    while (currentQueue.length > 0) {
      const batchTasks = currentQueue.map(id => taskMap.get(id)!);
      batches.push(batchTasks);
      processedCount += currentQueue.length;

      const nextQueue: string[] = [];
      for (const id of currentQueue) {
        const neighbors = adjList.get(id) || [];
        for (const neighbor of neighbors) {
          const deg = (inDegree.get(neighbor) || 1) - 1;
          inDegree.set(neighbor, deg);
          if (deg === 0) {
            nextQueue.push(neighbor);
          }
        }
      }
      currentQueue = nextQueue;
    }

    if (processedCount !== tasks.length) {
      return {
        isValid: false,
        error: 'Circular dependency detected in execution graph DAG!',
        batches: []
      };
    }

    return {
      isValid: true,
      batches
    };
  }

  public static areDependenciesCompleted(task: TaskDefinition, completedTaskIds: Set<string>): boolean {
    for (const depId of task.dependencies) {
      if (!completedTaskIds.has(depId)) {
        return false;
      }
    }
    return true;
  }
}
