import React from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  Info, 
  Database, 
  Clock, 
  MapPin, 
  Users, 
  BrainCircuit,
  AlertCircle,
  TrendingUp,
  Box,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContextInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  contextData: {
    memory: number; // percentage
    timeline: number;
    people: number;
    places: number;
    assets: number;
    overallQuality: number;
  };
  sources: {
    type: 'memory' | 'timeline' | 'asset' | 'person' | 'place' | 'note';
    label: string;
    description: string;
    active: boolean;
  }[];
}

export const ContextInspector: React.FC<ContextInspectorProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  contextData,
  sources 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <BrainCircuit size={20} className="text-rose-400" />
                </div>
                <div>
                  <h2 className="font-black uppercase tracking-tighter text-lg">AI Context Inspector</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Engine 2.0 • Real-time Analysis</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              {/* Quality Score */}
              <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-slate-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={364}
                      strokeDashoffset={364 - (364 * contextData.overallQuality) / 100}
                      className="text-rose-500 transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900">{contextData.overallQuality}%</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Context Score</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900">Chất lượng ngữ cảnh: Tuyệt vời</h3>
                  <p className="text-xs text-slate-500 leading-relaxed px-4">
                    AI đã tập hợp đủ dữ liệu cần thiết để tạo nội dung chính xác và mang tính cá nhân hóa cao.
                  </p>
                </div>
              </div>

              {/* Data Breakdown */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={12} />
                  Context Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <StatItem label="Memory" value={contextData.memory} icon={<Database size={14} />} color="text-rose-500" />
                  <StatItem label="Timeline" value={contextData.timeline} icon={<Clock size={14} />} color="text-blue-500" />
                  <StatItem label="People" value={contextData.people} icon={<Users size={14} />} color="text-amber-500" />
                  <StatItem label="Places" value={contextData.places} icon={<MapPin size={14} />} color="text-emerald-500" />
                </div>
              </div>

              {/* Active Sources */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Box size={12} />
                  Active Context Sources
                </h4>
                <div className="space-y-3">
                  {sources.map((source, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        source.active 
                          ? 'bg-white border-slate-200 shadow-sm' 
                          : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-xl ${
                            source.active ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'
                          }`}>
                            <SourceIcon type={source.type} />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-slate-900">{source.label}</h5>
                            <p className="text-[11px] text-slate-500">{source.description}</p>
                          </div>
                        </div>
                        <button className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                          source.active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-300'
                        }`}>
                          <Check size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {contextData.assets < 50 && (
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-black text-amber-900 uppercase">AI Recommendation</h5>
                    <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                      "Bạn nên thêm ít nhất 2 hình ảnh vào Asset Manager để AI có thể mô tả sinh động hơn."
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={() => onConfirm ? onConfirm() : onClose()}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all"
              >
                Xác nhận ngữ cảnh
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const StatItem: React.FC<{ label: string, value: number, icon: React.ReactNode, color: string }> = ({ label, value, icon, color }) => (
  <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
    <div className="flex items-center gap-2 mb-2">
      <div className={`${color}`}>{icon}</div>
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <span className="text-xl font-black text-slate-900">{value}%</span>
      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')}`} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  </div>
);

const SourceIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'memory': return <Database size={16} />;
    case 'timeline': return <Clock size={16} />;
    case 'asset': return <Layers size={16} />;
    case 'person': return <Users size={16} />;
    case 'place': return <MapPin size={16} />;
    default: return <Sparkles size={16} />;
  }
};
