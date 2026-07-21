import { aiEngine } from './aiEngine';

export interface GenerateVideoResult {
  success: boolean;
  simulation: boolean;
  apiKeyConfigured?: boolean;
  videoUrl: string;
  soundtrackUrl?: string;
  message?: string;
  warning?: string;
  data?: any;
  details?: any;
}

export class VideoService {
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
    return aiEngine.generateVideo(payload, metadata);
  }
}

export const videoService = new VideoService();
