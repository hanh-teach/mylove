import { PrintSettings, ValidationResult, ValidationIssue } from './PrintTypes';

export class LayoutValidator {
  public static validate(layers: any[], settings: PrintSettings): ValidationResult {
    const issues: ValidationIssue[] = [];

    // Basic mock validation
    const hasFonts = layers.some(l => l.type === 'text');
    if (hasFonts) {
      issues.push({
        id: 'font-check',
        status: 'ok',
        message: 'Fonts Embedded OK',
        type: 'font'
      });
    }

    const hasImages = layers.some(l => l.type === 'image' || l.type === 'decor');
    if (hasImages) {
      // Simulate checking image resolution
      issues.push({
        id: 'image-res',
        status: 'ok', // we could simulate 'warning' for low res
        message: 'Images Resolution OK',
        type: 'image'
      });
    }

    // Check bounds (mock logic)
    const boundsExceeded = layers.some(l => {
      // simulate check if layer x/y exceeds paper width/height based on scaling
      return false; 
    });

    if (boundsExceeded) {
      issues.push({
        id: 'bounds-check',
        status: 'warning',
        message: 'Some layers might exceed printable area',
        type: 'overflow'
      });
    } else {
      issues.push({
        id: 'bounds-check',
        status: 'ok',
        message: 'Margins & Safe Area OK',
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
