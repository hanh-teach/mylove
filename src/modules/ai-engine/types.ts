export type AIProvider = 'gemini' | 'openai' | 'claude' | 'huggingface' | 'local' | 'runway' | 'fal';

export interface AIRequestOptions {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  fallbackProviders?: AIProvider[];
  priority?: AIProvider[];
  retries?: number;
  useCache?: boolean;
}

export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costEstimate: number;
  images?: number;
  videos?: number;
  audioSeconds?: number;
}

export interface AILogEntry {
  traceId: string;
  timestamp: number;
  prompt: string;
  provider: AIProvider | 'unknown';
  model: string;
  latency: number;
  cost: number;
  success: boolean;
  error?: string;
  retryCount: number;
  cached: boolean;
}

export interface AIResponse {
  id: string;
  provider: AIProvider;
  model: string;
  content: string; // Chuẩn hóa về chuỗi (hoặc JSON string)
  rawResponse: any;
  usage: AIUsage;
  latency: number;
}

