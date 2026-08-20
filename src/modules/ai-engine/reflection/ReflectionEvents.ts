export type ReflectionEventType = 'REFLECTION_STARTED' | 'REFLECTION_COMPLETED' | 'REFLECTION_FAILED';

export interface ReflectionEvent {
  type: ReflectionEventType;
  workflowId: string;
  trace?: any;
  message?: string;
  timestamp: string;
}

export type ReflectionEventListener = (event: ReflectionEvent) => void;

class ReflectionEventBus {
  private listeners: ReflectionEventListener[] = [];

  public subscribe(listener: ReflectionEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public emit(event: ReflectionEvent): void {
    console.log(`[ReflectionEvent] [${event.type}]`, event.message || '');
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (e) {
        console.error('[ReflectionEventBus] Listener error:', e);
      }
    });
  }
}

export const reflectionEventBus = new ReflectionEventBus();
