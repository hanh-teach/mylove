export type AIProvider = 'gemini' | 'openai' | 'claude' | 'huggingface' | 'runway' | 'fal' | 'agnes';
export type TaskType = 'text-generation' | 'image-generation' | 'video-generation' | 'audio-generation' | 'embedding' | 'function-calling';

export interface ModelDefinition {
  id: string;
  provider: AIProvider;
  modelName: string;
  displayName: string;
  description: string;
  supportedTasks: TaskType[];
  supportedLanguages: string[];
  inputTypes: string[];
  outputTypes: string[];
  maxInputTokens: number;
  maxOutputTokens: number;
  imageResolution?: string;
  videoResolution?: string;
  supportsStreaming: boolean;
  supportsFunctionCalling: boolean;
  supportsVision: boolean;
  supportsImageGeneration: boolean;
  supportsVideoGeneration: boolean;
  supportsAudioGeneration: boolean;
  supportsEmbedding: boolean;
  costPerInputToken: number; // USD per token
  costPerOutputToken: number; // USD per token
  costPerImage: number; // USD
  costPerVideoMinute: number; // USD
  priority: number; // 0-100, cao hơn là ưu tiên hơn
  enabled: boolean;
  deprecated: boolean;
  version: string;
  releaseDate: string;
  metadata: Record<string, any>;
}
