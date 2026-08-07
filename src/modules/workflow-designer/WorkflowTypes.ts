export interface WorkflowNode {
  id: string;
  type: string;
  data: Record<string, any>;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowDesignerState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata: Record<string, any>;
}
