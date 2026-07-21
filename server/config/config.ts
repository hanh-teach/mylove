import { logger } from '../services/loggerService';
import { Environment } from './environment';

export interface AppConfig {
  env: string;
  port: number;
  agnesApiBase: string;
  agnesApiKey: string;
  falKey: string;
  runwayApiKey: string;
  huggingApiKey: string;
  geminiApiKey: string;
  cacheTtlSeconds: number;
}

export class ConfigManager {
  private static config: AppConfig;

  /**
   * Initializes and validates environment variables.
   * Logs warnings for missing API keys instead of throwing errors to prevent server crash.
   */
  public static load(): AppConfig {
    if (this.config) {
      return this.config;
    }

    const rawPort = process.env.PORT || '3000';
    const port = parseInt(rawPort, 10) || 3000;

    const agnesApiKey = (process.env.AGNES_API_KEY || process.env.VIDEO_KEY_API || '').trim();
    const agnesApiBase = (process.env.AGNES_API_BASE || 'https://apihub.agnes-ai.com').trim();
    const falKey = (process.env.FAL_KEY || '').trim();
    const runwayApiKey = (process.env.RUNWAY_API_KEY || '').trim();
    const huggingApiKey = (process.env.hugging_API_KEY || process.env.HUGGING_API_KEY || process.env.HUGGINGFACE_API_KEY || '').trim();
    const geminiApiKey = (process.env.GEMINI_API_KEY || '').trim();
    const cacheTtlSeconds = parseInt(process.env.CACHE_TTL_SECONDS || '1800', 10) || 1800;

    this.config = {
      env: Environment.current,
      port,
      agnesApiBase,
      agnesApiKey,
      falKey,
      runwayApiKey,
      huggingApiKey,
      geminiApiKey,
      cacheTtlSeconds
    };

    this.validate(this.config);

    return this.config;
  }

  /**
   * Run detailed self-validation on environment variables
   */
  private static validate(cfg: AppConfig): void {
    logger.info(`[ConfigManager] Loaded Environment Configuration. Active stage: [${cfg.env.toUpperCase()}]`, {
      module: 'ConfigManager',
      env: cfg.env,
      port: cfg.port
    });

    const missingKeys: string[] = [];
    const activeProviders: string[] = [];

    if (cfg.geminiApiKey) {
      activeProviders.push('Gemini (Text & Reasoning)');
    } else {
      missingKeys.push('GEMINI_API_KEY');
    }

    if (cfg.agnesApiKey) {
      activeProviders.push('Agnes AI (Primary Video/Animation)');
    } else {
      missingKeys.push('AGNES_API_KEY');
    }

    if (cfg.falKey) {
      activeProviders.push('Fal / Pika (Alternative Video)');
    } else {
      missingKeys.push('FAL_KEY');
    }

    if (cfg.huggingApiKey) {
      activeProviders.push('Hugging Face (Image Generation)');
    } else {
      missingKeys.push('HUGGING_API_KEY / hugging_API_KEY');
    }

    if (cfg.runwayApiKey) {
      activeProviders.push('Runway (Image-to-Video Animation)');
    } else {
      missingKeys.push('RUNWAY_API_KEY');
    }

    if (activeProviders.length > 0) {
      logger.info(`[ConfigManager] Active integrated AI providers: ${activeProviders.join(', ')}`, {
        module: 'ConfigManager',
        activeProviders
      });
    }

    if (missingKeys.length > 0) {
      logger.warn(
        `[ConfigManager] Missing AI API Keys: [${missingKeys.join(', ')}]. Server remains active but features relying on these missing keys will fall back or throw ValidationError / AIProviderError upon invocation.`,
        {
          module: 'ConfigManager',
          missingKeys,
          isFallbackToPreview: !cfg.agnesApiKey && !cfg.falKey && !cfg.huggingApiKey
        }
      );
    } else {
      logger.info('[ConfigManager] All API Keys successfully validated and configured.', {
        module: 'ConfigManager'
      });
    }
  }
}

export const config = ConfigManager.load();
