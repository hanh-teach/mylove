import { cacheRepository } from '../repositories/cacheRepository';
import { extractUrl, getVisualPrompt } from '../utils/prompt';
import { AIProvider } from './aiProviderInterface';
import { AIProviderError } from '../utils/errors';
import { logger } from '../services/loggerService';

export class AgnesAIProvider implements AIProvider {
  public readonly name = 'Agnes';
  private consecutiveDiscoveryFailures = 0;

  public async discoverModels(apiBase: string, cleanBase: string, apiKey: string): Promise<string[]> {
    const cached = cacheRepository.getCachedModels();
    if (cached) {
      logger.info(`[Discovery] Returning cached models list (${cached.length} models)`, { module: 'AgnesAIProvider' });
      return cached;
    }

    const discovered: string[] = [];
    const modelEndpoints = [
      `${cleanBase}/v1/models`,
      `${apiBase}/v1/models`,
      `${cleanBase}/models`,
      `${apiBase}/models`,
      'https://apihub.agnes-ai.com/v1/models',
      'https://platform.agnes-ai.com/api/v1/models'
    ];
    
    const uniqueModelEndpoints = Array.from(new Set(modelEndpoints));
    for (const ep of uniqueModelEndpoints) {
      try {
        logger.info(`[Discovery] Attempting to fetch models from: ${ep}`, { module: 'AgnesAIProvider' });
        const res = await fetch(ep, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'api-key': apiKey,
            'x-api-key': apiKey
          }
        });
        if (res.ok) {
          const data = await res.json();
          logger.info(`[Discovery] Successfully fetched models payload: ${JSON.stringify(data)}`, { module: 'AgnesAIProvider' });
          if (data && Array.isArray(data.data)) {
            for (const m of data.data) {
              if (m.id && typeof m.id === 'string') {
                discovered.push(m.id);
              }
            }
          } else if (data && Array.isArray(data.models)) {
            for (const m of data.models) {
              if (typeof m === 'string') {
                discovered.push(m);
              } else if (m && typeof m.id === 'string') {
                discovered.push(m.id);
              } else if (m && typeof m.name === 'string') {
                discovered.push(m.name);
              }
            }
          }
          if (discovered.length > 0) {
            logger.info(`[Discovery] Discovered ${discovered.length} models: ${JSON.stringify(discovered)}`, { module: 'AgnesAIProvider' });
            cacheRepository.setCachedModels(discovered);
            this.consecutiveDiscoveryFailures = 0;
            break;
          }
        } else {
          logger.warn(`[Discovery] Endpoint ${ep} returned status ${res.status}`, { module: 'AgnesAIProvider' });
        }
      } catch (err: any) {
        logger.error(`[Discovery] Endpoint ${ep} failed: ${err.message}`, { module: 'AgnesAIProvider' });
      }
    }

    if (discovered.length === 0) {
      this.consecutiveDiscoveryFailures++;
      if (this.consecutiveDiscoveryFailures >= 3) {
        logger.error('[AgnesAI] 3 consecutive model discovery failures. Endpoint /v1/models might be deprecated or changed. Please contact Agnes AI to verify API.');
      }
    }

    return discovered;
  }

  public async generateVideo(
    prompt: string,
    apiKey: string,
    options?: {
      title?: string;
      message?: string;
      scene?: string;
      bgStyle?: string;
      musicTrack?: any;
      placedItems?: any[];
      apiBase?: string;
      cleanBase?: string;
    }
  ): Promise<{ url: string; raw: any }> {
    const title = options?.title || '';
    const message = options?.message || '';
    const scene = options?.scene || '';
    const bgStyle = options?.bgStyle || '';
    const musicTrack = options?.musicTrack;
    const placedItems = options?.placedItems || [];
    const apiBase = options?.apiBase || 'https://apihub.agnes-ai.com';
    const cleanBase = options?.cleanBase || 'https://apihub.agnes-ai.com';

    // Discover available models
    const discoveredModels = await this.discoverModels(apiBase, cleanBase, apiKey);

    // Build endpoint configurations
    const uniqueConfigs: Array<{ url: string; type: 'video' | 'image' | 'chat' }> = [];
    const seenUrls = new Set<string>();

    const templatePaths: Array<{ path: string; type: 'video' | 'image' | 'chat' }> = [
      { path: '/v1/video/generations', type: 'video' },
      { path: '/v1/videos/generations', type: 'video' },
      { path: '/v1/video/generate', type: 'video' },
      { path: '/v1/images/generations', type: 'image' },
      { path: '/v1/chat/completions', type: 'chat' }
    ];

    for (const t of templatePaths) {
      const urlsToTry = [
        `${apiBase}${t.path}`,
        `${cleanBase}${t.path}`,
        `https://apihub.agnes-ai.com${t.path}`
      ];
      for (const targetUrl of urlsToTry) {
        if (!seenUrls.has(targetUrl)) {
          seenUrls.add(targetUrl);
          uniqueConfigs.push({ url: targetUrl, type: t.type });
        }
      }
    }

    let successData: any = null;
    let lastErrorMsg = "";

    const endpointsToTry = [...uniqueConfigs];
    const cachedSuccessEndpoint = cacheRepository.getCachedSuccessEndpoint();
    if (cachedSuccessEndpoint) {
      const cachedIdx = endpointsToTry.findIndex(c => c.url === cachedSuccessEndpoint.url);
      if (cachedIdx !== -1) {
        const [cachedConf] = endpointsToTry.splice(cachedIdx, 1);
        endpointsToTry.unshift(cachedConf);
        logger.info(`[Cache] Prioritizing last working endpoint: ${cachedConf.url}`, { module: 'AgnesAIProvider' });
      }
    }

    for (const conf of endpointsToTry) {
      if (successData) break;

      let modelsToTry: string[] = [];
      if (conf.type === 'video') {
        const videoDiscovered = discoveredModels.filter(m => m.toLowerCase().includes('video'));
        modelsToTry = [...videoDiscovered, "agnes-video-2.0", "agnes-video"];
      } else if (conf.type === 'image') {
        const imageDiscovered = discoveredModels.filter(m => m.toLowerCase().includes('image') || m.toLowerCase().includes('dall'));
        modelsToTry = [...imageDiscovered, "agnes-image-2.0-flash", "agnes-image"];
      } else if (conf.type === 'chat') {
        const chatDiscovered = discoveredModels.filter(m => !m.toLowerCase().includes('video') && !m.toLowerCase().includes('image'));
        modelsToTry = [...chatDiscovered, "agnes-2.0-flash", "agnes-video-2.0"];
      }

      modelsToTry = Array.from(new Set(modelsToTry));

      if (cachedSuccessEndpoint && cachedSuccessEndpoint.url === conf.url) {
        const cachedModelIdx = modelsToTry.indexOf(cachedSuccessEndpoint.model);
        if (cachedModelIdx !== -1) {
          modelsToTry.splice(cachedModelIdx, 1);
          modelsToTry.unshift(cachedSuccessEndpoint.model);
          logger.info(`[Cache] Prioritizing last working model: ${cachedSuccessEndpoint.model}`, { module: 'AgnesAIProvider' });
        }
      }

      const bodies: any[] = [];
      for (const m of modelsToTry) {
        if (conf.type === 'video') {
          bodies.push({
            model: m,
            prompt: prompt || getVisualPrompt(scene, placedItems),
            title,
            message,
            scene,
            bg_style: bgStyle,
            audio_url: musicTrack?.url,
            duration: 15,
            aspect_ratio: "16:9",
            ratio: "16:9",
            decorations: placedItems
          });
        } else if (conf.type === 'image') {
          bodies.push({
            model: m,
            prompt: prompt || getVisualPrompt(scene, placedItems),
            n: 1,
            size: "1024x1024",
            aspect_ratio: "16:9",
            ratio: "16:9"
          });
        } else if (conf.type === 'chat') {
          bodies.push({
            model: m,
            messages: [
              {
                role: "user",
                content: `Please generate a beautiful public URL of an animated romantic textless greeting card background. Theme: ${scene}. Floating decorations: ${placedItems?.map((p: any) => p.type).join(', ') || 'hearts'}. Put the URL clearly in the response.`
              }
            ]
          });
        }
      }

      for (const body of bodies) {
        if (successData) break;
        try {
          logger.info(`Sending API request to Agnes AI endpoint (${conf.type}): ${conf.url} with model ${body.model}`, { module: 'AgnesAIProvider' });
          const response = await fetch(conf.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'api-key': apiKey,
              'x-api-key': apiKey
            },
            body: JSON.stringify(body)
          });

          if (response.status === 429) {
            lastErrorMsg = "Agnes AI Rate Limit Exceeded (Status 429). Please wait a moment and try again.";
            logger.warn(`Endpoint (${conf.type}) ${conf.url} returned rate limit 429. Breaking retry loop.`, { module: 'AgnesAIProvider' });
            break;
          }

          if (response.ok) {
            const createData = await response.json();
            logger.info(`Successfully connected to Agnes AI endpoint: ${conf.url}`, { module: 'AgnesAIProvider' });
            logger.info(`Response payload: ${JSON.stringify(createData)}`, { module: 'AgnesAIProvider' });

            const finalVideoUrl = 
              createData.video_url || 
              createData.url || 
              createData.videoUrl || 
              createData.data?.[0]?.url || 
              createData.data?.[0]?.video_url ||
              createData.result?.[0]?.url ||
              createData.result?.url ||
              createData.result?.video_url ||
              (createData.choices?.[0]?.message?.content && extractUrl(createData.choices[0].message.content));

            if (finalVideoUrl) {
              successData = { ...createData, video_url: finalVideoUrl };
              cacheRepository.setCachedSuccessEndpoint({ url: conf.url, type: conf.type, model: body.model });
              logger.info(`[Cache] Cached successful configuration (synchronous): ${conf.url} with model ${body.model}`, { module: 'AgnesAIProvider' });
              break;
            }

            const taskId = 
              createData.id || 
              createData.task_id || 
              createData.taskId || 
              createData.data?.id || 
              createData.data?.task_id || 
              createData.data?.taskId ||
              createData.result?.id ||
              createData.result?.task_id;

            if (taskId) {
              logger.info(`Task created with ID: ${taskId}. Initiating polling for results...`, { module: 'AgnesAIProvider' });
              
              const pollingEndpoints: string[] = [];
              if (createData.urls?.get) {
                pollingEndpoints.push(createData.urls.get);
              }
              if (createData.poll_url) {
                pollingEndpoints.push(createData.poll_url);
              }

              let baseOfSuccess = conf.url.split('?')[0];
              if (baseOfSuccess.endsWith('/generations')) {
                pollingEndpoints.push(baseOfSuccess.replace(/\/generations$/, `/tasks/${taskId}`));
                pollingEndpoints.push(baseOfSuccess.replace(/\/generations$/, `/${taskId}`));
              } else if (baseOfSuccess.endsWith('/generate')) {
                pollingEndpoints.push(baseOfSuccess.replace(/\/generate$/, `/tasks/${taskId}`));
              } else {
                pollingEndpoints.push(`${baseOfSuccess}/${taskId}`);
              }

              pollingEndpoints.push(
                `https://apihub.agnes-ai.com/v1/video/tasks/${taskId}`,
                `https://apihub.agnes-ai.com/v1/videos/${taskId}`
              );

              const uniquePollingEndpoints = Array.from(new Set(pollingEndpoints));
              let pollSuccess = false;
              let correctPollUrl: string | null = null;

              for (let i = 0; i < 15; i++) {
                logger.info(`Polling attempt ${i + 1}/15...`, { module: 'AgnesAIProvider' });
                await new Promise(resolve => setTimeout(resolve, 3000));

                const endpointsToTry = correctPollUrl ? [correctPollUrl] : uniquePollingEndpoints;

                for (const pollEndpoint of endpointsToTry) {
                  try {
                    logger.info(`Polling task status at: ${pollEndpoint}`, { module: 'AgnesAIProvider' });
                    const pollResponse = await fetch(pollEndpoint, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'api-key': apiKey,
                        'x-api-key': apiKey
                      }
                    });

                    if (pollResponse.ok) {
                      if (!correctPollUrl) {
                        correctPollUrl = pollEndpoint;
                        logger.info(`[Polling] Caching verified correct status endpoint: ${correctPollUrl}`, { module: 'AgnesAIProvider' });
                      }

                      const pollResult = await pollResponse.json();
                      logger.info(`Poll response: ${JSON.stringify(pollResult)}`, { module: 'AgnesAIProvider' });
                      
                      const status = (pollResult.status || pollResult.state || "").toLowerCase();
                      const videoUrl = 
                        pollResult.video_url || 
                        pollResult.url || 
                        pollResult.videoUrl || 
                        pollResult.data?.[0]?.url || 
                        pollResult.data?.[0]?.video_url ||
                        pollResult.result?.[0]?.url ||
                        pollResult.result?.url ||
                        pollResult.result?.video_url ||
                        (pollResult.data && (pollResult.data.video_url || pollResult.data.url || pollResult.data.videoUrl));

                      if (videoUrl) {
                        successData = { ...pollResult, video_url: videoUrl };
                        cacheRepository.setCachedSuccessEndpoint({ url: conf.url, type: conf.type, model: body.model });
                        logger.info(`[Cache] Cached successful configuration (polling): ${conf.url} with model ${body.model}`, { module: 'AgnesAIProvider' });
                        pollSuccess = true;
                        break;
                      }

                      if (status === 'completed' || status === 'succeeded') {
                        const potentialUrl = 
                          pollResult.video_url || 
                          pollResult.url || 
                          pollResult.videoUrl || 
                          pollResult.video_path || 
                          pollResult.data?.[0]?.url || 
                          pollResult.data?.[0]?.video_url ||
                          pollResult.result?.[0]?.url ||
                          pollResult.result?.url ||
                          (pollResult.result && (pollResult.result.url || pollResult.result.video_url));

                        successData = { ...pollResult, video_url: potentialUrl || "" };
                        cacheRepository.setCachedSuccessEndpoint({ url: conf.url, type: conf.type, model: body.model });
                        logger.info(`[Cache] Cached successful configuration (polling completed): ${conf.url} with model ${body.model}`, { module: 'AgnesAIProvider' });
                        pollSuccess = true;
                        break;
                      } else if (status === 'failed' || status === 'error' || status === 'cancelled') {
                        logger.warn(`Polling detected task failed/cancelled: ${JSON.stringify(pollResult)}`, { module: 'AgnesAIProvider' });
                        break;
                      }

                      break;
                    } else if (pollResponse.status === 429) {
                      logger.warn(`Polling status returned 429 at ${pollEndpoint}`, { module: 'AgnesAIProvider' });
                    } else {
                      logger.warn(`Polling endpoint ${pollEndpoint} returned status ${pollResponse.status}`, { module: 'AgnesAIProvider' });
                    }
                  } catch (pollErr: any) {
                    logger.error(`Polling endpoint ${pollEndpoint} failed: ${pollErr.message}`, { module: 'AgnesAIProvider' });
                  }
                }

                if (pollSuccess) {
                  break;
                }
              }

              if (pollSuccess) {
                break;
              } else {
                logger.warn(`Polling completed without finding a finished URL for task ${taskId}.`, { module: 'AgnesAIProvider' });
                lastErrorMsg = `Task ${taskId} did not complete in time.`;
              }
            } else {
              successData = createData;
              break;
            }
          } else {
            let errorText = await response.text();
            if (errorText.includes('<!DOCTYPE html') || errorText.includes('<html')) {
              errorText = 'HTML content (likely 404 Not Found or redirect)';
            } else if (errorText.length > 150) {
              errorText = errorText.substring(0, 150) + '...';
            }
            lastErrorMsg = `Status ${response.status} (${errorText})`;
            logger.error(`Endpoint (${conf.type}) ${conf.url} returned error: ${lastErrorMsg}`, { module: 'AgnesAIProvider' });
          }
        } catch (err: any) {
          lastErrorMsg = err.message || "Network Error";
          logger.warn(`Endpoint (${conf.type}) ${conf.url} connection skipped: ${lastErrorMsg}`, { module: 'AgnesAIProvider' });
        }
      }

      if (lastErrorMsg.includes("429")) {
        break;
      }
    }

    if (successData && (successData.video_url || successData.url || successData.videoUrl)) {
      return {
        url: successData.video_url || successData.url || successData.videoUrl,
        raw: successData
      };
    } else {
      logger.error('[AgnesAI] Toàn bộ model Agnes AI (kể cả fallback) đều thất bại — cần rà soát thủ công.');
      throw new AIProviderError(lastErrorMsg || 'Failed to generate video', 'Agnes');
    }
  }
}

export const agnesAIProvider = new AgnesAIProvider();
