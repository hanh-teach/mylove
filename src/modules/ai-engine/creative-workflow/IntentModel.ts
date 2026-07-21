export type WorkflowType = 'love-note' | 'album' | 'video' | 'website' | 'marketing' | 'story';

export interface IntentModel {
  occasion?: string;
  theme?: string;
  style?: string;
  emotion?: string;
  language?: string;
  relationship?: string;
  targetPlatform?: string;
  requiredWorkflows: WorkflowType[];
  metadata: Record<string, any>;
}
