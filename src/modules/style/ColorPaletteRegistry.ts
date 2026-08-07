export interface ColorPalette {
  id: string;
  name: string;
  category: 'Brand' | 'Blue' | 'Purple' | 'Green' | 'Orange' | 'Neutral' | 'Pastel' | 'Monochrome';
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
    background: string;
  };
}

export const COLOR_PALETTE_REGISTRY: Record<string, ColorPalette> = {
  brandDefault: {
    id: 'brandDefault',
    name: 'Love Note Brand',
    category: 'Brand',
    colors: {
      primary: '#e11d48',
      secondary: '#fda4af',
      text: '#4c0519',
      accent: '#f43f5e',
      background: '#fff1f2'
    }
  },
  blueOcean: {
    id: 'blueOcean',
    name: 'Blue Ocean',
    category: 'Blue',
    colors: {
      primary: '#2563eb',
      secondary: '#93c5fd',
      text: '#1e3a8a',
      accent: '#3b82f6',
      background: '#eff6ff'
    }
  },
  purpleDream: {
    id: 'purpleDream',
    name: 'Purple Dream',
    category: 'Purple',
    colors: {
      primary: '#7c3aed',
      secondary: '#c4b5fd',
      text: '#4c1d95',
      accent: '#8b5cf6',
      background: '#f5f3ff'
    }
  },
  natureGreen: {
    id: 'natureGreen',
    name: 'Nature Green',
    category: 'Green',
    colors: {
      primary: '#059669',
      secondary: '#6ee7b7',
      text: '#064e3b',
      accent: '#10b981',
      background: '#ecfdf5'
    }
  },
  sunsetOrange: {
    id: 'sunsetOrange',
    name: 'Sunset Orange',
    category: 'Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#fdba74',
      text: '#7c2d12',
      accent: '#f97316',
      background: '#fff7ed'
    }
  },
  minimalNeutral: {
    id: 'minimalNeutral',
    name: 'Minimal Neutral',
    category: 'Neutral',
    colors: {
      primary: '#475569',
      secondary: '#cbd5e1',
      text: '#0f172a',
      accent: '#64748b',
      background: '#f8fafc'
    }
  }
};

export class ColorPaletteRegistry {
  public static getAll(): ColorPalette[] {
    return Object.values(COLOR_PALETTE_REGISTRY);
  }
  public static getById(id: string): ColorPalette {
    return COLOR_PALETTE_REGISTRY[id] || COLOR_PALETTE_REGISTRY.brandDefault;
  }
}
