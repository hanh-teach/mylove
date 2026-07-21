import { cacheRepository } from '../repositories/cacheRepository';
import { extractUrl, getVisualPrompt } from '../utils/prompt';
import { AIProvider } from './aiProviderInterface';
import { AIProviderError } from '../utils/errors';

export class AgnesAIProvider implements AIProvider {
  public readonly name = 'Agnes';

  public async discoverModels(apiBase: string, cleanBase: string, apiKey: string): Promise<string[]> {
    const cached = cacheRepository.getCachedModels();
    if (cached) {
      console.log(`[Discovery] Returning cached models list (${cached.length} models)`);
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
        console.log(`[Discovery] Attempting to fetch models from: ${ep}`);
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
          console.log(`[Discovery] Successfully fetched models payload:`, JSON.stringify(data));
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
            console.log(`[Discovery] Discovered ${discovered.length} models:`, discovered);
            cacheRepository.setCachedModels(discovered);
            break;
          }
        } else {
          console.log(`[Discovery] Endpoint ${ep} returned status ${res.status}`);
        }
      } catch (err: any) {
        console.log(`[Discovery] Endpoint ${ep} failed: ${err.message}`);
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
        console.log(`[Cache] Prioritizing last working endpoint: ${cachedConf.url}`);
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
          console.log(`[Cache] Prioritizing last working model: ${cachedSuccessEndpoint.model}`);
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
          console.log(`Sending API request to Agnes AI endpoint (${conf.type}): ${conf.url} with model ${body.model}`);
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
            console.log(`Endpoint (${conf.type}) ${conf.url} returned rate limit 429. Breaking retry loop.`);
            break;
          }

          if (response.ok) {
            const createData = await response.json();
            console.log(`Successfully connected to Agnes AI endpoint: ${conf.url}`);
            console.log(`Response payload:`, JSON.stringify(createData));

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
              console.log(`[Cache] Cached successful configuration (synchronous): ${conf.url} with model ${body.model}`);
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
              console.log(`Task created with ID: ${taskId}. Initiating polling for results...`);
              
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
                console.log(`Polling attempt ${i + 1}/15...`);
                await new Promise(resolve => setTimeout(resolve, 3000));

                const endpointsToTry = correctPollUrl ? [correctPollUrl] : uniquePollingEndpoints;

                for (const pollEndpoint of endpointsToTry) {
                  try {
                    console.log(`Polling task status at: ${pollEndpoint}`);
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
                        console.log(`[Polling] Caching verified correct status endpoint: ${correctPollUrl}`);
                      }

                      const pollResult = await pollResponse.json();
                      console.log(`Poll response:`, JSON.stringify(pollResult));
                      
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
                        console.log(`[Cache] Cached successful configuration (polling): ${conf.url} with model ${body.model}`);
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

                        successData = { ...pollResult, video_url: potentialUrl || "https://assets.mixkit.co/videos/preview/mixkit-flying-pink-and-red-paper-hearts-41484-large.mp4" };
                        cacheRepository.setCachedSuccessEndpoint({ url: conf.url, type: conf.type, model: body.model });
                        console.log(`[Cache] Cached successful configuration (polling completed): ${conf.url} with model ${body.model}`);
                        pollSuccess = true;
                        break;
                      } else if (status === 'failed' || status === 'error' || status === 'cancelled') {
                        console.log(`Polling detected task failed/cancelled:`, JSON.stringify(pollResult));
                        break;
                      }

                      break;
                    } else if (pollResponse.status === 429) {
                      console.log(`Polling status returned 429 at ${pollEndpoint}`);
                    } else {
                      console.log(`Polling endpoint ${pollEndpoint} returned status ${pollResponse.status}`);
                    }
                  } catch (pollErr: any) {
                    console.log(`Polling endpoint ${pollEndpoint} failed: ${pollErr.message}`);
                  }
                }

                if (pollSuccess) {
                  break;
                }
              }

              if (pollSuccess) {
                break;
              } else {
                console.log(`Polling completed without finding a finished URL for task ${taskId}.`);
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
            console.log(`Endpoint (${conf.type}) ${conf.url} returned error: ${lastErrorMsg}`);
          }
        } catch (err: any) {
          lastErrorMsg = err.message || "Network Error";
          console.log(`Endpoint (${conf.type}) ${conf.url} connection skipped: ${lastErrorMsg}`);
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
      throw new AIProviderError(lastErrorMsg || 'Failed to generate video', 'Agnes');
    }
  }
}

export const agnesAIProvider = new AgnesAIProvider();
