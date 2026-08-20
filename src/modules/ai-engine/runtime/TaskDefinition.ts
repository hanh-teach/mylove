export interface TaskDefinition {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text' | 'voice' | 'music' | 'animation' | 'template' | 'website' | 'timeline' | 'export';
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  input: Record<string, any>;
  output?: Record<string, any>;
  dependencies: string[];
  retry: {
    maxRetries: number;
    currentRetry: number;
  };
  timeout: number;
  metadata: Record<string, any>;
}
