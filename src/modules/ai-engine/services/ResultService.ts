import { AIResponse } from '../types';
import { responseNormalizer, NormalizedResult } from './ResponseNormalizer';

export class ResultService {
  /**
   * Xử lý kết quả cuối cùng trước khi trả về UI hoặc lưu trữ.
   */
  public process(response: AIResponse): NormalizedResult {
    const normalized = responseNormalizer.normalize(response);
    
    // Có thể thêm logic lưu vào Database hoặc thông báo cho các module khác ở đây
    console.log(`[AI Engine] Result processed from ${response.provider}`);
    
    return normalized;
  }
}

export const resultService = new ResultService();
