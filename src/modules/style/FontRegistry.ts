export interface FontStyle {
  id: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'handwriting' | 'modern' | 'elegant' | 'classic' | 'school' | 'professional';
  cssName: string;
  fontClass: string;
  sample: string;
}

export const FONT_REGISTRY: Record<string, FontStyle> = {
  playfair: { id: 'playfair', name: 'Playfair Display', category: 'elegant', cssName: 'Playfair Display', fontClass: 'font-playfair', sample: 'Love Note 2026' },
  lobster: { id: 'lobster', name: 'Lobster', category: 'handwriting', cssName: 'Lobster', fontClass: 'font-lobster', sample: 'Chúc Mừng Hạnh Phúc' },
  merriweather: { id: 'merriweather', name: 'Merriweather', category: 'serif', cssName: 'Merriweather', fontClass: 'font-merriweather', sample: 'Kỷ niệm khó phai' },
  dancing: { id: 'dancing', name: 'Dancing Script', category: 'handwriting', cssName: 'Dancing Script', fontClass: 'font-dancing', sample: 'Forever & Always' },
  pacifico: { id: 'pacifico', name: 'Pacifico', category: 'handwriting', cssName: 'Pacifico', fontClass: 'font-pacifico', sample: 'Mãi bên nhau nhé' },
  caveat: { id: 'caveat', name: 'Caveat', category: 'handwriting', cssName: 'Caveat', fontClass: 'font-caveat', sample: 'Gửi người tôi yêu...' },
  lora: { id: 'lora', name: 'Lora', category: 'classic', cssName: 'Lora', fontClass: 'font-lora', sample: 'Những ngày êm đềm' },
  nunito: { id: 'nunito', name: 'Nunito', category: 'professional', cssName: 'Nunito', fontClass: 'font-nunito', sample: '21 Tháng 7, 2026' },
  inter: { id: 'inter', name: 'Inter', category: 'sans-serif', cssName: 'Inter', fontClass: 'font-sans', sample: 'Modern & Clean' },
  notoSans: { id: 'notoSans', name: 'Noto Sans', category: 'sans-serif', cssName: 'Noto Sans', fontClass: 'font-sans', sample: 'Tiếng Việt chuẩn' },
  roboto: { id: 'roboto', name: 'Roboto', category: 'modern', cssName: 'Roboto', fontClass: 'font-sans', sample: 'Thanh lịch đơn giản' }
};

export class FontRegistry {
  public static getAll(): FontStyle[] {
    return Object.values(FONT_REGISTRY);
  }
  public static getById(id: string): FontStyle {
    return FONT_REGISTRY[id] || FONT_REGISTRY.playfair;
  }
}
