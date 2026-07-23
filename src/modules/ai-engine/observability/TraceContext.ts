export interface TraceContext {
  traceId: string;
  workflowId: string;
  sessionId: string;
  spanId: string;
  parentId?: string;
}
