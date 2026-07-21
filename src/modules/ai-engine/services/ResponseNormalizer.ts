import { AIResponse } from '../types';

export interface NormalizedResult {
  text: string;
  data: any;
  mediaUrl?: string;
  metadata: Record<string, any>;
}

export class ResponseNormalizer {
  /**
   * Chuyển đổi phản hồi thô từ các provider khác nhau về một định dạng chuẩn cho Editor.
   */
  public normalize(response: AIResponse): NormalizedResult {
    const raw = response.content;
    let data = {};
    let text = raw;

    // Cố gắng parse JSON nếu content có định dạng JSON
    try {
      if (raw.trim().startsWith('{') || raw.trim().startsWith('[')) {
        data = JSON.parse(raw);
      }
    } catch (e) {
      // Không phải JSON, giữ nguyên là text
    }

    return {
      text,
      data,
      mediaUrl: response.rawResponse?.url || response.rawResponse?.image_url,
      metadata: {
        provider: response.provider,
        model: response.model,
        latency: response.latency,
        cost: response.usage.costEstimate
      }
    };
  }
}

export const responseNormalizer = new ResponseNormalizer();
