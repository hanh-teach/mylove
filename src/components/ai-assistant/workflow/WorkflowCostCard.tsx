import React from 'react';
import { CostBreakdown, TimeBreakdown } from './WorkflowViewModel';
import { DollarSign, Clock, Sparkles, Video, Image as ImageIcon } from 'lucide-react';

interface Props {
  costs: CostBreakdown;
  timeSummary: TimeBreakdown;
}

export const WorkflowCostCard: React.FC<Props> = ({ costs, timeSummary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Cost Summary */}
      <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign size={14} className="text-emerald-500" />
            Cost Summary
          </h3>
          <span className="text-xs font-bold text-emerald-600 font-mono">${costs.total.toFixed(4)}</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
            <span className="flex items-center gap-1.5 text-gray-600">
              <Sparkles size={12} className="text-indigo-500" /> Gemini
            </span>
            <span className="font-mono font-medium text-gray-800">${costs.gemini.toFixed(4)}</span>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
            <span className="flex items-center gap-1.5 text-gray-600">
              <Video size={12} className="text-blue-500" /> Runway
            </span>
            <span className="font-mono font-medium text-gray-800">${costs.runway.toFixed(4)}</span>
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
            <span className="flex items-center gap-1.5 text-gray-600">
              <ImageIcon size={12} className="text-amber-500" /> Fal
            </span>
            <span className="font-mono font-medium text-gray-800">${costs.fal.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Time Summary */}
      <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={14} className="text-indigo-500" />
            Time Summary
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="text-[10px] text-gray-400 font-medium">Planning</div>
            <div className="font-mono font-semibold text-gray-800">{timeSummary.planning}</div>
          </div>

          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="text-[10px] text-gray-400 font-medium">Memory</div>
            <div className="font-mono font-semibold text-gray-800">{timeSummary.memory}</div>
          </div>

          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="text-[10px] text-gray-400 font-medium">Letter</div>
            <div className="font-mono font-semibold text-gray-800">{timeSummary.letter}</div>
          </div>

          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="text-[10px] text-gray-400 font-medium">Image</div>
            <div className="font-mono font-semibold text-gray-800">{timeSummary.image}</div>
          </div>

          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="text-[10px] text-gray-400 font-medium">Video</div>
            <div className="font-mono font-semibold text-gray-800">{timeSummary.video}</div>
          </div>

          <div className="bg-gray-50 p-2 rounded border border-gray-100">
            <div className="text-[10px] text-gray-400 font-medium">Reflection</div>
            <div className="font-mono font-semibold text-gray-800">{timeSummary.reflection}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
