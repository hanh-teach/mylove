export interface WorkflowConfig {
  maxConcurrentTasks: number;
  defaultTimeout: number;
  enableMetrics: boolean;
}

export const defaultWorkflowConfig: WorkflowConfig = {
  maxConcurrentTasks: 5,
  defaultTimeout: 30000,
  enableMetrics: true,
};
