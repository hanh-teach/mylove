import React from 'react';
import { TimelineItem } from './WorkflowViewModel';
import { Terminal, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  timeline: TimelineItem[];
}

export const WorkflowTimeline: React.FC<Props> = ({ timeline }) => {
  const getIcon = (level: TimelineItem['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={12} className="text-amber-500 flex-shrink-0" />;
      case 'error':
        return <XCircle size={12} className="text-rose-500 flex-shrink-0" />;
      case 'info':
      default:
        return <Info size={12} className="text-indigo-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <Terminal size={14} className="text-gray-500" />
          Execution Timeline
        </div>
        <span className="text-[10px] text-gray-400 font-mono">{timeline.length} Events</span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {timeline.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 text-xs bg-gray-50/80 p-2 rounded-lg border border-gray-100/60"
          >
            <span className="text-[10px] text-gray-400 font-mono mt-0.5 flex-shrink-0">{item.timestamp}</span>
            <div className="mt-0.5">{getIcon(item.level)}</div>
            <span className="text-gray-700 leading-snug flex-1">{item.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
