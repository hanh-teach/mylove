import jsPDF from 'jspdf';
import { extractProjectDetails } from './ExportHelper';

export type PrintPaperSize = 'a4' | 'a5' | 'postcard_4x6' | 'card_5x7' | 'bifold_5x7';
export type PrintOrientation = 'portrait' | 'landscape';

export interface PrintRenderOptions {
  paperSize: PrintPaperSize;
  orientation: PrintOrientation;
  includeCropMarks?: boolean;
  includeFoldLine?: boolean;
  includeBleed?: boolean; // 3mm bleed
  cmykSimulate?: boolean;
  dpi?: number; // default 300
  title?: string;
  message?: string;
  senderName?: string;
  receiverName?: string;
  photoUrl?: string;
  poemText?: string;
  categoryLabel?: string;
}

export interface PrintDimensionsPx {
  width: number;
  height: number;
  dpi: number;
  bleedPx: number;
}

export function getPrintDimensionsPx(size: PrintPaperSize, dpi: number = 300, includeBleed: boolean = true): PrintDimensionsPx {
  // 1 inch = 25.4 mm
  const mmToPx = (mm: number) => Math.round((mm / 25.4) * dpi);
  const bleedMm = includeBleed ? 3 : 0; // 3mm bleed standard
  const bleedPx = mmToPx(bleedMm);

  switch (size) {
    case 'a4':
      return {
        width: mmToPx(210 + bleedMm * 2),
        height: mmToPx(297 + bleedMm * 2),
        dpi,
        bleedPx
      };
    case 'a5':
      return {
        width: mmToPx(148 + bleedMm * 2),
        height: mmToPx(210 + bleedMm * 2),
        dpi,
        bleedPx
      };
    case 'postcard_4x6': // 4 x 6 inches (101.6 x 152.4 mm)
      return {
        width: mmToPx(101.6 + bleedMm * 2),
        height: mmToPx(152.4 + bleedMm * 2),
        dpi,
        bleedPx
      };
    case 'card_5x7': // 5 x 7 inches (127 x 177.8 mm)
      return {
        width: mmToPx(127 + bleedMm * 2),
        height: mmToPx(177.8 + bleedMm * 2),
        dpi,
        bleedPx
      };
    case 'bifold_5x7': // 10 x 7 inches unfolded spread (254 x 177.8 mm)
      return {
        width: mmToPx(254 + bleedMm * 2),
        height: mmToPx(177.8 + bleedMm * 2),
        dpi,
        bleedPx
      };
  }
}

export class PrintRendererEngine {
  private static instance: PrintRendererEngine;

  public static getInstance(): PrintRendererEngine {
    if (!this.instance) {
      this.instance = new PrintRendererEngine();
    }
    return this.instance;
  }

