import React from 'react';
import { WorkflowStatus } from './WorkflowViewModel';
import { Pause, Play, Square, RotateCcw } from 'lucide-react';

interface Props {
  status: WorkflowStatus;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRetry: () => void;
}

export const WorkflowControls: React.FC<Props> = ({
  status,
  onPause,
  onResume,
  onCancel,
  onRetry
}) => {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Controls</span>

      <div className="flex items-center gap-2">
        {status === 'running' && (
          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Pause size={14} />
            Pause
          </button>
        )}

        {status === 'paused' && (
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Play size={14} />
            Resume
          </button>
        )}

        {(status === 'running' || status === 'paused') && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Square size={14} />
            Cancel
          </button>
        )}

        {(status === 'failed' || status === 'cancelled' || status === 'completed') && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            <RotateCcw size={14} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
};
