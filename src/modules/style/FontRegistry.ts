export interface FontStyle {
  id: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'handwriting' | 'modern' | 'elegant' | 'classic' | 'school' | 'professional';
  cssName: string;
}

export const FONT_REGISTRY: Record<string, FontStyle> = {
  inter: { id: 'inter', name: 'Inter', category: 'sans-serif', cssName: 'Inter' },
  notoSans: { id: 'notoSans', name: 'Noto Sans', category: 'sans-serif', cssName: 'Noto Sans' },
  roboto: { id: 'roboto', name: 'Roboto', category: 'modern', cssName: 'Roboto' },
  merriweather: { id: 'merriweather', name: 'Merriweather', category: 'serif', cssName: 'Merriweather' },
  playfair: { id: 'playfair', name: 'Playfair Display', category: 'elegant', cssName: 'Playfair Display' },
  lora: { id: 'lora', name: 'Lora', category: 'classic', cssName: 'Lora' },
  dancing: { id: 'dancing', name: 'Dancing Script', category: 'handwriting', cssName: 'Dancing Script' },
  pacifico: { id: 'pacifico', name: 'Pacifico', category: 'handwriting', cssName: 'Pacifico' },
  caveat: { id: 'caveat', name: 'Caveat', category: 'handwriting', cssName: 'Caveat' },
  nunito: { id: 'nunito', name: 'Nunito', category: 'professional', cssName: 'Nunito' }
};

export class FontRegistry {
  public static getAll(): FontStyle[] {
    return Object.values(FONT_REGISTRY);
  }
  public static getById(id: string): FontStyle {
    return FONT_REGISTRY[id] || FONT_REGISTRY.playfair;
  }
}
