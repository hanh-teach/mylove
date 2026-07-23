import { AITool } from './AITool';
import { ToolRegistry } from './ToolRegistry';

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface MCPResponse {
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}

export class MCPAdapter {
  /**
   * Translates internal registered tool structures to external Model Context Protocol (MCP) compliant standard.
   */
  public static getMCPTools(): MCPToolDefinition[] {
    const tools = ToolRegistry.getAllTools();
    return tools.map(tool => ({
      name: tool.metadata.id,
      description: tool.metadata.description,
      inputSchema: {
        type: 'object',
        properties: tool.metadata.inputSchema.properties || {},
        required: tool.metadata.inputSchema.required || []
      }
    }));
  }

  /**
   * Executes a tool invocation matching standard Model Context Protocol (MCP) message transport envelopes.
   */
  public static async handleMCPCall(name: string, args: any, clientRole: string): Promise<MCPResponse> {
    try {
      const output = await ToolRegistry.invoke(name, args, clientRole);
      return {
        content: [
          {
            type: 'text',
            text: typeof output === 'string' ? output : JSON.stringify(output, null, 2)
          }
        ]
      };
    } catch (e: any) {
      return {
        content: [
          {
            type: 'text',
            text: `MCP Tool Execution Failure: ${e.message}`
          }
        ],
        isError: true
      };
    }
  }
}
