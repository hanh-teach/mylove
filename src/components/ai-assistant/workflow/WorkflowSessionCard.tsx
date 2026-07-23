import React from 'react';
import { WorkflowSessionViewModel } from './WorkflowViewModel';
import { Clock, Timer, CheckCircle2, PauseCircle, PlayCircle, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  session: WorkflowSessionViewModel;
}

export const WorkflowSessionCard: React.FC<Props> = ({ session }) => {
  const getStatusBadge = () => {
    switch (session.status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Running
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <PauseCircle size={14} />
            Paused
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={14} />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle size={14} />
            Cancelled
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={14} />
            Failed
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Goal</span>
          <h2 className="text-base font-semibold text-gray-900 mt-0.5">{session.goal}</h2>
          <p className="text-xs text-gray-400 font-mono mt-1">ID: {session.workflowId}</p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-gray-600">Overall Progress</span>
          <span className="font-semibold text-indigo-600">{session.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${session.progress}%` }}
          />
        </div>
      </div>

      {/* Time Stats */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
          <Clock size={16} className="text-indigo-500 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-medium">Elapsed</div>
            <div className="font-mono font-semibold text-gray-800">{session.elapsedTime}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 bg-gray-50/70 p-2.5 rounded-lg border border-gray-100">
          <Timer size={16} className="text-indigo-500 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-medium">ETA</div>
            <div className="font-mono font-semibold text-gray-800">{session.estimatedRemaining}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
