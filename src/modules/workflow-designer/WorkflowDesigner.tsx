import React from 'react';
import { WorkflowCanvas } from './WorkflowCanvas';
import { NodePalette } from './NodePalette';
import { PropertyPanel } from './PropertyPanel';

export const WorkflowDesigner: React.FC = () => {
  return (
    <div className="flex h-screen w-full">
      <NodePalette />
      <div className="flex-grow relative">
        <WorkflowCanvas />
      </div>
      <PropertyPanel />
    </div>
  );
};
