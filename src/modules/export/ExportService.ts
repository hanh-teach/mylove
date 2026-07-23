import { ExportQueue } from './ExportQueue';
import { ExportHistory } from './ExportHistory';
import { ExportRegistry } from './ExportRegistry';
import { ExportOptions, ExportTask } from './ExportTypes';

export class ExportService {
  public static queue = new ExportQueue();
  public static history = new ExportHistory();
  private static isProcessing = false;

  public static async export(projectId: string, data: any, options: ExportOptions) {
    const task = this.queue.addTask(projectId, options);
    this.processQueue(data);
    return task.id;
  }

  private static async processQueue(data: any) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    let task = this.queue.getNextTask();
    while (task) {
      this.queue.updateTask(task.id, { status: 'running', progress: 10 });
      
      const exporter = ExportRegistry.get(task.format);
      if (!exporter) {
        this.queue.updateTask(task.id, { status: 'failed', result: { success: false, error: 'Exporter not found' } });
      } else {
        try {
          const result = await exporter.export(data, task.options);
          this.queue.updateTask(task.id, { 
            status: 'completed', 
            progress: 100, 
            result, 
            completedAt: Date.now() 
          });

          this.history.addRecord({
            id: Math.random().toString(36).substring(2, 9),
            taskId: task.id,
            projectId: task.projectId,
            filename: task.filename,
            format: task.format,
            options: task.options,
            timestamp: Date.now(),
            url: result.url
          });

          // Trigger download if url is available
          if (result.url) {
            const a = document.createElement('a');
            a.href = result.url;
            a.download = task.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        } catch (error: any) {
          this.queue.updateTask(task.id, { 
            status: 'failed', 
            result: { success: false, error: error.message } 
          });
        }
      }
      
      task = this.queue.getNextTask();
    }

    this.isProcessing = false;
  }
}
