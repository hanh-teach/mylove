export interface TypographyPreset {
  id: string;
  name: string;
  fontSize: number; // in pixels
  fontWeight: string;
  lineHeight: number;
}

export const TYPOGRAPHY_REGISTRY: Record<string, TypographyPreset> = {
  title: { id: 'title', name: 'Title', fontSize: 48, fontWeight: '700', lineHeight: 1.2 },
  subtitle: { id: 'subtitle', name: 'Subtitle', fontSize: 32, fontWeight: '600', lineHeight: 1.3 },
  heading: { id: 'heading', name: 'Heading', fontSize: 24, fontWeight: '600', lineHeight: 1.4 },
  body: { id: 'body', name: 'Body', fontSize: 16, fontWeight: '400', lineHeight: 1.6 },
  caption: { id: 'caption', name: 'Caption', fontSize: 12, fontWeight: '400', lineHeight: 1.5 },
  quote: { id: 'quote', name: 'Quote', fontSize: 20, fontWeight: '500', lineHeight: 1.6 },
};

export class TypographyRegistry {
  public static getAll(): TypographyPreset[] {
    return Object.values(TYPOGRAPHY_REGISTRY);
  }
  public static getById(id: string): TypographyPreset {
    return TYPOGRAPHY_REGISTRY[id] || TYPOGRAPHY_REGISTRY.body;
  }
}
