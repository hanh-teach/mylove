import React from 'react';
import { ProviderStatus } from './WorkflowViewModel';
import { Sparkles, Video, Image as ImageIcon, Cpu } from 'lucide-react';

interface Props {
  providers: ProviderStatus[];
}

export const WorkflowProviderMonitor: React.FC<Props> = ({ providers }) => {
  const getProviderIcon = (name: string) => {
    if (name.includes('Gemini')) return <Sparkles size={14} className="text-indigo-500" />;
    if (name.includes('Runway')) return <Video size={14} className="text-blue-500" />;
    if (name.includes('Fal')) return <ImageIcon size={14} className="text-amber-500" />;
    return <Cpu size={14} className="text-emerald-500" />;
  };

  const getStatusBadge = (status: ProviderStatus['status']) => {
    switch (status) {
      case 'running':
        return (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
            </span>
            Running
          </span>
        );
      case 'completed':
        return (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
            Completed
          </span>
        );
      case 'idle':
        return (
          <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
            Idle
          </span>
        );
      case 'waiting':
      default:
        return (
          <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
            Waiting
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Provider Monitor
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {providers.map((p) => (
          <div key={p.name} className="bg-gray-50/80 p-2.5 rounded-lg border border-gray-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                {getProviderIcon(p.name)}
                <span>{p.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-gray-200/50">
              {getStatusBadge(p.status)}
              <span className="font-mono text-[10px] text-gray-400">{p.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
