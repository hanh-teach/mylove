import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Sparkles, ShieldCheck, Layers, FileText, CheckCircle2, 
  BarChart2, Compass, Cpu, Globe, Key, Lock, Rocket, Award, Download, 
  Share2, Activity, ArrowRight, ChevronRight, PieChart, Users, RefreshCw
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { mpsService } from '../../modules/mps/MpsService';
import { MpsVolume } from '../../modules/mps/types';

export const MpsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'volumes' | 'data_driven' | 'roadmap_2_0'>('volumes');
  const volumes = mpsService.getMpsVolumes();
  const telemetry = mpsService.getTelemetryData();
  const [selectedVol, setSelectedVol] = useState<MpsVolume>(volumes[0]);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-3xl p-8 border border-rose-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Award size={16} />
              <span>Canonical Single Source of Truth</span>
            </div>
            <Typography variant="h2" className="text-white tracking-tighter">
              LoveNote Master Product Specification (MPS) v1.0
            </Typography>
            <Typography variant="body" className="text-slate-300 mt-2 max-w-3xl">
              Chuyển đổi chiến lược từ Sprint Development sang Quản trị Sản phẩm Bền vững (Product Evolution). 8 Volumes chuẩn hóa toàn bộ tầm nhìn, kiến trúc và quy trình vận hành.
            </Typography>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-md text-center">
              <div className="text-2xl font-black text-rose-400">8 / 8</div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">Volumes Approved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <TabButton 
          active={activeTab === 'volumes'} 
          onClick={() => setActiveTab('volumes')} 
          label="8 Volumes Specification" 
          icon={<BookOpen size={16} />} 
        />
        <TabButton 
          active={activeTab === 'data_driven'} 
          onClick={() => setActiveTab('data_driven')} 
          label="Data-Driven Product Discovery" 
          icon={<BarChart2 size={16} />} 
        />
        <TabButton 
          active={activeTab === 'roadmap_2_0'} 
          onClick={() => setActiveTab('roadmap_2_0')} 
          label="Product Evolution Strategy" 
          icon={<Compass size={16} />} 
        />
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: 8 VOLUMES */}
        {activeTab === 'volumes' && (
          <motion.div key="vols" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar Volumes List */}
            <div className="lg:col-span-4 space-y-3">
              <Typography variant="h4" className="text-slate-900 mb-2">Danh mục Master Volumes</Typography>
              {volumes.map(vol => (
                <button
                  key={vol.id}
                  onClick={() => setSelectedVol(vol)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    selectedVol.id === vol.id ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-500/20' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      selectedVol.id === vol.id ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      V{vol.volumeNumber}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm line-clamp-1">{vol.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{vol.subtitle}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className={selectedVol.id === vol.id ? 'text-rose-500' : 'text-slate-400'} />
                </button>
              ))}
            </div>

            {/* Main Specification Reader */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                    Volume {selectedVol.volumeNumber} Specification
                  </span>
                  <Typography variant="h3" className="text-slate-900 mt-2">{selectedVol.title}</Typography>
                  <p className="text-xs text-slate-500 mt-1">{selectedVol.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Approved Canonical
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                "{selectedVol.summary}"
              </div>

              <div className="space-y-6">
                {selectedVol.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Sparkles size={16} className="text-rose-500" /> {sec.heading}
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600 pl-4 border-l-2 border-rose-200">
                      {sec.details.map((d, dIdx) => (
                        <li key={dIdx} className="leading-relaxed">{d}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 2: DATA DRIVEN PRODUCT DISCOVERY */}
        {activeTab === 'data_driven' && (
          <motion.div key="data" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div>
              <Typography variant="h3" className="text-slate-900 mb-1">Data-Driven Continuous Product Discovery</Typography>
              <Typography variant="body-sm" className="text-slate-500 mb-6">
                Mọi quyết định cải tiến phiên bản 1.1+ đều dựa trên dữ liệu sử dụng thực tế của người dùng.
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {telemetry.map((item, idx) => (
                <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-900 text-sm">{item.moduleName}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.trend === 'up' ? 'bg-emerald-100 text-emerald-800' : item.trend === 'stable' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.trend === 'up' ? 'Tăng trưởng' : item.trend === 'stable' ? 'Ổn định' : 'Cần tối ưu'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mt-4">
                      <div>
                        <div className="text-3xl font-black text-slate-900">{item.usagePercentage}%</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">Tỷ lệ người dùng ({item.activeUsersCount.toLocaleString()} DAU)</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-amber-600">★ {item.satisfactionScore} / 5.0</div>
                        <div className="text-[10px] text-slate-400">Đánh giá hài lòng</div>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full rounded-full ${item.usagePercentage < 30 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                        style={{ width: `${item.usagePercentage}%` }} 
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                    <span className="font-bold text-slate-900">Đề xuất PLM:</span> {item.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: ROADMAP 2.0 & GOVERNANCE */}
        {activeTab === 'roadmap_2_0' && (
          <motion.div key="rm2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <Typography variant="h3" className="text-slate-900 mb-1">Mô hình Quản trị LoveNote Roadmap 2.0</Typography>
              <Typography variant="body-sm" className="text-slate-500">Chuyển từ đánh số Sprint sang mô hình Vision → OKRs → Releases → Continuous Feedback.</Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100 text-center space-y-2">
                <Compass className="mx-auto text-rose-500" size={28} />
                <div className="font-bold text-slate-900 text-sm">1. Vision & Strategy</div>
                <div className="text-xs text-slate-500">Định hướng giá trị cốt lõi sản phẩm</div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                <BarChart2 className="mx-auto text-blue-500" size={28} />
                <div className="font-bold text-slate-900 text-sm">2. Objectives & KRs</div>
                <div className="text-xs text-slate-500">Mục tiêu đo lường theo từng quý</div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                <Rocket className="mx-auto text-emerald-500" size={28} />
                <div className="font-bold text-slate-900 text-sm">3. Feature Releases</div>
                <div className="text-xs text-slate-500">Phát hành v1.1, v1.2, v2.0</div>
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-2">
                <RefreshCw className="mx-auto text-purple-500" size={28} />
                <div className="font-bold text-slate-900 text-sm">4. Continuous Feedback</div>
                <div className="text-xs text-slate-500">Học hỏi & cải tiến liên tục</div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`pb-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
      active ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);
