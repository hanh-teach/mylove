import { PromptVersion } from './PromptVersion';

export interface HistoryEntry {
  templateId: string;
  version: PromptVersion;
  timestamp: number;
  action: 'create' | 'update' | 'publish' | 'archive' | 'rollback';
}

export class PromptHistory {
  private history: HistoryEntry[] = [];

  public log(entry: HistoryEntry) {
    this.history.push(entry);
  }

  public getHistory(templateId: string): HistoryEntry[] {
    return this.history.filter(entry => entry.templateId === templateId);
  }
}

export const promptHistory = new PromptHistory();
