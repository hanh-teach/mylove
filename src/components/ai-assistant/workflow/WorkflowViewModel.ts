export type TaskStatus = 'completed' | 'running' | 'failed' | 'waiting' | 'cancelled' | 'paused';

export type WorkflowStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface WorkflowTaskViewModel {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number; // 0 to 100
  provider: string; // e.g., 'Gemini', 'Fal.ai', 'Runway', 'System'
  latency: string; // e.g., '2.1s'
  cost: number; // USD
  startedAt?: string;
  endedAt?: string;
  retryCount: number;
  dependencies: string[];
  prompt?: string;
}

export interface TimelineItem {
  id: string;
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

export interface CostBreakdown {
  gemini: number;
  runway: number;
  fal: number;
  total: number;
}

export interface TimeBreakdown {
  planning: string;
  memory: string;
  letter: string;
  image: string;
  video: string;
  reflection: string;
  export: string;
}

export interface MetricsSummary {
  totalTasks: number;
  completed: number;
  running: number;
  waiting: number;
  failed: number;
}

export interface ProviderStatus {
  name: string;
  status: 'idle' | 'running' | 'waiting' | 'completed';
  latency: string;
  cost: number;
}

export interface WorkflowSessionViewModel {
  workflowId: string;
  goal: string;
  status: WorkflowStatus;
  startedAt: string;
  progress: number; // 0 to 100
  estimatedRemaining: string;
  elapsedTime: string;
  currentTaskId: string | null;
  tasks: WorkflowTaskViewModel[];
  timeline: TimelineItem[];
  metrics: MetricsSummary;
  costs: CostBreakdown;
  timeSummary: TimeBreakdown;
  providers: ProviderStatus[];
}
