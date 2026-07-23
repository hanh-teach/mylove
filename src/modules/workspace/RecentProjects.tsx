import React from 'react';
import { ArrowRight, Clock, Heart, Sparkles } from 'lucide-react';
import { AppTabType } from '../../components/shell/ApplicationShell';

interface RecentProjectsProps {
  onContinueEditing: () => void;
  onNavigateTab: (tab: AppTabType) => void;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  onContinueEditing,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-slate-900 text-base">Continue Editing</h3>
        <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">
          72% Completed
        </span>
      </div>

      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Background glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-xs">
              Active Project
            </span>
            <span className="text-xs text-rose-100 flex items-center gap-1">
              <Clock size={12} /> Edited 5 minutes ago
            </span>
          </div>
          <h2 className="font-serif text-2xl font-bold tracking-tight">Annual Celebration & Gratitude Letter</h2>
          <p className="text-xs text-rose-100 max-w-xl leading-relaxed">
            "Xin gửi lời cảm ơn chân thành nhất vì đã luôn đồng hành, chia sẻ và mang lại những kỉ niệm tuyệt vời nhất trên hành trình này..."
          </p>
        </div>

        <button
          onClick={onContinueEditing}
          className="z-10 px-6 py-3 rounded-2xl bg-white hover:bg-rose-50 text-rose-900 font-bold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0 group"
        >
          <span>Continue</span>
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
