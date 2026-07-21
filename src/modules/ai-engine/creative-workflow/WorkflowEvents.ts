export class WorkflowEvents {
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  public on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}

export const workflowEvents = new WorkflowEvents();
