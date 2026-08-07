export type LayerType = 'image' | 'text' | 'shape' | 'group' | 'decor' | 'background';

export interface ILayer {
  id: string;
  type: LayerType | string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  rotation: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  parentId: string | null;
  children: ILayer[];
  
  // Custom metadata to support additional user properties without breaking current functions
  metadata?: Record<string, any>;
}

export interface LayerOperationResult {
  success: boolean;
  error?: string;
  affectedLayerId?: string;
}
