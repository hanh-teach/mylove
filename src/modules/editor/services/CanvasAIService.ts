export interface CanvasAISuggestionParams {
  prompt?: string;
  action?: string;
  tone?: string;
}

export class CanvasAIService {
  static async generateSuggestion(params: CanvasAISuggestionParams): Promise<{ suggestion: string; isSimulated?: boolean }> {
    try {
      const response = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: params.action || 'rewrite',
          text: params.prompt || 'Chúc người thương',
          tone: params.tone || 'romantic',
        }),
      });

      const data = await response.json();
      if (data && data.success && data.result) {
        return {
          suggestion: data.result,
          isSimulated: !!data.isSimulated,
        };
      }

      return {
        suggestion: 'Chúc cho tình cảm của tụi mình mãi nồng nàn và bền chặt như thuở ban đầu! 💕',
        isSimulated: true,
      };
    } catch (err) {
      return {
        suggestion: 'Chúc cho tình cảm của tụi mình mãi nồng nàn và bền chặt như thuở ban đầu! 💕',
        isSimulated: true,
      };
    }
  }
}
