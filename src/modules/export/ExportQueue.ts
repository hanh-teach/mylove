import { ExportTask, ExportOptions } from './ExportTypes';

export class ExportQueue {
  private tasks: ExportTask[] = [];
  private listeners: ((tasks: ExportTask[]) => void)[] = [];

  public addTask(projectId: string, options: ExportOptions): ExportTask {
    const task: ExportTask = {
      id: Math.random().toString(36).substring(2, 9),
      projectId,
      filename: options.filename,
      format: options.format,
      status: 'waiting',
      progress: 0,
      options,
      createdAt: Date.now(),
    };
    this.tasks = [...this.tasks, task];
    this.notify();
    return task;
  }

  public updateTask(id: string, updates: Partial<ExportTask>) {
    this.tasks = this.tasks.map(t => t.id === id ? { ...t, ...updates } : t);
    this.notify();
  }

  public getTasks(): ExportTask[] {
    return [...this.tasks];
  }

  public getNextTask(): ExportTask | undefined {
    return this.tasks.find(t => t.status === 'waiting');
  }

  public subscribe(listener: (tasks: ExportTask[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.tasks));
  }
}
