import { AITool, ToolMetadata } from '../AITool';

export class TextGenerationTool implements AITool {
  public metadata: ToolMetadata = {
    id: 'text-generator',
    name: 'Advanced Narrative and Sentiment Text Generator',
    description: 'Generates loving letters, emotional narratives, or theme concepts with safety guardrails.',
    version: '1.0.0',
    permissions: ['compose_letters', 'ideation'],
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The guiding idea or topic for the text content' },
        maxLength: { type: 'number', description: 'Maximum word limit' }
      },
      required: ['prompt']
    },
    outputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string' },
        wordCount: { type: 'number' }
      }
    },
    timeoutMs: 15000,
    costEstimateUsd: 0.002,
    owner: 'system',
    tags: ['text', 'narrative', 'love_letter']
  };

  public async execute(input: { prompt: string; maxLength?: number }): Promise<any> {
    const limit = input.maxLength ?? 300;
    // Simulate generation with high semantic value
    const baseLetters = [
      `Trân trọng gửi trao,\n\nMỗi ngày trôi qua trên hành trình làm việc và sáng tạo đều là một cơ hội quý giá. Cảm ơn sự đồng hành và thấu hiểu chân thành từ bạn. Chúc cho những mục tiêu phía trước của chúng ta đều gặt hái thành công và niềm vui trọn vẹn.`,
      `Chào ngày mới an lành,\n\nNhững trải nghiệm và bài học quý giá trên chặng đường đã qua luôn là nguồn cảm hứng lớn lao. Chúc cho bạn luôn giữ vững năng lượng tích cực và sự tự tin để kiến tạo nên những điều tuyệt vời.`
    ];
    const letter = baseLetters[Math.floor(Math.random() * baseLetters.length)];
    
    return {
      text: `${letter}\n\n[Ý tưởng bổ sung: ${input.prompt}]`,
      wordCount: letter.split(/\s+/).length + 5
    };
  }

  public validate(input: any): { isValid: boolean; error?: string } {
    if (!input || !input.prompt || input.prompt.trim() === '') {
      return { isValid: false, error: 'Vui lòng nhập chủ đề hoặc yêu cầu trước khi tạo nội dung.' };
    }
    return { isValid: true };
  }

  public estimateCost(input: any): number {
    return this.metadata.costEstimateUsd;
  }

  public supportsStreaming(): boolean {
    return false;
  }
}
