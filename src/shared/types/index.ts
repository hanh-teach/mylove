export type SceneType = 'rose' | 'garden' | 'forest' | 'sunset' | 'ocean' | 'sakura' | 'sky' | 'plain';
export type BgStyleType = 'solid' | 'floating' | 'hearts' | 'grid' | 'blobs';
export type FontStyleType = 'playfair' | 'dancing' | 'pacifico' | 'caveat' | 'lora' | 'nunito' | 'lobster' | 'merriweather';
export type DecorType = 'Heart' | 'Star' | 'Smile' | 'Gift' | 'Sparkles' | 'Cake' | 'Users' | 'Flower2' | 'Couple' | 'Bouquet' | 'Balloon' | 'Letter' | 'Birds';

export interface FontRegistryItem {
  label: string;
  class: string;
  name: string;
  sample: string;
}


export interface PlacedItem {
  id: number;
  type: DecorType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color?: string;
  animation?: "none" | "float" | "pulse" | "spin";
  locked?: boolean;
}

export interface HeartItem {
  id: number;
  x: number;
  y: number;
}
