import React from 'react';
import { WorkflowTaskViewModel } from './WorkflowViewModel';
import { Cpu, Zap, RefreshCw, Layers } from 'lucide-react';

interface Props {
  task: WorkflowTaskViewModel | null;
}

export const WorkflowTaskCard: React.FC<Props> = ({ task }) => {
  if (!task) {
    return (
      <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm text-center text-gray-400 text-xs">
        No active task.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Current Task</span>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100">
          ID: {task.id}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
      </div>

      {/* Task Execution Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-100">
        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase mb-0.5">
            <Cpu size={12} className="text-indigo-500" />
            Provider
          </div>
          <div className="font-semibold text-gray-800 truncate">{task.provider}</div>
        </div>

        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase mb-0.5">
            <Zap size={12} className="text-amber-500" />
            Latency
          </div>
          <div className="font-semibold text-gray-800 font-mono">{task.latency}</div>
        </div>

        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase mb-0.5">
            <Layers size={12} className="text-emerald-500" />
            Progress
          </div>
          <div className="font-semibold text-gray-800 font-mono">{task.progress}%</div>
        </div>

        <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-xs">
          <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase mb-0.5">
            <RefreshCw size={12} className="text-blue-500" />
            Retry
          </div>
          <div className="font-semibold text-gray-800 font-mono">{task.retryCount}</div>
        </div>
      </div>
    </div>
  );
};
