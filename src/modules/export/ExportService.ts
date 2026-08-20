import { ExportQueue } from './ExportQueue';
import { ExportHistory } from './ExportHistory';
import { ExportRegistry } from './ExportRegistry';
import { ExportOptions, ExportTask } from './ExportTypes';
import { triggerFileDownload } from './downloadUtils';

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
          if (result.success) {
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
              await triggerFileDownload(result.url, task.filename);
            }
          } else {
            this.queue.updateTask(task.id, { 
              status: 'failed', 
              progress: 0, 
              result 
            });
            alert(result.error || 'Lỗi khi xuất file');
          }
        } catch (error: any) {
          console.error('[ExportService] Error during task processing:', error);
          let userError = error.message || 'Lỗi không xác định.';
          const isSecurityError = error.name === 'SecurityError' || userError.includes('SecurityError') || userError.includes('taint') || userError.includes('secure') || userError.includes('Blob');
          if (isSecurityError) {
            userError = 'Không thể xuất vì thiệp có ảnh từ nguồn không hỗ trợ (Lỗi bảo mật CORS/Tainted canvas). Vui lòng thay ảnh nền khác hoặc tải ảnh của bạn lên trực tiếp.';
            alert(userError);
          }
          this.queue.updateTask(task.id, { 
            status: 'failed', 
            result: { success: false, error: userError } 
          });
        }
      }
      
      task = this.queue.getNextTask();
    }

    this.isProcessing = false;
  }
}
