import { Exporter, ExportOptions, ExportResult } from '../ExportTypes';

export class JsonExporter implements Exporter {
  id = 'json' as const;
  name = 'JSON (Project Backup)';
  description = 'Xuất toàn bộ dữ liệu dự án ra định dạng .ln4 để sao lưu.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jsonStr = JSON.stringify({
          version: '1.0',
          type: 'LoveNoteProject',
          options,
          data
        }, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        resolve({ success: true, blob, url });
      }, 1000);
    });
  }
}
