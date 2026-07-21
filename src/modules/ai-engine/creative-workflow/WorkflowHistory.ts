export interface HistoryEntry {
  workflowId: string;
  timestamp: number;
  action: string;
}

export class WorkflowHistory {
  private history: HistoryEntry[] = [];
  public log(entry: HistoryEntry) {
    this.history.push(entry);
  }
}

export const workflowHistory = new WorkflowHistory();
