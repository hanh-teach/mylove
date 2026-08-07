import React from 'react';
import { 
  Check, 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Database, 
  Clock, 
  Layers,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IProposedChange } from '../../modules/ai/AgentTypes';

interface ReviewCenterProps {
  isOpen: boolean;
  onClose: () => void;
  changes: IProposedChange[];
  onApproveAll: () => void;
  onApproveChange: (id: string) => void;
  onRejectChange: (id: string) => void;
}

export const ReviewCenter: React.FC<ReviewCenterProps> = ({
  isOpen,
  onClose,
  changes,
  onApproveAll,
  onApproveChange,
  onRejectChange
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col border-l border-slate-200"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles size={20} className="text-rose-400" />
          </div>
          <div>
            <h2 className="font-black uppercase tracking-tighter text-lg">Review Center</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Xác nhận thay đổi từ AI</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex gap-3">
          <AlertCircle size={20} className="text-rose-500 shrink-0" />
          <p className="text-[11px] text-rose-800 font-medium leading-relaxed">
            AI đề xuất {changes.length} thay đổi. Vui lòng kiểm tra kỹ trước khi áp dụng vào Project của bạn.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proposed Changes</h3>
          {changes.map((change, idx) => (
            <motion.div
              key={change.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${getChangeTypeColor(change.type)}`}>
                    {getChangeTypeIcon(change.type)}
                  </div>
                  <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    {change.entityType} • {change.type}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onRejectChange(change.id)} className="p-1.5 hover:bg-rose-100 text-rose-500 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                  <button onClick={() => onApproveChange(change.id)} className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors">
                    <Check size={14} />
                  </button>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-700 leading-relaxed">{change.description}</p>

              {change.newData && (
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                   <div className="text-[8px] font-black text-slate-400 uppercase mb-2">New Data Preview</div>
                   <pre className="text-[9px] font-mono text-slate-600 overflow-x-auto">
                     {JSON.stringify(change.newData, null, 2)}
                   </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50">
        <button 
          onClick={onApproveAll}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Check size={16} />
          Chấp nhận tất cả ({changes.length})
        </button>
      </div>
    </motion.div>
  );
};

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case 'add': return <Plus size={12} />;
    case 'edit': return <Edit2 size={12} />;
    case 'delete': return <Trash2 size={12} />;
    default: return <ChevronRight size={12} />;
  }
};

const getChangeTypeColor = (type: string) => {
  switch (type) {
    case 'add': return 'bg-emerald-100 text-emerald-600';
    case 'edit': return 'bg-blue-100 text-blue-600';
    case 'delete': return 'bg-rose-100 text-rose-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};
