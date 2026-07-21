export type AssetType = 'image' | 'video' | 'sticker' | 'font' | 'music' | 'voice' | 'animation' | 'background';

export interface AssetMetadata {
  duration?: number; // for audio/video
  mimeType?: string;
  fontFamily?: string;
  [key: string]: any;
}

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  size: number;
  width?: number;
  height?: number;
  provider: 'local' | 'system' | 'external';
  hash: string;
  metadata: AssetMetadata;
  createdAt: number;
  usedBy: string[]; // List of Layer/Scene IDs using this asset
}
