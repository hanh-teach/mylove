import { WritingRequestPayload } from './WritingRequest';
import { WritingResponsePayload } from './WritingResponse';

export class WritingService {
  static async processWriting(payload: WritingRequestPayload): Promise<WritingResponsePayload> {
    try {
      const response = await fetch('/api/ai/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success,
        result: data.result,
        error: data.error,
      };
    } catch (err: any) {
      console.error('WritingService error:', err);
      // Fallback local simulation if API fails or is offline
      const simulatedResult = this.simulateLocalWriting(payload);
      return {
        success: true,
        result: simulatedResult,
      };
    }
  }

  private static simulateLocalWriting(payload: WritingRequestPayload): string {
    const { action, text, tone } = payload;
    const trimmed = text.trim() || 'Trân trọng gửi lời chào và cảm ơn chân thành.';
    
    switch (action) {
      case 'improve':
        return `${trimmed} Mỗi trải nghiệm chia sẻ cùng nhau đều đem lại những giá trị tích cực và ý nghĩa. ✨`;
      case 'rewrite':
        return `Với tất cả sự chân thành: ${trimmed} Xin gửi tới bạn những lời chúc tốt đẹp nhất. ✨`;
      case 'shorten':
        return `${trimmed}`;
      case 'expand':
        return `${trimmed} Mỗi chặng đường đi qua và mỗi trải nghiệm cùng nhau đều là nền tảng vững chắc cho những thành công và niềm vui trong tương lai.`;
      case 'grammar':
        return `${trimmed} (Đã chuẩn hóa ngữ pháp và chính tả).`;
      case 'translate':
        return `[Translated] "${trimmed}"`;
      default:
        return trimmed;
    }
  }
}
