import React from 'react';
import { Loader2 } from 'lucide-react';

interface DashboardSkeletonProps {
  title?: string;
  variant?: 'default' | 'editor' | 'simple';
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ 
  title = 'Đang tải dữ liệu...',
  variant = 'default' 
}) => {
  if (variant === 'editor') {
    return (
      <div className="w-full h-[calc(100vh-3.5rem)] bg-slate-900 flex flex-col items-center justify-center p-6 space-y-4 text-white animate-pulse">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        <p className="text-sm font-bold text-slate-300">Đang khởi tạo Studio Editor 4.0...</p>
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-rose-500 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse z-10">

      {/* Top Banner Skeleton */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-[32px] p-8 sm:p-10 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between gap-6">
        <div className="space-y-4 max-w-xl">
          <div className="h-4 w-32 bg-rose-200/60 dark:bg-rose-950/60 rounded-full" />
          <div className="h-8 w-3/4 bg-slate-200/80 dark:bg-slate-800 rounded-2xl" />
          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="h-10 w-28 bg-rose-500/20 rounded-xl" />
          <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/60 dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200/80 dark:bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-slate-200/80 dark:bg-slate-800 rounded-md" />
                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
              </div>
            </div>
            <div className="h-16 w-full bg-slate-100/80 dark:bg-slate-800/40 rounded-2xl" />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4 text-xs font-semibold text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
        <span>{title}</span>
      </div>
    </div>
  );
};

export default DashboardSkeleton;

