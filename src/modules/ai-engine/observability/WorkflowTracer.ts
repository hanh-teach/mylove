import { TraceManager } from './TraceManager';

export class WorkflowTracer {
  public static trace(workflowId: string, action: () => Promise<any>): Promise<any> {
    const context = TraceManager.startTrace(workflowId);
    console.log(`[WorkflowTracer] Tracing workflow ${workflowId} with TraceID: ${context.traceId}`);
    return action();
  }
}
