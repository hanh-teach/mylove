export function extractUrl(text: string): string | null {
  if (typeof text !== 'string') return null;
  const match = text.match(/https?:\/\/[^\s"']+/);
  return match ? match[0] : null;
}

export function getVisualPrompt(scene: string, placedItems: any[]): string {
  const decorTypes = placedItems?.map((p: any) => p.type).join(', ') || 'hearts';
  let themeDescription = '';
  switch (scene) {
    case 'rose':
      themeDescription = 'A beautiful romantic scenic background filled with red roses and warm ambient glowing lights, love theme, cinematic';
      break;
    case 'garden':
      themeDescription = 'A beautiful lush green romantic garden background filled with blooming colorful flowers and soft morning sunlight';
      break;
    case 'forest':
      themeDescription = 'A beautiful magical enchanted romantic forest background with glowing particles and emerald trees under moonlight';
      break;
    case 'sunset':
      themeDescription = 'A breathtaking romantic sunset background over hills with warm golden orange skies and flying paper hearts';
      break;
    case 'ocean':
      themeDescription = 'A serene beautiful romantic ocean background with a sandy beach at sunset, soft waves, clear blue skies';
      break;
    case 'sakura':
      themeDescription = 'A dreamlike romantic Japanese garden background with blooming pink cherry blossom trees and falling sakura petals';
      break;
    case 'sky':
      themeDescription = 'A magical whimsical romantic sky background with pastel clouds, stars, and soft warm lighting';
      break;
    default:
      themeDescription = 'A minimalist, elegant aesthetic pastel gradient background for a love note';
  }
  return `${themeDescription}. Decorated with beautifully arranged elements: ${decorTypes}. Heartwarming, cozy atmosphere, high quality, 4k, masterpiece, no text, no words, textless, clean background.`;
}
