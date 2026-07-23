import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Plus, 
  Play, 
  Settings, 
  Trash2, 
  History, 
  MousePointer, 
  StopCircle,
  Archive,
  ChevronRight,
  MoreVertical,
  Star,
  Clock,
  Sparkles,
  LayoutGrid,
  List,
  ShieldCheck,
  ChevronDown,
  Activity
} from 'lucide-react';
import { automationService } from '../../modules/automation/AutomationService';
import { IAutomation } from '../../modules/automation/AutomationTypes';

export const AutomationDashboard: React.FC = () => {
  const [automations, setAutomations] = useState<IAutomation[]>(automationService.getAutomations());
  const [isRecording, setIsRecording] = useState(automationService.getRecordingStatus().isRecording);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRecording(automationService.getRecordingStatus().isRecording);
      setAutomations(automationService.getAutomations());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRunAutomation = (auto: IAutomation) => {
    // In real app, launch execution panel
    console.log(`Running automation: ${auto.title}`);
  };

  const handleStartRecording = () => {
    automationService.startRecording();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    const name = prompt('Tên cho Automation mới này?', 'Ghi lại mới');
    if (name) {
      automationService.stopRecording(name);
      setIsRecording(false);
      setAutomations(automationService.getAutomations());
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header section with Recorder and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Zap size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
                  Automation Engine 1.0
                </div>
                {isRecording && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/20 text-rose-400 rounded-full border border-rose-500/30 text-[9px] font-bold uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                    Recording Macro...
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">Tự động hóa Quy trình</h2>
              <p className="text-slate-300 text-sm font-medium max-w-lg">
                Thiết lập các chuỗi hành động thông minh để tối ưu hóa thời gian sáng tạo của bạn.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              {isRecording ? (
                <button 
                  onClick={handleStopRecording}
                  className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-rose-500/40 transition-all flex items-center gap-2"
                >
                  <StopCircle size={18} />
                  Stop Recording
                </button>
              ) : (
                <button 
                  onClick={handleStartRecording}
                  className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <MousePointer size={18} />
                  Record Macro
                </button>
              )}
              <button className="px-6 py-3 bg-white/10 text-white border border-white/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center gap-2">
                <Plus size={18} />
                New Workflow
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
           <div className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> Automation Stats
              </h3>
              <div className="space-y-4">
                <StatItem label="Tổng số lần chạy" value="128" />
                <StatItem label="Thời gian tiết kiệm" value="4.2 Giờ" />
                <StatItem label="Automation Library" value={automations.length.toString()} />
              </div>
           </div>
           <button className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all">
             Xem báo cáo chi tiết
           </button>
        </div>
      </div>

      {/* Automation Library Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Automation Library</h3>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
             <input 
               type="text" 
               placeholder="Tìm kiếm automation..." 
               className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
             />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {automations.map((auto) => (
              <AutomationCard 
                key={auto.id} 
                automation={auto} 
                onRun={() => handleRunAutomation(auto)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm"
          >
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Automation</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Steps</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Run</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Runs</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {automations.map((auto) => (
                  <tr key={auto.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                           <Zap size={18} />
                         </div>
                         <div>
                           <div className="text-sm font-black text-slate-900">{auto.title}</div>
                           <div className="text-[10px] text-slate-400 font-medium">{auto.description}</div>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="px-2 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                         {auto.steps.length} Steps
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs text-slate-500 font-medium">Vừa xong</span>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs text-slate-900 font-black">{auto.runCount}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button onClick={() => handleRunAutomation(auto)} className="p-2 hover:bg-slate-900 hover:text-white rounded-lg transition-all">
                           <Play size={16} />
                         </button>
                         <button className="p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-all">
                           <Trash2 size={16} />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    <span className="text-sm font-black text-slate-900">{value}</span>
  </div>
);

const AutomationCard: React.FC<{ automation: IAutomation, onRun: () => void }> = ({ automation, onRun }) => (
  <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between h-[240px]">
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-slate-100 text-slate-900`}>
          <Zap size={22} />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="p-2 text-slate-400 hover:text-amber-500">
             <Star size={16} />
           </button>
           <button className="p-2 text-slate-400 hover:text-slate-900">
             <MoreVertical size={16} />
           </button>
        </div>
      </div>
      <div>
        <h3 className="font-black text-lg tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors">{automation.title}</h3>
        <p className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-2">
          {automation.description}
        </p>
      </div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {automation.tags.slice(0, 2).map((tag, i) => (
            <div key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest">
              {tag}
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-slate-400">{automation.steps.length} Steps</span>
      </div>
      <button 
        onClick={onRun}
        className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-slate-900/30 hover:scale-105 transition-all"
      >
        <Play size={16} fill="currentColor" />
      </button>
    </div>
  </div>
);
