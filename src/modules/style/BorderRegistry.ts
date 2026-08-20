export interface BorderStylePreset {
  id: string;
  name: string;
  category: 'Rounded' | 'Square' | 'Classic' | 'Soft' | 'Outline' | 'Shadow';
  borderWidth: number;
  borderStyle: 'solid' | 'dashed' | 'double' | 'none';
  borderRadius: number;
  boxShadow: string;
}

export const BORDER_REGISTRY: Record<string, BorderStylePreset> = {
  roundedSoft: {
    id: 'roundedSoft', name: 'Soft Rounded', category: 'Soft',
    borderWidth: 1, borderStyle: 'solid', borderRadius: 16,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  },
  squareOutline: {
    id: 'squareOutline', name: 'Square Outline', category: 'Square',
    borderWidth: 2, borderStyle: 'solid', borderRadius: 0,
    boxShadow: 'none'
  },
  classicDouble: {
    id: 'classicDouble', name: 'Classic Double', category: 'Classic',
    borderWidth: 4, borderStyle: 'double', borderRadius: 8,
    boxShadow: 'none'
  },
  noneShadow: {
    id: 'noneShadow', name: 'Float Shadow', category: 'Shadow',
    borderWidth: 0, borderStyle: 'none', borderRadius: 24,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
  },
  dashedBorder: {
    id: 'dashedBorder', name: 'Dashed', category: 'Outline',
    borderWidth: 2, borderStyle: 'dashed', borderRadius: 12,
    boxShadow: 'none'
  }
};

export class BorderRegistry {
  public static getAll(): BorderStylePreset[] {
    return Object.values(BORDER_REGISTRY);
  }
  public static getById(id: string): BorderStylePreset {
    return BORDER_REGISTRY[id] || BORDER_REGISTRY.roundedSoft;
  }
}
