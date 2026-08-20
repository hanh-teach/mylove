import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { WorkflowNode, WorkflowEdge } from './WorkflowTypes';

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (node: WorkflowNode) => void;
  addEdge: (edge: WorkflowEdge) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set) => ({
          nodes: [],
          edges: [],
          setNodes: (nodes) => set({ nodes }),
          setEdges: (edges) => set({ edges }),
          addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
          addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
        }),
        {
          name: 'lovenote_workflow_v1',
          partialize: (state) => ({
            nodes: state.nodes,
            edges: state.edges,
          }),
        }
      ),
      { name: 'WorkflowStore' }
    )
  )
);

// Atomic Selectors
export const selectWorkflowNodes = (state: WorkflowState) => state.nodes;
export const selectWorkflowEdges = (state: WorkflowState) => state.edges;

// Custom Selector Hooks
export const useWorkflowNodes = () => useWorkflowStore(selectWorkflowNodes);
export const useWorkflowEdges = () => useWorkflowStore(selectWorkflowEdges);
