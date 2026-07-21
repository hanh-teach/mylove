import { AIProvider } from '../types';

export type CapabilityId = 
  | 'text-generation' | 'image-generation' | 'video-generation' | 'voice-generation' 
  | 'speech-to-text' | 'text-to-speech' | 'vision' | 'ocr' | 'embedding' 
  | 'translation' | 'summarization' | 'code-generation' | 'reasoning' | 'moderation'
  | 'background-removal' | 'face-detection' | 'style-transfer' | 'animation' | 'music-generation'
  | 'avatar-generation' | 'love-letter-generation' | 'story-generation' | 'timeline-generation'
  | 'website-generation' | 'video-storyboard' | 'template-recommendation';

export interface CapabilityDefinition {
  capabilityId: CapabilityId;
  name: string;
  description: string;
  providers: AIProvider[];
  preferredProvider?: AIProvider;
  fallbackProvider?: AIProvider;
  supportedModels: Record<AIProvider, string[]>;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    backoff: 'linear' | 'exponential';
  };
  cachePolicy: {
    enabled: boolean;
    ttl: number;
  };
}
