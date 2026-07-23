export type ExportFormat = 'pdf' | 'docx' | 'png' | 'jpg' | 'html' | 'json';
export type ExportQuality = 'draft' | 'standard' | 'high' | 'print';
export type PageSize = 'a4' | 'a5' | 'letter';
export type PageOrientation = 'portrait' | 'landscape';

export interface ExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  pageSize?: PageSize;
  orientation?: PageOrientation;
  margins?: boolean;
  filename: string;
  includeImages: boolean;
  includeTimeline: boolean;
  includeMetadata: boolean;
  includeVersionInfo: boolean;
  includeWatermark: boolean;
  includeComments: boolean;
  watermarkText: string;
}

export interface ExportResult {
  url?: string;
  blob?: Blob;
  error?: string;
  success: boolean;
}

export interface Exporter {
  id: ExportFormat;
  name: string;
  description: string;
  export(data: any, options: ExportOptions): Promise<ExportResult>;
}

export interface ExportTask {
  id: string;
  projectId: string;
  filename: string;
  format: ExportFormat;
  status: 'waiting' | 'running' | 'completed' | 'failed';
  progress: number;
  options: ExportOptions;
  result?: ExportResult;
  createdAt: number;
  completedAt?: number;
}

export interface ExportHistoryRecord {
  id: string;
  taskId: string;
  projectId: string;
  filename: string;
  format: ExportFormat;
  options: ExportOptions;
  timestamp: number;
  url?: string;
}
