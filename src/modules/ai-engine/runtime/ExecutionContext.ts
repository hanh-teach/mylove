import { RuntimeState } from './ExecutionState';
import { TaskDefinition } from '../creative-workflow/TaskDefinition';

export interface ArtifactItem {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'json' | 'metadata';
  url?: string;
  content?: string;
  sizeBytes?: number;
  createdAt: string;
}

export interface ExecutionContext {
  workflowId: string;
  sessionId: string;
  userId?: string;
  traceId: string;
  goal: string;
  memory: Record<string, any>;
  reasonTrace?: any;
  tokenBudget: number;
  costBudgetUsd: number;
  currentCostUsd: number;
  currentTokenUsage: number;
  state: RuntimeState;
  currentTaskId?: string;
  results: Record<string, any>;
  artifacts: ArtifactItem[];
  startTime: number;
  endTime?: number;
}
