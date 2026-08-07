import React from 'react';
import { Sparkles, Wand2, Scissors, Expand, CheckCheck, Languages } from 'lucide-react';
import { WritingActionType } from '../../ai-engine/writing/WritingRequest';

interface WritingActionCardProps {
  action: WritingActionType;
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const WritingActionCard: React.FC<WritingActionCardProps> = ({
  label,
  description,
  icon,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left p-3 rounded-xl border border-rose-100 bg-white hover:bg-rose-50/60 hover:border-rose-300 shadow-xs transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-xs sm:text-sm text-rose-950 truncate">{label}</h4>
        <p className="text-[11px] text-slate-500 truncate">{description}</p>
      </div>
    </button>
  );
};
