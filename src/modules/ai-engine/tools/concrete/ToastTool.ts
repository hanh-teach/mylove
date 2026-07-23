import { AITool, ToolMetadata } from '../AITool';

export class ToastTool implements AITool {
  public metadata: ToolMetadata = {
    id: 'toast-notify',
    name: 'Real-time Toast Notification Tool',
    description: 'Displays status updates and real-time execution steps on the screen to the user.',
    version: '1.0.0',
    permissions: [],
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        type: { type: 'string', enum: ['info', 'success', 'warning', 'error'] }
      },
      required: ['message']
    },
    outputSchema: {
      type: 'object',
      properties: {
        dispatched: { type: 'boolean' }
      }
    },
    timeoutMs: 5000,
    costEstimateUsd: 0.0,
    owner: 'system',
    tags: ['notification', 'toast', 'ui']
  };

  public async execute(input: { message: string; type?: 'info' | 'success' | 'warning' | 'error' }): Promise<any> {
    console.log(`[ToastTool] Notification: ${input.message} (Type: ${input.type || 'info'})`);
    return { dispatched: true };
  }

  public validate(input: any): { isValid: boolean; error?: string } {
    if (!input || !input.message) {
      return { isValid: false, error: 'Message is required' };
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
