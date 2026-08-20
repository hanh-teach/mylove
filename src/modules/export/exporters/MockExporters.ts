import { Exporter, ExportOptions, ExportResult } from '../ExportTypes';
import { getExportCanvas, getExportCanvasA4, extractProjectDetails } from '../ExportHelper';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

export class PdfExporter implements Exporter {
  id = 'pdf' as const;
  name = 'PDF Document';
  description = 'Xuất tài liệu PDF để in ấn hoặc chia sẻ.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    try {
      const canvas = await getExportCanvasA4(data, options);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({
        orientation: options.orientation || 'portrait',
        unit: 'mm',
        format: options.pageSize || 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Add full-page image (margins are already perfectly baked inside getExportCanvasA4)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);

      return { success: true, blob, url };
    } catch (error: any) {
      console.error('[PdfExporter] Error generating PDF:', error);
      return { success: false, error: error?.message || 'Lỗi khi tạo file PDF' };
    }
  }
}

export class DocxExporter implements Exporter {
  id = 'docx' as const;
  name = 'DOCX Document';
  description = 'Xuất tài liệu Word.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    try {
      const { title, message } = extractProjectDetails(data);
      const paragraphs: Paragraph[] = [];

      // Add a centered, bold Title styled elegantly matching standard themes
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: title,
              bold: true,
              size: 40, // 20pt
              color: '991b1b', // Red-rose accent
              font: 'Calibri',
            }),
          ],
          spacing: {
            after: 400, // 20pt spacing
          },
        })
      );

      // Split message by newline and insert as body paragraphs
      const lines = (message || '').split('\n');
      for (const line of lines) {
        if (line.trim() === '') {
          paragraphs.push(
            new Paragraph({
              text: '',
              spacing: {
                after: 120,
              },
            })
          );
        } else {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 26, // 13pt body font size
                  font: 'Calibri',
                  color: '333333',
                }),
              ],
              spacing: {
                line: 360, // 1.5 line spacing
                after: 200, // Paragraph spacing
              },
            })
          );
        }
      }

      // Add elegant styled footer
      paragraphs.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `\nNoteMe Keepsake • ${new Date().toLocaleDateString('vi-VN')}`,
              size: 18, // 9pt
              italics: true,
              color: '888888',
              font: 'Calibri',
            }),
          ],
          spacing: {
            before: 600,
          },
        })
      );

      // Create a perfectly compliant .docx document structure
      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1417,    // 2.5 cm (in twentieths of a point, dxa)
                  bottom: 1417, // 2.5 cm
                  left: 1417,   // 2.5 cm
                  right: 1134,  // 2.0 cm
                },
              },
            },
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      return { success: true, blob, url: URL.createObjectURL(blob) };
    } catch (error: any) {
      console.error('[DocxExporter] Error generating DOCX:', error);
      return { success: false, error: error?.message || 'Lỗi khi xuất DOCX' };
    }
  }
}

export class HtmlExporter implements Exporter {
  id = 'html' as const;
  name = 'HTML Webpage';
  description = 'Xuất trang HTML tĩnh.';

  async export(data: any, options: ExportOptions): Promise<ExportResult> {
    try {
      const { title, message } = extractProjectDetails(data);
      const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff5f5; color: #1f2937; padding: 40px 20px; display: flex; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: white; max-width: 650px; width: 100%; border-radius: 20px; padding: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); text-align: center; border: 1px solid #ffe4e6; height: fit-content; }
    h1 { color: #9f1239; margin-bottom: 24px; font-size: 28px; font-weight: 800; }
    .message { text-align: left; background: #fff1f2; padding: 24px; border-radius: 12px; border: 1px solid #fecdd3; line-height: 1.8; white-space: pre-wrap; color: #374151; font-size: 15px; }
    .footer { margin-top: 30px; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <div class="message">${message}</div>
    <div class="footer">Xuất từ NoteMe • ${new Date().toLocaleDateString('vi-VN')}</div>
  </div>
</body>
</html>`;
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      return { success: true, blob, url: URL.createObjectURL(blob) };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Lỗi khi xuất HTML' };
    }
  }
}


