import React from 'react';
import { WorkflowStatus } from './WorkflowViewModel';
import { CheckCircle2, PauseCircle, Play, Square, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface Props {
  workflowId: string;
  goal: string;
  status: WorkflowStatus;
  startedAt: string;
  onReset: () => void;
}

export const WorkflowSessionHeader: React.FC<Props> = ({
  workflowId,
  goal,
  status,
  startedAt,
  onReset
}) => {
  const renderStatusBadge = () => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Running
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <PauseCircle size={14} />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={14} />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <Square size={14} />
            Cancelled
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={14} />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-500 border border-gray-200">
            Idle
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-mono">
              {workflowId}
            </span>
            <span className="text-[10px] font-medium text-gray-400">v1.0</span>
            <span className="text-[10px] text-gray-400 font-mono">Started {startedAt}</span>
          </div>
          <h2 className="text-base font-bold text-gray-900 mt-1">{goal}</h2>
        </div>

        <div className="flex items-center gap-2">
          {renderStatusBadge()}
          <button
            onClick={onReset}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
            title="Reset / New Workflow"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
