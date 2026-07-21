export interface WorkflowContext {
  id: string;
  workflowId: string;
  data: Record<string, any>;
  history: any[];
}
