import React from 'react';
import { IAITask } from './types';
import { ListOrdered, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface TaskQueuePanelProps {
  tasks: IAITask[];
  onSelectTask: (task: IAITask) => void;
}

export const TaskQueuePanel: React.FC<TaskQueuePanelProps> = ({ tasks, onSelectTask }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-rose-500 text-white shadow-xs">
            <ListOrdered size={18} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-800">Hàng đợi tác vụ (Task Queue)</h3>
            <p className="text-[11px] text-slate-500">Tiến trình thực thi các tác vụ sinh nội dung AI</p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-400">
          {tasks.length} Tác vụ
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400">
          Chưa có tác vụ nào trong hàng đợi.
        </div>
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5">
                {task.status === 'in_progress' && (
                  <Loader2 size={16} className="text-rose-500 animate-spin shrink-0" />
                )}
                {task.status === 'completed' && (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                )}
                {task.status === 'pending' && (
                  <Clock size={16} className="text-amber-500 shrink-0" />
                )}
                {task.status === 'failed' && (
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                )}

                <div>
                  <h4 className="font-bold text-slate-800">{task.title}</h4>
                  <div className="text-[10px] text-slate-400">
                    {new Date(task.startedAt).toLocaleTimeString()} • {task.estimatedCost} • ~{task.estimatedTokens} tokens
                  </div>
                </div>
              </div>

              {/* Progress & Status */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                {task.status === 'in_progress' && (
                  <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                )}

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    task.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : task.status === 'in_progress'
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : task.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {task.status === 'completed' && 'Hoàn thành'}
                  {task.status === 'in_progress' && `Đang chạy (${task.progress}%)`}
                  {task.status === 'pending' && 'Chờ xử lý'}
                  {task.status === 'failed' && 'Thất bại'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
