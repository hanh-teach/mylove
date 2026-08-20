import React from 'react';
import { Clock, Timer } from 'lucide-react';

interface Props {
  progress: number;
  elapsedTime: string;
  estimatedRemaining: string;
}

export const WorkflowProgress: React.FC<Props> = ({
  progress,
  elapsedTime,
  estimatedRemaining
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Runtime Progress
        </span>
        <span className="text-sm font-bold text-indigo-600 font-mono">{progress}%</span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200/50">
        <div
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
          <Clock size={16} className="text-indigo-500 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Elapsed</div>
            <div className="font-mono font-bold text-gray-800">{elapsedTime}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
          <Timer size={16} className="text-indigo-500 flex-shrink-0" />
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">ETA</div>
            <div className="font-mono font-bold text-gray-800">{estimatedRemaining}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
