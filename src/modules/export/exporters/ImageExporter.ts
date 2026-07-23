import { Exporter, ExportOptions, ExportResult } from '../ExportTypes';
import html2canvas from 'html2canvas';

export class ImageExporter implements Exporter {
  id = 'png' as const;
  name = 'PNG Image';
  description = 'Xuất ảnh PNG chất lượng cao.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const artboard = document.getElementById('canvas-artboard');
        if (artboard) {
          html2canvas(artboard, { 
            scale: options.quality === 'print' ? 4 : options.quality === 'high' ? 2 : 1,
            useCORS: true 
          }).then(canvas => {
            canvas.toBlob(blob => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve({ success: true, blob, url });
              } else {
                reject(new Error('Failed to create blob'));
              }
            }, 'image/png');
          }).catch(err => reject(err));
        } else {
          resolve({ success: false, error: 'Canvas not found' });
        }
      }, 500);
    });
  }
}

export class JpgExporter implements Exporter {
  id = 'jpg' as const;
  name = 'JPG Image';
  description = 'Xuất ảnh JPG nén cao.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const artboard = document.getElementById('canvas-artboard');
        if (artboard) {
          html2canvas(artboard, { 
            scale: options.quality === 'print' ? 4 : options.quality === 'high' ? 2 : 1,
            useCORS: true 
          }).then(canvas => {
            canvas.toBlob(blob => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                resolve({ success: true, blob, url });
              } else {
                reject(new Error('Failed to create blob'));
              }
            }, 'image/jpeg', 0.9);
          }).catch(err => reject(err));
        } else {
          resolve({ success: false, error: 'Canvas not found' });
        }
      }, 500);
    });
  }
}
