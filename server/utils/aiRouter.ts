import { AIProvider } from '../providers/aiProviderInterface';
import { huggingFaceProvider } from '../providers/huggingFaceProvider';
import { runwayProvider } from '../providers/runwayProvider';
import { falProvider } from '../providers/falProvider';
import { agnesAIProvider } from '../providers/agnesAIProvider';
import { geminiProvider } from '../providers/geminiProvider';
import { config } from '../config/config';

export class AIRouter {
  /**
   * Determine which provider should be used for video/animation generation.
   */
  public routeVideo(): { provider: AIProvider; apiKey: string; isFallbackToPreview: boolean } {
    const huggingKey = config.huggingApiKey;
    if (huggingKey) {
      return { provider: huggingFaceProvider, apiKey: huggingKey, isFallbackToPreview: false };
    }

    const falKey = config.falKey;
    if (falKey) {
      return { provider: falProvider, apiKey: falKey, isFallbackToPreview: false };
    }

    const agnesKey = config.agnesApiKey;
    if (agnesKey) {
      return { provider: agnesAIProvider, apiKey: agnesKey, isFallbackToPreview: false };
    }

    // Default or Fallback to Agnes AI provider in preview mode
    return { provider: agnesAIProvider, apiKey: '', isFallbackToPreview: true };
  }

  /**
   * Determine the animator provider if video routing is using HuggingFace.
   */
  public routeAnimator(): { provider: AIProvider; apiKey: string } | null {
    const runwayKey = config.runwayApiKey;
    if (runwayKey) {
      return { provider: runwayProvider, apiKey: runwayKey };
    }
    return null;
  }

  /**
   * Determine which provider should be used for text or reasoning tasks.
   */
  public routeText(): { provider: AIProvider; apiKey: string } {
    const geminiKey = config.geminiApiKey;
    if (geminiKey) {
      return { provider: geminiProvider, apiKey: geminiKey };
    }
    // Fallback to Agnes AI if no Gemini key
    const agnesKey = config.agnesApiKey;
    return { provider: agnesAIProvider, apiKey: agnesKey };
  }
}

export const aiRouter = new AIRouter();
