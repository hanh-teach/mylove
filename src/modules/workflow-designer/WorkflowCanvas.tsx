import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Connection,
  OnConnect,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowNodes, useWorkflowEdges, useWorkflowStore } from './WorkflowStore';

export const WorkflowCanvas: React.FC = () => {
  const nodes = useWorkflowNodes();
  const edges = useWorkflowEdges();

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      useWorkflowStore.getState().addEdge({
        id: params.source + '-' + params.target,
        source: params.source!,
        target: params.target!,
      });
    },
    []
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
