export interface AgentMessage {
  id: string;
  sender: string;
  receiver: string;
  type: 'REQUEST' | 'RESPONSE' | 'PROPOSE' | 'REJECT' | 'VOTE' | 'COMPLETE';
  workflowId: string;
  taskId?: string;
  payload: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  traceId: string;
  timestamp: string;
}
