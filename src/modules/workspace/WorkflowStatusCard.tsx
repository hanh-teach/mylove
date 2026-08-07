import React from 'react';
import { Wand2, Play, Pause, CheckCircle2, RefreshCw } from 'lucide-react';

interface WorkflowStatusCardProps {
  onOpenWorkflow: () => void;
}

export const WorkflowStatusCard: React.FC<WorkflowStatusCardProps> = ({ onOpenWorkflow }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Wand2 size={18} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Active AI Workflow</h4>
            <p className="text-[11px] text-slate-500">Story & Media Pipeline</p>
          </div>
        </div>
        <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
          Running (45%)
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          <span>Current Step: Generate Images</span>
          <span>45%</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '45%' }} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500">Provider: Fal AI / Imagen 3</span>
        <button
          onClick={onOpenWorkflow}
          className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
        >
          <span>View Progress</span>
          <RefreshCw size={12} />
        </button>
      </div>
    </div>
  );
};
