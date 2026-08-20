export type PaperSize = 'a4' | 'a5' | 'letter' | 'legal' | 'custom';
export type Orientation = 'portrait' | 'landscape';
export type MarginSize = 'none' | 'narrow' | 'normal' | 'wide' | 'custom';

export interface PaperConfig {
  size: PaperSize;
  orientation: Orientation;
  widthMm?: number;
  heightMm?: number;
}

export interface MarginConfig {
  type: MarginSize;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface PrintProfile {
  id: string;
  name: string;
  paper: PaperConfig;
  margins: MarginConfig;
  showBleed: boolean;
  duplex: boolean;
  borderless: boolean;
}

export interface PrintSettings {
  profileId?: string;
  paper: PaperConfig;
  margins: MarginConfig;
  header: boolean;
  footer: boolean;
  pageNumbers: boolean;
  watermark: string;
  showBleed: boolean;
  duplex: boolean;
  scale: number;
}

export type ValidationStatus = 'ok' | 'warning' | 'error';

export interface ValidationIssue {
  id: string;
  status: ValidationStatus;
  message: string;
  type: 'font' | 'image' | 'margin' | 'overflow' | 'bleed';
  layerId?: string;
}

export interface ValidationResult {
  status: ValidationStatus;
  issues: ValidationIssue[];
}
