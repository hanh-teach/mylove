export interface BackgroundPreset {
  id: string;
  name: string;
  category: 'Solid' | 'Gradient' | 'Paper' | 'Fabric' | 'Watercolor' | 'Nature' | 'Abstract';
  value: string; // CSS background value or specific key
}

export const BACKGROUND_REGISTRY: Record<string, BackgroundPreset> = {
  solidWhite: { id: 'solidWhite', name: 'White', category: 'Solid', value: '#ffffff' },
  solidRose: { id: 'solidRose', name: 'Rose', category: 'Solid', value: '#fff1f2' },
  gradientSunset: { id: 'gradientSunset', name: 'Sunset', category: 'Gradient', value: 'linear-gradient(to right, #fdfbfb, #ebedee)' },
  paperVintage: { id: 'paperVintage', name: 'Vintage Paper', category: 'Paper', value: 'url("https://www.transparenttextures.com/patterns/old-wall.png")' },
  fabricLinen: { id: 'fabricLinen', name: 'Linen', category: 'Fabric', value: 'url("https://www.transparenttextures.com/patterns/linen.png")' },
  watercolorPink: { id: 'watercolorPink', name: 'Pink Watercolor', category: 'Watercolor', value: 'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)' },
  natureLeaves: { id: 'natureLeaves', name: 'Autumn Leaves', category: 'Nature', value: 'url("https://www.transparenttextures.com/patterns/leaves.png")' },
  abstractGrid: { id: 'abstractGrid', name: 'Grid', category: 'Abstract', value: 'url("https://www.transparenttextures.com/patterns/cubes.png")' },
};

export class BackgroundRegistry {
  public static getAll(): BackgroundPreset[] {
    return Object.values(BACKGROUND_REGISTRY);
  }
  public static getById(id: string): BackgroundPreset {
    return BACKGROUND_REGISTRY[id] || BACKGROUND_REGISTRY.solidWhite;
  }
}
