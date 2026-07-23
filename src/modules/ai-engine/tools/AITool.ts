export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  permissions: string[];
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  timeoutMs: number;
  costEstimateUsd: number;
  owner: string;
  tags: string[];
}

export interface AITool {
  metadata: ToolMetadata;
  execute(input: any, context?: any): Promise<any>;
  validate(input: any): { isValid: boolean; error?: string };
  estimateCost(input: any): number;
  cancel?(): void;
  supportsStreaming(): boolean;
}
