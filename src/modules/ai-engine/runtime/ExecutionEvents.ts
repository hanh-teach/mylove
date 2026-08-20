export type RuntimeEventType = 
  | 'WORKFLOW_STARTED'
  | 'TASK_STARTED'
  | 'TASK_COMPLETED'
  | 'TASK_FAILED'
  | 'PROGRESS_UPDATED'
  | 'WORKFLOW_FINISHED'
  | 'WORKFLOW_FAILED'
  | 'WORKFLOW_CANCELLED';

export interface RuntimeEvent {
  type: RuntimeEventType;
  sessionId: string;
  workflowId: string;
  taskId?: string;
  taskName?: string;
  progressPercent?: number;
  message?: string;
  payload?: any;
  timestamp: string;
}

export type RuntimeEventListener = (event: RuntimeEvent) => void;

class EventBus {
  private listeners: RuntimeEventListener[] = [];

  public subscribe(listener: RuntimeEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public emit(event: RuntimeEvent): void {
    console.log(`[RuntimeEvent] [${event.type}]`, event.message || '', event.taskId || '');
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error('[RuntimeEvent] Listener error:', e);
      }
    });
  }
}

export const runtimeEventBus = new EventBus();
