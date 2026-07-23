import { AITool } from './AITool';
import { PermissionManager } from './PermissionManager';

export interface ToolTelemetryLog {
  toolId: string;
  agentRole: string;
  workflowId?: string;
  latencyMs: number;
  tokensUsed?: number;
  costUsd: number;
  status: 'success' | 'failed';
  error?: string;
  timestamp: string;
}

export class ToolRegistry {
  private static registeredTools = new Map<string, AITool>();
  private static telemetryLogs: ToolTelemetryLog[] = [];

  public static register(tool: AITool): void {
    this.registeredTools.set(tool.metadata.id, tool);
    console.log(`[ToolRegistry] Successfully registered tool: [${tool.metadata.id}] (v${tool.metadata.version})`);
  }

  public static unregister(toolId: string): void {
    this.registeredTools.delete(toolId);
    console.log(`[ToolRegistry] Deregistered tool: [${toolId}]`);
  }

  public static lookup(toolId: string): AITool | undefined {
    return this.registeredTools.get(toolId);
  }

  public static getAllTools(): AITool[] {
    return Array.from(this.registeredTools.values());
  }

  /**
   * Safe execution entry point. Ensures cost checks, validate input formats, authenticates agent rights, and captures telemetry.
   */
  public static async invoke(
    toolId: string,
    input: any,
    agentRole: string,
    workflowContext?: { workflowId?: string; sessionMemory?: Record<string, any> }
  ): Promise<any> {
    const startTime = Date.now();
    const tool = this.lookup(toolId);

    if (!tool) {
      const errorMsg = `Tool [${toolId}] is not registered in the active tool registry.`;
      this.logTelemetry(toolId, agentRole, startTime, 0, 'failed', errorMsg, workflowContext?.workflowId);
      throw new Error(errorMsg);
    }

    // 1. Assert Permissions via PermissionManager
    if (!PermissionManager.authorize(agentRole, toolId)) {
      const errorMsg = `Security exception: Role [${agentRole}] is unauthorized to invoke tool [${toolId}].`;
      this.logTelemetry(toolId, agentRole, startTime, 0, 'failed', errorMsg, workflowContext?.workflowId);
      throw new Error(errorMsg);
    }

    // 2. Validate input schema matching
    const validationResult = tool.validate(input);
    if (!validationResult.isValid) {
      const errorMsg = `Invalid input arguments for tool [${toolId}]: ${validationResult.error}`;
      this.logTelemetry(toolId, agentRole, startTime, 0, 'failed', errorMsg, workflowContext?.workflowId);
      throw new Error(errorMsg);
    }

    // 3. Estimate cost
    const estimatedCost = tool.estimateCost(input);

    try {
      // 4. Safe execution wrapping
      const result = await Promise.race([
        tool.execute(input, workflowContext),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout limit reached (${tool.metadata.timeoutMs}ms)`)), tool.metadata.timeoutMs)
        )
      ]);

      const duration = Date.now() - startTime;
      this.logTelemetry(toolId, agentRole, startTime, estimatedCost, 'success', undefined, workflowContext?.workflowId);
      
      return result;
    } catch (err: any) {
      const duration = Date.now() - startTime;
      const errorMsg = err.message || 'Execution failed';
      this.logTelemetry(toolId, agentRole, startTime, estimatedCost, 'failed', errorMsg, workflowContext?.workflowId);
      throw err;
    }
  }

  private static logTelemetry(
    toolId: string,
    agentRole: string,
    startTime: number,
    costUsd: number,
    status: 'success' | 'failed',
    error?: string,
    workflowId?: string
  ): void {
    const log: ToolTelemetryLog = {
      toolId,
      agentRole,
      workflowId,
      latencyMs: Date.now() - startTime,
      costUsd,
      status,
      error,
      timestamp: new Date().toISOString()
    };
    this.telemetryLogs.push(log);
    console.log(`[ToolTelemetry] ${status.toUpperCase()} | Tool: ${toolId} | Caller: ${agentRole} | Latency: ${log.latencyMs}ms | Cost: $${costUsd}`);
  }

  public static getTelemetryLogs(): ToolTelemetryLog[] {
    return [...this.telemetryLogs];
  }

  public static clearLogs(): void {
    this.telemetryLogs = [];
  }
}
