export interface ReflectionTrace {
  id: string;
  workflowId: string;
  originalOutput: string;
  critique: string;
  improvement: string;
  finalOutput: string;
  qualityScore: number;
  confidence: number;
  timestamp: string;
}
