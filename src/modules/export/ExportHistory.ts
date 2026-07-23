import { ExportHistoryRecord } from './ExportTypes';

export class ExportHistory {
  private records: ExportHistoryRecord[] = [];
  private listeners: ((records: ExportHistoryRecord[]) => void)[] = [];

  public addRecord(record: ExportHistoryRecord) {
    this.records = [record, ...this.records];
    this.notify();
  }

  public getRecords(): ExportHistoryRecord[] {
    return [...this.records];
  }

  public subscribe(listener: (records: ExportHistoryRecord[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.records));
  }
}
