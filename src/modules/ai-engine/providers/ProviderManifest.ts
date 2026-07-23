export interface ProviderManifest {
  id: string;
  capabilities: string[];
  priority: number;
  maxTokens: number;
  supportsStreaming: boolean;
  regions: string[];
  estimatedCost: number;
}
