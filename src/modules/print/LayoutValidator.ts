import { PrintSettings, ValidationResult, ValidationIssue } from './PrintTypes';

export class LayoutValidator {
  public static validate(layers: any[] = [], settings: PrintSettings): ValidationResult {
    const issues: ValidationIssue[] = [];

    // 1. Font Check
    const textLayers = layers.filter(l => l.type === 'text');
    if (textLayers.length > 0) {
      // NOTE: Chưa kiểm tra embed thật, cần bổ sung khi có font manager chuyên biệt.
      const missingFont = textLayers.find(l => !l.metadata?.fontFamily && !l.fontFamily && !l.font);
      if (missingFont) {
        issues.push({
          id: 'font-check',
          status: 'warning',
          message: `Text layer "${missingFont.name || missingFont.id}" chưa chỉ định font-family`,
          type: 'font',
          layerId: missingFont.id
        });
      } else {
        issues.push({
          id: 'font-check',
          status: 'ok',
          message: 'Fonts status OK (chưa kiểm tra embed thật, cần bổ sung khi có font manager)',
          type: 'font'
        });
      }
    }

    // 2. Image Resolution Check (real DPI calculation)
    const imageLayers = layers.filter(l => l.type === 'image' || l.type === 'decor');
    let lowResFound = false;
    for (const imgLayer of imageLayers) {
      const naturalWidth = imgLayer.metadata?.naturalWidth ?? imgLayer.naturalWidth ?? imgLayer.originalWidth ?? imgLayer.imageWidth;
      const displayWidthPx = (imgLayer.width || 100) * (settings?.scale || 1);
      // Assume screen/canvas density is 96 DPI -> displayWidthInInches = displayWidthPx / 96
      const displayWidthInches = displayWidthPx / 96;

      if (!naturalWidth) {
        lowResFound = true;
        issues.push({
          id: `image-res-unknown-${imgLayer.id}`,
          status: 'warning',
          message: `Không thể xác định độ phân giải ảnh này ("${imgLayer.name || imgLayer.id || 'Layer'}") do thiếu thông tin kích thước gốc`,
          type: 'image',
          layerId: imgLayer.id
        });
      } else if (displayWidthInches > 0) {
        const actualDpi = naturalWidth / displayWidthInches;
        if (actualDpi < 150) {
          lowResFound = true;
          issues.push({
            id: `image-res-${imgLayer.id}`,
            status: 'warning',
            message: `Ảnh "${imgLayer.name || imgLayer.id || 'Layer'}" có độ phân giải thấp (${Math.round(actualDpi)} DPI < 150 DPI)`,
            type: 'image',
            layerId: imgLayer.id
          });
        }
      }
    }

    if (imageLayers.length > 0 && !lowResFound) {
      issues.push({
        id: 'image-res-ok',
        status: 'ok',
        message: 'Tất cả hình ảnh đạt độ phân giải in tiêu chuẩn (>= 150 DPI)',
        type: 'image'
      });
    }

    // 3. Bounds & Margin Check (Real paper & margin dimensions calculation)
    let paperWidthMm = 210;
    let paperHeightMm = 297;
    const size = settings?.paper?.size || 'a4';

    if (size === 'a5') {
      paperWidthMm = 148;
      paperHeightMm = 210;
    } else if (size === 'letter') {
      paperWidthMm = 215.9;
      paperHeightMm = 279.4;
    } else if (size === 'legal') {
      paperWidthMm = 215.9;
      paperHeightMm = 355.6;
    } else if (size === 'custom') {
      paperWidthMm = settings?.paper?.widthMm || 210;
      paperHeightMm = settings?.paper?.heightMm || 297;
    }

    if (settings?.paper?.orientation === 'landscape') {
      const temp = paperWidthMm;
      paperWidthMm = paperHeightMm;
      paperHeightMm = temp;
    }

    // Convert paper size mm to canvas px (assuming 96 DPI: 1mm = 3.7795275591 px)
    const mmToPx = 3.7795275591;
    const scale = settings?.scale || 1;
    const paperWidthPx = paperWidthMm * mmToPx * scale;
    const paperHeightPx = paperHeightMm * mmToPx * scale;

    const marginLeftPx = (settings?.margins?.left || 0) * mmToPx * scale;
    const marginRightPx = (settings?.margins?.right || 0) * mmToPx * scale;
    const marginTopPx = (settings?.margins?.top || 0) * mmToPx * scale;
    const marginBottomPx = (settings?.margins?.bottom || 0) * mmToPx * scale;

    const safeLeft = marginLeftPx;
    const safeTop = marginTopPx;
    const safeRight = paperWidthPx - marginRightPx;
    const safeBottom = paperHeightPx - marginBottomPx;

    const overflowLayers: any[] = [];
    for (const l of layers) {
      if (l.visible === false) continue;
      const lx = (l.x || 0) * scale;
      const ly = (l.y || 0) * scale;
      const lw = (l.width || 0) * scale;
      const lh = (l.height || 0) * scale;

      const rightEdge = lx + lw;
      const bottomEdge = ly + lh;

      if (lx < safeLeft || ly < safeTop || rightEdge > safeRight || bottomEdge > safeBottom) {
        overflowLayers.push(l);
      }
    }

    if (overflowLayers.length > 0) {
      issues.push({
        id: 'bounds-check-exceeded',
        status: 'warning',
        message: `${overflowLayers.length} layer (${overflowLayers.map(l => l.name || l.id).join(', ')}) vượt quá vùng lề an toàn in`,
        type: 'overflow'
      });
    } else {
      issues.push({
        id: 'bounds-check-ok',
        status: 'ok',
        message: 'Toàn bộ nội dung nằm trong vùng lề in an toàn',
        type: 'margin'
      });
    }

    const overallStatus = issues.some(i => i.status === 'error') ? 'error' :
                          issues.some(i => i.status === 'warning') ? 'warning' : 'ok';

    return {
      status: overallStatus,
      issues
    };
  }
}
