export type PipelineStepType = 
  | 'idea' | 'story' | 'storyboard' | 'prompt' | 'image' 
  | 'refine' | 'animation' | 'voice' | 'music' | 'video' | 'export';

export interface PipelineStep {
  id: string;
  type: PipelineStepType;
  executor: (context: any) => Promise<any>;
  dependencies: string[];
  retry?: {
    maxRetries: number;
    backoff: 'linear' | 'exponential';
  };
  fallback?: (context: any) => Promise<any>;
}

export interface PipelineDefinition {
  id: string;
  steps: PipelineStep[];
}
