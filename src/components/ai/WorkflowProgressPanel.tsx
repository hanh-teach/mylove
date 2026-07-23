import React from 'react';
import { useWorkflowProgress } from '../../hooks/useWorkflowProgress';
import { WorkflowProgressItem } from './WorkflowProgressItem';
import { WorkflowProgressBar } from './WorkflowProgressBar';
import { WorkflowRuntimeStatus } from './WorkflowRuntimeStatus';
import { Play, Square, RotateCcw, Pause } from 'lucide-react';
import { runtimeEngine } from '../../modules/ai-engine/runtime/RuntimeEngine';

export const WorkflowProgressPanel: React.FC = () => {
  const { elapsedMs, ...state } = useWorkflowProgress();

  if (!state.isActive) {
    return (
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-6">
          Workflow Status
        </h3>
        <WorkflowRuntimeStatus state={state} elapsedMs={elapsedMs} />
      </div>
    );
  }

  const handleCancel = () => {
    if (state.sessionId) {
      runtimeEngine.cancelSession(state.sessionId);
    }
  };

  const handleRetry = () => {
    // In a real app we would pass the original goal. For now, this is demo-only logic.
    runtimeEngine.runGoal('Retry workflow');
  };

  return (
    <div className="p-6 flex flex-col h-full overflow-y-auto relative">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
            Workflow Status
          </h3>
          {state.workflowId && (
            <p className="text-xs text-gray-500 font-mono truncate" title={state.workflowId}>
              ID: {state.workflowId}
            </p>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {state.status === 'running' && (
            <button
              onClick={handleCancel}
              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
              title="Stop Workflow"
            >
              <Square size={16} fill="currentColor" />
            </button>
          )}
          {(state.status === 'failed' || state.status === 'cancelled') && (
            <button
              onClick={handleRetry}
              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
              title="Retry Workflow"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-1 mb-8">
        {state.pipeline.map(task => (
          <WorkflowProgressItem key={task.id} task={task} />
        ))}
      </div>

      <div className="mt-auto space-y-6">
        <WorkflowProgressBar progress={state.progressPercent} />
        <WorkflowRuntimeStatus state={state} elapsedMs={elapsedMs} />
      </div>
    </div>
  );
};