  private async loadImage(src: string): Promise<HTMLImageElement | null> {
    if (!src) return null;
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (src.startsWith('data:') || src.startsWith('blob:')) {
          const fallbackImg = new Image();
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => resolve(null);
          fallbackImg.src = src;
        } else {
          resolve(null);
        }
      };
      img.src = src;
    });
  }

  /**
   * Generates a 300 DPI high-resolution canvas ready for high quality printing
   */
  public async renderPrintCanvas(options: PrintRenderOptions): Promise<HTMLCanvasElement> {
    const {
      paperSize = 'card_5x7',
      orientation = 'portrait',
      includeCropMarks = true,
      includeFoldLine = true,
      includeBleed = true,
      dpi = 300,
      title = 'Kỷ Niệm Yêu Thương',
      message = 'Gửi trọn niềm tin và sự trân quý chân thành nhất.',
      senderName = 'Người Gửi',
      receiverName = 'Thân Gửi',
      photoUrl,
      poemText = 'Nắm tay qua vạn nẻo đường,\nTình trao trọn vẹn yêu thương đong đầy.',
      categoryLabel = 'Thiệp Kỷ Niệm'
    } = options;

    let dim = getPrintDimensionsPx(paperSize, dpi, includeBleed);
    if (orientation === 'landscape' && dim.width < dim.height && paperSize !== 'bifold_5x7') {
      const temp = dim.width;
      dim.width = dim.height;
      dim.height = temp;
    }

    const canvas = document.createElement('canvas');
    canvas.width = dim.width;
    canvas.height = dim.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Không thể khởi tạo 2D Canvas cho in ấn 300 DPI');

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, dim.width, dim.height);

    const bleed = dim.bleedPx;
    const printableW = dim.width - bleed * 2;
    const printableH = dim.height - bleed * 2;

    const photoImg = photoUrl ? await this.loadImage(photoUrl) : null;

    if (paperSize === 'bifold_5x7') {
      // Bi-fold 2-page spread: Left is Inside Page, Right is Front Cover
      const halfW = printableW / 2;

      // --- LEFT HALF: INSIDE PAGE ---
      ctx.save();
      ctx.translate(bleed, bleed);

      // Soft cream gradient inside
      const insideGrad = ctx.createLinearGradient(0, 0, halfW, printableH);
      insideGrad.addColorStop(0, '#fffbfb');
      insideGrad.addColorStop(1, '#fff1f2');
      ctx.fillStyle = insideGrad;
      ctx.fillRect(0, 0, halfW, printableH);

      // Inside border
      ctx.strokeStyle = '#fecdd3';
      ctx.lineWidth = Math.round(dpi * 0.01);
      ctx.strokeRect(halfW * 0.08, printableH * 0.06, halfW * 0.84, printableH * 0.88);

      // Poem & Message Box
      ctx.textAlign = 'center';
      ctx.fillStyle = '#be123c';
      ctx.font = `bold ${Math.round(dpi * 0.09)}px "Playfair Display", serif`;
      ctx.fillText(categoryLabel, halfW / 2, printableH * 0.18);

      // Inside Poem
      ctx.font = `italic ${Math.round(dpi * 0.065)}px "Playfair Display", serif`;
      ctx.fillStyle = '#4c0519';
      const poemLines = poemText.split('\n');
      let currentY = printableH * 0.28;
      for (const line of poemLines) {
        ctx.fillText(line, halfW / 2, currentY);
        currentY += Math.round(dpi * 0.09);
      }

      // Message block
      ctx.font = `${Math.round(dpi * 0.058)}px "Lora", serif`;
      ctx.fillStyle = '#374151';
      const msgLines = message.split('\n');
      currentY = printableH * 0.55;
      for (const line of msgLines) {
        ctx.fillText(line, halfW / 2, currentY);
        currentY += Math.round(dpi * 0.08);
      }

      // Sender Sign
      ctx.font = `bold ${Math.round(dpi * 0.065)}px "Playfair Display", serif`;
      ctx.fillStyle = '#e11d48';
      ctx.fillText(`Thân ái, ${senderName}`, halfW / 2, printableH * 0.85);

      ctx.restore();

      // --- RIGHT HALF: FRONT COVER ---
      ctx.save();
      ctx.translate(bleed + halfW, bleed);

      // Front Cover Luxury Rose Gradient
      const frontGrad = ctx.createLinearGradient(0, 0, halfW, printableH);
      frontGrad.addColorStop(0, '#e11d48');
      frontGrad.addColorStop(0.5, '#be123c');
      frontGrad.addColorStop(1, '#881337');
      ctx.fillStyle = frontGrad;
      ctx.fillRect(0, 0, halfW, printableH);

      // Gold Foil Border effect
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = Math.round(dpi * 0.012);
      ctx.strokeRect(halfW * 0.08, printableH * 0.06, halfW * 0.84, printableH * 0.88);

      // Front Photo
      if (photoImg && photoImg.width > 0) {
        const photoW = halfW * 0.72;
        const photoH = printableH * 0.42;
        const photoX = (halfW - photoW) / 2;
        const photoY = printableH * 0.16;

        ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.round(dpi * 0.01);
        ctx.strokeRect(photoX, photoY, photoW, photoH);
      }

      // Front Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(dpi * 0.11)}px "Playfair Display", serif`;
      ctx.fillText(title, halfW / 2, printableH * 0.68);

      // Receiver
      ctx.fillStyle = '#fecdd3';
      ctx.font = `italic ${Math.round(dpi * 0.065)}px "Playfair Display", serif`;
      ctx.fillText(`Dành tặng: ${receiverName}`, halfW / 2, printableH * 0.77);

      ctx.restore();

      // Center Fold Line (Dashed)
      if (includeFoldLine) {
        ctx.save();
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.setLineDash([12, 12]);
        ctx.beginPath();
        ctx.moveTo(bleed + halfW, 0);
        ctx.lineTo(bleed + halfW, dim.height);
        ctx.stroke();
        ctx.restore();
      }

    } else {
      // Standard Single Page (Postcard, A4, A5, Card 5x7)
      ctx.save();
      ctx.translate(bleed, bleed);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, printableW, printableH);
      grad.addColorStop(0, '#fff5f5');
      grad.addColorStop(0.5, '#fee2e2');
      grad.addColorStop(1, '#fed7aa');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, printableW, printableH);

      // Frame Border
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = Math.round(dpi * 0.015);
      ctx.strokeRect(printableW * 0.06, printableH * 0.05, printableW * 0.88, printableH * 0.9);

      // Photo
      if (photoImg && photoImg.width > 0) {
        const photoW = printableW * 0.75;
        const photoH = printableH * 0.45;
        const photoX = (printableW - photoW) / 2;
        const photoY = printableH * 0.12;

        ctx.drawImage(photoImg, photoX, photoY, photoW, photoH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.round(dpi * 0.01);
        ctx.strokeRect(photoX, photoY, photoW, photoH);
      }

      // Title & Message
      ctx.textAlign = 'center';
      ctx.fillStyle = '#9f1239';
      ctx.font = `bold ${Math.round(dpi * 0.12)}px "Playfair Display", serif`;
      ctx.fillText(title, printableW / 2, printableH * 0.65);

      ctx.fillStyle = '#374151';
      ctx.font = `${Math.round(dpi * 0.06)}px "Lora", serif`;
      const msgLines = message.split('\n');
      let currentY = printableH * 0.74;
      for (const line of msgLines) {
        ctx.fillText(line, printableW / 2, currentY);
        currentY += Math.round(dpi * 0.08);
      }

      ctx.fillStyle = '#be123c';
      ctx.font = `italic bold ${Math.round(dpi * 0.06)}px "Playfair Display", serif`;
      ctx.fillText(`Thân tặng: ${receiverName} • Từ: ${senderName}`, printableW / 2, printableH * 0.9);

      ctx.restore();
    }

    // Corner Crop Marks (3mm Bleed guides)
    if (includeCropMarks && includeBleed) {
      ctx.save();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      const markLength = Math.round(dpi * 0.08); // approx 6-8mm mark

      const drawCornerMarks = (x: number, y: number, isLeft: boolean, isTop: boolean) => {
        ctx.beginPath();
        // Horizontal mark
        ctx.moveTo(isLeft ? x - markLength : x + markLength, y);
        ctx.lineTo(x, y);
        // Vertical mark
        ctx.moveTo(x, isTop ? y - markLength : y + markLength);
        ctx.lineTo(x, y);
        ctx.stroke();
      };

      // 4 corners of printable area
      drawCornerMarks(bleed, bleed, true, true);
      drawCornerMarks(dim.width - bleed, bleed, false, true);
      drawCornerMarks(bleed, dim.height - bleed, true, false);
      drawCornerMarks(dim.width - bleed, dim.height - bleed, false, false);

      ctx.restore();
    }

    return canvas;
  }

  /**
   * Generates a 300 DPI PDF document ready for printing
   */
  public async renderPrintPdf(options: PrintRenderOptions): Promise<Blob> {
    const canvas = await this.renderPrintCanvas(options);
    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    const pdf = new jsPDF({
      orientation: options.paperSize === 'bifold_5x7' || options.orientation === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: options.paperSize === 'bifold_5x7' ? [254, 177.8] : options.paperSize === 'card_5x7' ? [127, 177.8] : options.paperSize === 'postcard_4x6' ? [101.6, 152.4] : options.paperSize
    });

    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
    return pdf.output('blob');
  }
}

export const printRendererEngine = PrintRendererEngine.getInstance();
