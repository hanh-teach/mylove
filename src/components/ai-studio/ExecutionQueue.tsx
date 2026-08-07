import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Clock, 
  Play, 
  AlertCircle, 
  MoreHorizontal,
  ChevronRight,
  Loader2,
  Trash2,
  Check
} from 'lucide-react';
import { ITask, TaskStatus } from '../../modules/ai/AgentTypes';

interface ExecutionQueueProps {
  tasks: ITask[];
  onApproveTask: (taskId: string) => void;
  onRejectTask: (taskId: string) => void;
}

export const ExecutionQueue: React.FC<ExecutionQueueProps> = ({ 
  tasks,
  onApproveTask,
  onRejectTask
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Queue</h3>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {tasks.filter(t => t.status === 'completed').length}/{tasks.length} Done
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-4 rounded-2xl border transition-all ${getStatusStyles(task.status)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  {getStatusIcon(task.status)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-none">{task.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight">{task.description}</p>
                </div>
              </div>
              
              {task.status === 'waiting_approval' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => onRejectTask(task.id)}
                    className="p-1.5 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button 
                    onClick={() => onApproveTask(task.id)}
                    className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    <Check size={14} />
                  </button>
                </div>
              )}
            </div>

            {task.status === 'running' && (
              <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-slate-900"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'pending': return <Clock size={16} className="text-slate-300" />;
    case 'running': return <Loader2 size={16} className="text-slate-900 animate-spin" />;
    case 'waiting_approval': return <AlertCircle size={16} className="text-amber-500" />;
    case 'completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
    case 'failed': return <AlertCircle size={16} className="text-rose-500" />;
    default: return <MoreHorizontal size={16} className="text-slate-300" />;
  }
};

const getStatusStyles = (status: TaskStatus) => {
  switch (status) {
    case 'pending': return 'bg-white border-slate-100 opacity-60';
    case 'running': return 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900';
    case 'waiting_approval': return 'bg-amber-50 border-amber-200 shadow-sm';
    case 'completed': return 'bg-emerald-50/30 border-emerald-100 opacity-80';
    case 'failed': return 'bg-rose-50 border-rose-100';
    default: return 'bg-white border-slate-100';
  }
};
