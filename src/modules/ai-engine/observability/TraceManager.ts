import { TraceContext } from './TraceContext';

export class TraceManager {
  public static startTrace(workflowId: string): TraceContext {
    return {
      traceId: `trace-${Date.now()}`,
      workflowId,
      sessionId: 'session-123',
      spanId: 'span-1'
    };
  }
}
