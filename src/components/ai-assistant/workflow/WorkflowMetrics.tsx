import React from 'react';
import { MetricsSummary } from './WorkflowViewModel';
import { Activity, CheckCircle2, Loader2, Clock, AlertTriangle } from 'lucide-react';

interface Props {
  metrics: MetricsSummary;
}

export const WorkflowMetrics: React.FC<Props> = ({ metrics }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
          <Activity size={14} className="text-indigo-500" />
          Mini Metrics
        </h3>
        <span className="text-xs font-bold text-gray-800 font-mono">Total: {metrics.totalTasks}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-emerald-600 font-medium uppercase">Completed</div>
            <div className="text-sm font-bold text-emerald-700 font-mono">{metrics.completed}</div>
          </div>
          <CheckCircle2 size={16} className="text-emerald-500" />
        </div>

        <div className="bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-indigo-600 font-medium uppercase">Running</div>
            <div className="text-sm font-bold text-indigo-700 font-mono">{metrics.running}</div>
          </div>
          <Loader2 size={16} className="text-indigo-500 animate-spin" />
        </div>

        <div className="bg-gray-50/80 p-2.5 rounded-lg border border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-500 font-medium uppercase">Waiting</div>
            <div className="text-sm font-bold text-gray-700 font-mono">{metrics.waiting}</div>
          </div>
          <Clock size={16} className="text-gray-400" />
        </div>

        <div className="bg-rose-50/60 p-2.5 rounded-lg border border-rose-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-rose-600 font-medium uppercase">Failed</div>
            <div className="text-sm font-bold text-rose-700 font-mono">{metrics.failed}</div>
          </div>
          <AlertTriangle size={16} className="text-rose-500" />
        </div>
      </div>
    </div>
  );
};
