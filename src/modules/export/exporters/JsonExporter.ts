import { Exporter, ExportOptions, ExportResult } from '../ExportTypes';

function safeStringify(obj: any, indent = 2) {
  const seen = new WeakSet();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'function' || value instanceof HTMLElement || (value && typeof value === 'object' && '$$typeof' in value)) {
        return undefined;
      }
      if (value && typeof value === 'object') {
        if (seen.has(value)) {
          return undefined;
        }
        seen.add(value);
      }
      return value;
    },
    indent
  );
}

export class JsonExporter implements Exporter {
  id = 'json' as const;
  name = 'JSON (Project Backup)';
  description = 'Xuất toàn bộ dữ liệu dự án ra định dạng .ln4 để sao lưu.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jsonStr = safeStringify({
          version: '1.0',
          type: 'NoteMeProject',
          options,
          data
        }, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        resolve({ success: true, blob, url });
      }, 1000);
    });
  }
}

