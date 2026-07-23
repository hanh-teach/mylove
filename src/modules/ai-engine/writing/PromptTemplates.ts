import { WritingActionType, ToneType } from './WritingRequest';

export class PromptTemplates {
  static getPrompt(action: WritingActionType, text: string, tone: ToneType = 'romantic', language = 'Vietnamese'): string {
    const toneDesc = {
      romantic: 'ấm áp, truyền cảm hứng, chân thành',
      cute: 'đáng yêu, dễ thương, tinh nghịch',
      formal: 'trang trọng, chân thành, lịch sự',
      funny: 'vui vẻ, hài hước, dí dỏm',
      emotional: 'xúc động, chân thật, sâu lắng',
    }[tone];

    switch (action) {
      case 'improve':
        return `Improve the following text for a creative piece. Maintain the core meaning, enhance readability, and use a ${toneDesc} tone. Output ONLY the improved text in ${language}, with no extra explanations or pleasantries.\n\nText: "${text}"`;
      case 'rewrite':
        return `Rewrite the following text with an engaging ${toneDesc} tone suitable for a creative article or letter. Output ONLY the rewritten text in ${language}.\n\nText: "${text}"`;
      case 'shorten':
        return `Condense and shorten the following text while preserving its core essence and ${toneDesc} tone. Output ONLY the shortened text in ${language}.\n\nText: "${text}"`;
      case 'expand':
        return `Expand and elaborate on the following text with expressive language and a ${toneDesc} tone. Output ONLY the expanded text in ${language}.\n\nText: "${text}"`;
      case 'grammar':
        return `Fix any spelling, punctuation, and grammatical errors in the following text while keeping its natural ${toneDesc} voice. Output ONLY the corrected text in ${language}.\n\nText: "${text}"`;
      case 'translate':
        return `Translate the following text accurately and fluidly into ${language === 'Vietnamese' ? 'English' : 'Vietnamese'}, keeping a ${toneDesc} tone. Output ONLY the translated text.\n\nText: "${text}"`;
      default:
        return `Improve this text: "${text}"`;
    }
  }
}
