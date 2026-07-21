import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
  OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from './WorkflowStore';

export const WorkflowCanvas: React.FC = () => {
  const { nodes, edges, setNodes, setEdges, addEdge: addWorkflowEdge } = useWorkflowStore();

  const onConnect: OnConnect = useCallback(
    (params: Connection) => addWorkflowEdge({
        id: params.source + '-' + params.target,
        source: params.source!,
        target: params.target!
    }),
    [addWorkflowEdge]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
