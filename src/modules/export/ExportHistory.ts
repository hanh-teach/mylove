import { ExportHistoryRecord } from './ExportTypes';

export class ExportHistory {
  private records: ExportHistoryRecord[] = [];
  private listeners: ((records: ExportHistoryRecord[]) => void)[] = [];

  public addRecord(record: ExportHistoryRecord) {
    this.records = [record, ...this.records];
    if (this.records.length > 20) {
      const pruned = this.records.slice(20);
      this.records = this.records.slice(0, 20);
      pruned.forEach(rec => {
        if (rec.url && rec.url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(rec.url);
            console.log(`[ExportHistory] Pruned and revoked oldest record Blob URL: ${rec.url}`);
          } catch (e) {
            console.error('[ExportHistory] Error revoking pruned URL:', e);
          }
        }
      });
    }
    this.notify();
  }

  public deleteRecord(id: string) {
    const record = this.records.find(r => r.id === id);
    if (record) {
      if (record.url && record.url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(record.url);
          console.log(`[ExportHistory] Deleted and revoked record Blob URL: ${record.url}`);
        } catch (e) {
          console.error('[ExportHistory] Error revoking deleted URL:', e);
        }
      }
      this.records = this.records.filter(r => r.id !== id);
      this.notify();
    }
  }

  public getRecords(): ExportHistoryRecord[] {
    return [...this.records];
  }

  public clear() {
    this.records.forEach(record => {
      if (record.url && record.url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(record.url);
          console.log(`[ExportHistory] Revoked URL: ${record.url}`);
        } catch (e) {
          console.error('[ExportHistory] Error revoking URL:', e);
        }
      }
    });
    this.records = [];
    this.notify();
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
