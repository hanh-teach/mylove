export interface ThemeConfig {
  id: string;
  name: string;
  fontStyle: 'playfair' | 'dancing' | 'pacifico' | 'caveat' | 'lora' | 'nunito';
  scene: 'rose' | 'garden' | 'forest' | 'sunset' | 'ocean' | 'sakura' | 'sky' | 'plain';
  bgStyle: 'solid' | 'floating' | 'hearts' | 'grid' | 'blobs';
  textColor: string; // e.g. '#0f172a' (Slate 900)
  accentColor: string; // e.g. '#e11d48' (Rose 600)
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'double' | 'none';
  borderWidth: number;
  borderRadius: number;
  spacing: 'tight' | 'normal' | 'loose';
  headerText?: string;
  footerText?: string;
}

export const THEME_REGISTRY: Record<string, ThemeConfig> = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    fontStyle: 'nunito',
    scene: 'plain',
    bgStyle: 'solid',
    textColor: '#1e293b', // slate 800
    accentColor: '#475569', // slate 600
    borderColor: '#cbd5e1', // slate 300
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    spacing: 'tight',
    headerText: '— CREATIVE WORK —',
    footerText: 'Powered by Canvas Minimal'
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    fontStyle: 'lora',
    scene: 'sunset',
    bgStyle: 'grid',
    textColor: '#451a03', // warm brown
    accentColor: '#b45309', // amber 700
    borderColor: '#d97706', // amber 600
    borderStyle: 'double',
    borderWidth: 4,
    borderRadius: 0,
    spacing: 'normal',
    headerText: '✥ HISTORICAL RECORD ✥',
    footerText: 'Established MMXXVI'
  },
  elegant: {
    id: 'elegant',
    name: 'Elegant',
    fontStyle: 'playfair',
    scene: 'rose',
    bgStyle: 'floating',
    textColor: '#4c0519', // rose 950
    accentColor: '#be123c', // rose 700
    borderColor: '#f43f5e',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 16,
    spacing: 'loose',
    headerText: '✿ CELEBRATION NOTE ✿',
    footerText: 'With all appreciation and sincerity'
  },
  nature: {
    id: 'nature',
    name: 'Nature',
    fontStyle: 'caveat',
    scene: 'garden',
    bgStyle: 'blobs',
    textColor: '#064e3b', // emerald 950
    accentColor: '#059669', // emerald 600
    borderColor: '#10b981',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 24,
    spacing: 'normal',
    headerText: '🍃 CHRONICLE OF NATURE 🍃',
    footerText: 'Earth & Greenery'
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    fontStyle: 'nunito',
    scene: 'sky',
    bgStyle: 'grid',
    textColor: '#0f172a', // slate 900
    accentColor: '#2563eb', // blue 600
    borderColor: '#3b82f6',
    borderStyle: 'solid',
    borderWidth: 3,
    borderRadius: 12,
    spacing: 'tight',
    headerText: '⚡ NEXT-GEN CANVAS // 01',
    footerText: 'Version 2.0 // Active'
  },
  cute: {
    id: 'cute',
    name: 'Cute',
    fontStyle: 'pacifico',
    scene: 'sakura',
    bgStyle: 'hearts',
    textColor: '#831843', // pink 950
    accentColor: '#db2777', // pink 600
    borderColor: '#f472b6',
    borderStyle: 'dashed',
    borderWidth: 3,
    borderRadius: 20,
    spacing: 'loose',
    headerText: '⭐ DỄ THƯƠNG QUÁ CHỜI ⭐',
    footerText: 'Made with love and candy 🍬'
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    fontStyle: 'nunito',
    scene: 'plain',
    bgStyle: 'solid',
    textColor: '#0f172a', // dark blue slate
    accentColor: '#1e3a8a', // blue 900
    borderColor: '#475569',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    spacing: 'tight',
    headerText: 'CONFIDENTIAL WORKSPACE',
    footerText: 'Copyright © 2026. All rights reserved.'
  },
  academic: {
    id: 'academic',
    name: 'Academic',
    fontStyle: 'lora',
    scene: 'ocean',
    bgStyle: 'grid',
    textColor: '#1e1b4b', // deep indigo
    accentColor: '#4338ca', // indigo 700
    borderColor: '#818cf8',
    borderStyle: 'solid',
    borderWidth: 4,
    borderRadius: 2,
    spacing: 'normal',
    headerText: '📜 ACADEMIC ACHIEVEMENT 📜',
    footerText: 'Board of Education & Excellence'
  }
};

export class ThemeRegistry {
  public static getAll(): ThemeConfig[] {
    return Object.values(THEME_REGISTRY);
  }

  public static getById(id: string): ThemeConfig {
    return THEME_REGISTRY[id] || THEME_REGISTRY.elegant;
  }
}
