import { aiRouter } from '../utils/aiRouter';
import { promptBuilder } from '../utils/promptBuilder';
import { GenerateVideoResult } from '../services/videoService';
import { logger } from './loggerService';
import { config } from '../config/config';
import { cacheService } from './cacheService';

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

      const previewResult: GenerateVideoResult = {
        success: true,
        simulation: true,
        apiKeyConfigured: false,
        message: "Video generated in Preview Mode! Set AGNES_API_KEY in AI Studio Settings to enable live high-speed rendering with Agnes AI.",
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-pink-and-red-paper-hearts-41484-large.mp4",
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

        let finalVideoUrl = dataUrl;
        let isAnimated = false;

        // Route to animator (Runway) if available
        const animator = aiRouter.routeAnimator();
        if (animator && animator.provider.generateVideo) {
          logger.info('[AIEngine] Runway animator detected. Attempting image animation.', {
            traceId,
            user,
            module,
            api
          });

          logger.aiRequest('Runway', prompt.length, {
            traceId,
            user,
            module,
            api,
            prompt
          });

          const runwayStartTime = Date.now();
          try {
            const animResult = await animator.provider.generateVideo(prompt, animator.apiKey, { imageUrl: dataUrl });
            finalVideoUrl = typeof animResult === 'string' ? animResult : animResult.url;
            isAnimated = true;

            logger.aiResponse('Runway', Date.now() - runwayStartTime, true, {
              traceId,
              user,
              module,
              api
            });
          } catch (runwayErr: any) {
            logger.exception(runwayErr, {
              traceId,
              user,
              module: 'AIEngine:Runway',
              api
            });
            logger.aiResponse('Runway', Date.now() - runwayStartTime, false, {
              traceId,
              user,
              module,
              api,
              error: runwayErr.message
            });
            logger.warn('[AIEngine] Runway generation failed, falling back to static Hugging Face visual.', {
              traceId,
              user,
              module,
              api
            });
          }
        }

        const totalDuration = Date.now() - startTime;
        logger.performance('[AIEngine] Video generation pipeline completed (HuggingFace + Runway).', totalDuration, {
          traceId,
          user,
          module,
          api,
          isAnimated,
          status: 'SUCCESS'
        });

        const hfResult: GenerateVideoResult = {
          success: true,
          simulation: false,
          videoUrl: finalVideoUrl,
          message: isAnimated ? "Successfully generated video via Runway API!" : "Successfully generated visual via Hugging Face API!",
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
      logger.exception(err, {
        traceId,
        user,
        module: `AIEngine:${provider.name}`,
        api
      });

      // Fallback fallback if real request fails
      if (provider.name === 'Agnes') {
        logger.warn('[AIEngine] Agnes AI request failed. Triggering high-fidelity preview fallback.', {
          traceId,
          user,
          module,
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

        const fallbackResult: GenerateVideoResult = {
          success: true,
          simulation: true,
          apiKeyConfigured: true,
          warning: `Could not connect to Agnes AI API: ${err.message}. Activated high-fidelity preview fallback.`,
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flying-pink-and-red-paper-hearts-41484-large.mp4",
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

      throw err;
    }
  }
}

export const aiEngine = new AIEngine();
