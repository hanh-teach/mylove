import React from 'react';
import { WorkflowProgressState } from '../../hooks/useWorkflowProgress';
import { Activity, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface WorkflowRuntimeStatusProps {
  state: WorkflowProgressState;
  elapsedMs: number;
}

export const WorkflowRuntimeStatus: React.FC<WorkflowRuntimeStatusProps> = ({ state, elapsedMs }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!state.isActive && state.status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500 space-y-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800/50">
        <Activity className="w-8 h-8 opacity-50" />
        <span className="text-sm font-medium">No workflow executed.</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 space-y-4">
      {state.status === 'running' && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="font-medium truncate max-w-[200px]">{state.currentTaskName || 'Running...'}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-gray-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(elapsedMs)}</span>
          </div>
        </div>
      )}

      {state.status === 'completed' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Workflow Complete</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                {(state.durationMs / 1000).toFixed(1)}s
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</div>
              <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                Success
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
