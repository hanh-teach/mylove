export interface AIProvider {
  readonly name: string;
  generateImage?(prompt: string, apiKey: string): Promise<string>;
  generateVideo?(prompt: string, apiKey: string, options?: { imageUrl?: string; [key: string]: any }): Promise<string | { url: string; raw: any }>;
  generateText?(prompt: string, apiKey: string, options?: any): Promise<string>;
  analyzeImage?(imageUrl: string, prompt: string, apiKey: string): Promise<string>;
}
