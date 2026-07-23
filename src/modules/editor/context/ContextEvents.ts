type EventCallback = (data?: any) => void;

class ContextEventEmitter {
  private listeners: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.off(event, callback);
    };
  }

  off(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data?: any): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error(`Error in event listener for ${event}:`, e);
      }
    });
  }
}

export const ContextEvents = new ContextEventEmitter();

export const CONTEXT_EVENTS = {
  CONTEXT_UPDATED: 'CONTEXT_UPDATED',
  TIMELINE_CHANGED: 'TIMELINE_CHANGED',
  MEMORY_SELECTED: 'MEMORY_SELECTED',
  SELECTION_CHANGED: 'SELECTION_CHANGED',
  MOOD_CHANGED: 'MOOD_CHANGED',
  DOCUMENT_CHANGED: 'DOCUMENT_CHANGED',
};
