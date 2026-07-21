export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  trigger: string;
  tasks: import('./TaskDefinition').TaskDefinition[];
  conditions: any[];
  priority: number;
  timeout: number;
  retry: {
    maxRetries: number;
    backoff: 'linear' | 'exponential';
  };
  version: string;
  metadata: Record<string, any>;
}
