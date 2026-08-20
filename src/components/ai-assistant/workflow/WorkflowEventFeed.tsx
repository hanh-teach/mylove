import React, { useEffect, useRef } from 'react';
import { TimelineItem } from './WorkflowViewModel';
import { Terminal, CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  events: TimelineItem[];
}

export const WorkflowEventFeed: React.FC<Props> = ({ events }) => {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events.length]);

  const getIcon = (level: TimelineItem['level']) => {
    switch (level) {
      case 'success':
        return <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />;
      case 'error':
        return <XCircle size={13} className="text-rose-500 flex-shrink-0" />;
      case 'info':
      default:
        return <Info size={13} className="text-indigo-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Terminal size={14} className="text-gray-500" />
          Runtime Event Feed
        </div>
        <span className="text-[10px] text-gray-400 font-mono">{events.length} Events</span>
      </div>

      <div ref={feedRef} className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="flex items-start gap-2 text-xs bg-gray-50/90 p-2.5 rounded-lg border border-gray-100"
          >
            <span className="text-[10px] text-gray-400 font-mono mt-0.5 flex-shrink-0">
              {ev.timestamp}
            </span>
            <div className="mt-0.5">{getIcon(ev.level)}</div>
            <span className="text-gray-800 leading-relaxed font-sans">{ev.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
