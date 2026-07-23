export enum RuntimeState {
  CREATED = 'CREATED',
  READY = 'READY',
  RUNNING = 'RUNNING',
  WAITING = 'WAITING',
  RETRYING = 'RETRYING',
  FAILED = 'FAILED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export type TaskRuntimeStatus = 'pending' | 'ready' | 'running' | 'retrying' | 'completed' | 'failed' | 'cancelled';
