export interface WorkflowMetric {
  workflowId: string;
  duration: number;
  success: boolean;
}

export class WorkflowMetrics {
  private metrics: WorkflowMetric[] = [];
  public log(metric: WorkflowMetric) {
    this.metrics.push(metric);
  }
}

export const workflowMetrics = new WorkflowMetrics();
