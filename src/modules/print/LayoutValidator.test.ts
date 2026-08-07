import { describe, it, expect } from 'vitest';
import { LayoutValidator } from './LayoutValidator';
import { PrintSettings } from './PrintTypes';

describe('LayoutValidator', () => {
  const defaultSettings: PrintSettings = {
    paper: { size: 'a4', orientation: 'portrait' },
    scale: 1,
    margins: { type: 'normal', top: 10, bottom: 10, left: 10, right: 10 },
    header: false,
    footer: false,
    pageNumbers: true,
    watermark: '',
    showBleed: false,
    duplex: false
  };

  it('should issue a low DPI warning when metadata.naturalWidth is low relative to display size', () => {
    const lowResImageLayer = {
      id: 'layer_img_low_dpi',
      type: 'image',
      name: 'Ảnh Thấp DPI',
      width: 800, // 800px width at 96 DPI screen resolution = 8.33 inches
      height: 600,
      visible: true,
      x: 20,
      y: 20,
      metadata: {
        naturalWidth: 300, // 300 / 8.33 = ~36 DPI (< 150 DPI threshold)
        naturalHeight: 225
      }
    };

    const result = LayoutValidator.validate([lowResImageLayer], defaultSettings);

    expect(result.status).toBe('warning');
    const imageIssue = result.issues.find(i => i.layerId === 'layer_img_low_dpi');
    expect(imageIssue).toBeDefined();
    expect(imageIssue?.status).toBe('warning');
    expect(imageIssue?.message).toContain('độ phân giải thấp');
    expect(imageIssue?.message).toContain('36 DPI');
  });

  it('should pass font check with status ok when metadata.fontFamily is set', () => {
    const textLayerWithFontInMetadata = {
      id: 'layer_text_valid',
      type: 'text',
      name: 'Tiêu đề đẹp',
      width: 300,
      height: 50,
      visible: true,
      x: 20,
      y: 20,
      metadata: {
        fontFamily: 'Playfair Display',
        text: 'Chúc mừng ngày 20-11'
      }
    };

    const result = LayoutValidator.validate([textLayerWithFontInMetadata], defaultSettings);

    const fontIssue = result.issues.find(i => i.type === 'font');
    expect(fontIssue).toBeDefined();
    expect(fontIssue?.status).toBe('ok');
    expect(fontIssue?.message).not.toContain('chưa chỉ định font-family');
  });

  it('should issue warning if text layer lacks metadata.fontFamily and top-level fontFamily', () => {
    const textLayerMissingFont = {
      id: 'layer_text_missing_font',
      type: 'text',
      name: 'Văn bản thiếu font',
      width: 300,
      height: 50,
      visible: true,
      x: 20,
      y: 20,
      metadata: {
        text: 'Nội dung không có font'
      }
    };

    const result = LayoutValidator.validate([textLayerMissingFont], defaultSettings);

    const fontIssue = result.issues.find(i => i.type === 'font');
    expect(fontIssue).toBeDefined();
    expect(fontIssue?.status).toBe('warning');
    expect(fontIssue?.message).toContain('chưa chỉ định font-family');
  });

  it('should issue a warning when an image layer lacks naturalWidth in metadata and top-level', () => {
    const legacyImageLayer = {
      id: 'layer_img_legacy',
      type: 'image',
      name: 'Ảnh Cũ Không Có NaturalWidth',
      width: 300,
      height: 200,
      visible: true,
      x: 20,
      y: 20,
      metadata: {
        imageUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e'
      }
    };

    const result = LayoutValidator.validate([legacyImageLayer], defaultSettings);

    expect(result.status).toBe('warning');
    const imageIssue = result.issues.find(i => i.layerId === 'layer_img_legacy');
    expect(imageIssue).toBeDefined();
    expect(imageIssue?.status).toBe('warning');
    expect(imageIssue?.message).toContain('Không thể xác định độ phân giải ảnh này');
  });
});
