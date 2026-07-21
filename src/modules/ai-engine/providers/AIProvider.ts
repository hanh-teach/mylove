import { AIRequestOptions, AIResponse } from '../types';

export interface IAIProvider {
  id: string;
  name: string;

  generateText(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
  generateImage(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
  generateVideo?(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
  analyzeImage?(imageUrl: string, prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
  analyzeText?(text: string, options?: AIRequestOptions): Promise<AIResponse>;
  generateMusic?(prompt: string, options?: AIRequestOptions): Promise<AIResponse>;
  speechToText?(audioUrl: string, options?: AIRequestOptions): Promise<AIResponse>;
  textToSpeech?(text: string, options?: AIRequestOptions): Promise<AIResponse>;
}
