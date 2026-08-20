import { aiRouter } from '../utils/aiRouter';
import { promptBuilder } from '../utils/promptBuilder';
import { GenerateVideoResult } from '../services/videoService';
import { logger } from './loggerService';
import { config } from '../config/config';
import { cacheService } from './cacheService';

function getStaticPreviewImage(title: string, message: string, scene: string, placedItems: any[]): string {
  // 1. If user placed an item that has an image URL/data URL, prefer that user image
  const userItemImage = placedItems?.find((item: any) => 
    item.url || item.imageUrl || item.src || (typeof item.content === 'string' && (item.content.startsWith('http') || item.content.startsWith('data:')))
  );
  if (userItemImage) {
    return userItemImage.url || userItemImage.imageUrl || userItemImage.src || userItemImage.content;
  }

  // 2. Otherwise generate a static SVG card poster image based directly on user's title, message, scene, and placed items
  const safeTitle = (title || 'Thiệp Tình Yêu').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeMsg = (message || 'Gửi trao thương nhớ').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const safeScene = (scene || 'Lãng mạn').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let bg1 = '#fff1f2', bg2 = '#ffe4e6', bg3 = '#fecdd3';
  let textColor = '#9f1239', accentColor = '#e11d48';

  if (scene === 'garden' || scene === 'forest') {
    bg1 = '#ecfdf5'; bg2 = '#d1fae5'; bg3 = '#a7f3d0';
    textColor = '#065f46'; accentColor = '#059669';
  } else if (scene === 'ocean' || scene === 'sky') {
    bg1 = '#f0f9ff'; bg2 = '#e0f2fe'; bg3 = '#bae6fd';
    textColor = '#075985'; accentColor = '#0284c7';
  } else if (scene === 'sunset') {
    bg1 = '#fff7ed'; bg2 = '#ffedd5'; bg3 = '#fed7aa';
    textColor = '#9a3412'; accentColor = '#ea580c';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}"/>
        <stop offset="50%" stop-color="${bg2}"/>
        <stop offset="100%" stop-color="${bg3}"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#cardBg)"/>
    <circle cx="640" cy="360" r="280" fill="#ffffff" opacity="0.35"/>
    <rect x="140" y="100" width="1000" height="520" rx="32" fill="#ffffff" opacity="0.8" stroke="${accentColor}" stroke-width="3" stroke-dasharray="10 10"/>
    <text x="640" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="bold" fill="${textColor}" text-anchor="middle">${safeTitle}</text>
    <text x="640" y="340" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="500" fill="${textColor}" text-anchor="middle" opacity="0.9">${safeMsg}</text>
    <text x="640" y="450" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="${accentColor}" text-anchor="middle">🌸 Chủ đề: ${safeScene} | 🎨 ${placedItems?.length || 0} vật phẩm trang trí</text>
    <text x="640" y="530" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">[Bản xem trước tĩnh từ nội dung thiệp của bạn]</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export class AIEngine {
  /**
   * High-level orchestrator for romantic video generation.
   */
  public async generateVideo(
    payload: {
      title: string;
      message: string;
      scene: string;
      bgStyle: string;
      musicTrack: any;
      placedItems: any[];
    },
    metadata?: { traceId?: string; user?: string }
  ): Promise<GenerateVideoResult> {
    const traceId = metadata?.traceId || 'N/A';
    const user = metadata?.user || 'anonymous';
    const api = 'POST /api/video/generate';
    const module = 'AIEngine';

    const { title, message, scene, bgStyle, musicTrack, placedItems } = payload;
    const startTime = Date.now();

    // Deterministic payload cache key
    const payloadCacheKey = JSON.stringify({
      title,
      message,
      scene,
      bgStyle,
      musicTrack: musicTrack?.url || musicTrack?.label || '',
      placedItems: (placedItems || []).map((item: any) => ({
        id: item.id || item.label || '',
        x: item.x,
        y: item.y
      }))
    });

    // 1. AI Response Cache - check if identical request was already generated
    const cachedResponse = cacheService.getAIResponse<GenerateVideoResult>(payloadCacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 2. Background Style Cache - check or populate
    const cachedBg = cacheService.getBackground<string>(bgStyle);
    if (!cachedBg) {
      cacheService.setBackground(bgStyle, `STYLIZED_BACKGROUND:${bgStyle}`);
    }

    // 3. Template Configuration Cache - check or populate
    const templateKey = `${title}:${message}`;
    const cachedTemplate = cacheService.getTemplate<any>(templateKey);
    if (!cachedTemplate) {
      cacheService.setTemplate(templateKey, { title, message });
    }
    
    logger.info('[AIEngine] Starting video generation orchestrator.', {
      traceId,
      user,
      module,
      api,
      scene,
      bgStyle,
      itemCount: placedItems?.length
    });

    // 4. Prompt Cache - check or build prompt
    const promptCacheKey = `${scene}:${JSON.stringify(placedItems)}`;
    let prompt = cacheService.getPrompt(promptCacheKey);
    if (!prompt) {
      prompt = promptBuilder.buildVideoPrompt(scene, placedItems);
      cacheService.setPrompt(promptCacheKey, prompt);
    }

    // 5. Select the appropriate AI Provider using AIRouter
    const { provider, apiKey, isFallbackToPreview } = aiRouter.routeVideo();

    // 3. Fallback Preview mode if no API key is set
    if (isFallbackToPreview) {
      logger.warn('[AIEngine] No provider API key configured. Activating Preview Mode.', {
        traceId,
        user,
        module,
        api
      });

      const duration = Date.now() - startTime;
      logger.performance('[AIEngine] Video generation completed in Preview Mode.', duration, {
        traceId,
        user,
        module,
        api,
        status: 'SUCCESS_PREVIEW'
      });

      const staticImageUrl = getStaticPreviewImage(title, message, scene, placedItems);

      const previewResult: GenerateVideoResult = {
        success: true,
        simulation: true,
        isSimulated: true,
        apiKeyConfigured: false,
        message: "Generated static card preview. Set AGNES_API_KEY in AI Studio Settings to enable live high-speed rendering with Agnes AI.",
        videoUrl: staticImageUrl,
        soundtrackUrl: musicTrack?.url || "",
        details: {
          title,
          message,
          scene,
          bgStyle,
          music: musicTrack?.label || "None",
          decorCount: placedItems?.length || 0
        }
      };

      // Store in Cache Service
      cacheService.setAIResponse(payloadCacheKey, previewResult);

      return previewResult;
    }

    // 4. Executing generation depending on the selected provider
    logger.info(`[AIEngine] Selected active provider: ${provider.name}`, {
      traceId,
      user,
      module,
      api,
      provider: provider.name
    });

    try {
      if (provider.name === 'HuggingFace' && provider.generateImage) {
        logger.aiRequest('HuggingFace', prompt.length, {
          traceId,
          user,
          module,
          api,
          prompt
        });

        const imageStartTime = Date.now();
        const dataUrl = await provider.generateImage(prompt, apiKey);
        
        logger.aiResponse('HuggingFace', Date.now() - imageStartTime, true, {
          traceId,
          user,
          module,
          api
        });
        
        // Cache Image Metadata
        cacheService.setImageMetadata(prompt, { url: dataUrl, timestamp: Date.now() });

        const finalVideoUrl = dataUrl;

        const totalDuration = Date.now() - startTime;
        logger.performance('[AIEngine] Video generation pipeline completed via HuggingFace AI.', totalDuration, {
          traceId,
          user,
          module,
          api,
          status: 'SUCCESS'
        });

        const hfResult: GenerateVideoResult = {
          success: true,
          simulation: false,
          videoUrl: finalVideoUrl,
          message: "Tạo hình ảnh/thiệp động thành công từ Hugging Face AI!",
          data: { generated_url: finalVideoUrl }
        };

        // Cache Video Metadata & full AI response
        cacheService.setVideoMetadata(prompt, { url: finalVideoUrl, duration: totalDuration, timestamp: Date.now() });
        cacheService.setAIResponse(payloadCacheKey, hfResult);

        return hfResult;
      }

      // FAL/Pika or Agnes AI paths
      if (provider.generateVideo) {
        logger.aiRequest(provider.name, prompt.length, {
          traceId,
          user,
          module,
          api,
          prompt
        });

        const providerStartTime = Date.now();
        const result = await provider.generateVideo(prompt, apiKey, {
          title,
          message,
          scene,
          bgStyle,
          musicTrack,
          placedItems,
          apiBase: config.agnesApiBase,
          cleanBase: config.agnesApiBase
        });

        logger.aiResponse(provider.name, Date.now() - providerStartTime, true, {
          traceId,
          user,
          module,
          api
        });

        const videoUrl = typeof result === 'string' ? result : result.url;
        const rawData = typeof result === 'string' ? null : result.raw;

        const totalDuration = Date.now() - startTime;
        logger.performance(`[AIEngine] Video generation pipeline completed via ${provider.name}.`, totalDuration, {
          traceId,
          user,
          module,
          api,
          status: 'SUCCESS'
        });

        const standardResult: GenerateVideoResult = {
          success: true,
          simulation: false,
          videoUrl,
          message: `Successfully generated video via ${provider.name} API!`,
          data: rawData
        };

        // Cache Video Metadata & full AI response
        cacheService.setVideoMetadata(prompt, { url: videoUrl, duration: totalDuration, timestamp: Date.now() });
        cacheService.setAIResponse(payloadCacheKey, standardResult);

        return standardResult;
      }

      throw new Error(`Provider ${provider.name} does not support generateVideo.`);
    } catch (err: any) {
      logger.warn(`[AIEngine] ${provider.name} request failed: ${err.message}. Triggering high-fidelity preview fallback.`, {
        traceId,
        user,
        module: `AIEngine:${provider.name}`,
        api,
        error: err.message
      });

      const totalDuration = Date.now() - startTime;
      logger.performance('[AIEngine] Video generation completed via fallback.', totalDuration, {
        traceId,
        user,
        module,
        api,
        status: 'SUCCESS_FALLBACK'
      });

      const staticImageUrl = getStaticPreviewImage(title, message, scene, placedItems);

      const fallbackResult: GenerateVideoResult = {
        success: true,
        simulation: true,
        isSimulated: true,
        apiKeyConfigured: true,
        warning: `Could not connect to ${provider.name} API: ${err.message}. Activated card preview fallback.`,
        videoUrl: staticImageUrl,
        soundtrackUrl: musicTrack?.url || "",
        details: {
          title,
          message,
          scene,
          bgStyle,
          music: musicTrack?.label || "None",
          decorCount: placedItems?.length || 0
        }
      };

      // Cache the fallback response
      cacheService.setAIResponse(payloadCacheKey, fallbackResult);

      return fallbackResult;
    }
  }
}

export const aiEngine = new AIEngine();
