import { Exporter, ExportOptions, ExportResult } from '../ExportTypes';
import { getExportCanvas } from '../ExportHelper';

export class ImageExporter implements Exporter {
  id = 'png' as const;
  name = 'PNG Image';
  description = 'Xuất ảnh PNG chất lượng cao.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    try {
      const canvas = await getExportCanvas(data, options, options.targetElement);
      return await new Promise<ExportResult>((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({ success: true, blob, url });
            } else {
              reject(new Error('SecurityError: Tainted canvas - Không thể xuất vì thiệp có ảnh từ nguồn không hỗ trợ. Vui lòng thay ảnh nền khác hoặc tải ảnh của bạn lên trực tiếp.'));
            }
          }, 'image/png');
        } catch (err) {
          reject(err);
        }
      });
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi khi xuất ảnh PNG' };
    }
  }
}

export class JpgExporter implements Exporter {
  id = 'jpg' as const;
  name = 'JPG Image';
  description = 'Xuất ảnh JPG nén cao.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    try {
      const canvas = await getExportCanvas(data, options, options.targetElement);
      return await new Promise<ExportResult>((resolve, reject) => {
        try {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({ success: true, blob, url });
            } else {
              reject(new Error('SecurityError: Tainted canvas - Không thể xuất vì thiệp có ảnh từ nguồn không hỗ trợ. Vui lòng thay ảnh nền khác hoặc tải ảnh của bạn lên trực tiếp.'));
            }
          }, 'image/jpeg', 0.9);
        } catch (err) {
          reject(err);
        }
      });
    } catch (err: any) {
      return { success: false, error: err?.message || 'Lỗi khi xuất ảnh JPG' };
    }
  }
}



