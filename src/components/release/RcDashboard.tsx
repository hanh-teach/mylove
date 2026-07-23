import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, CheckCircle2, Zap, AlertTriangle, 
  Activity, Gauge, FileCheck, Layers, PackageCheck, Terminal,
  Server, Cpu, Award, BadgeCheck, Play, ArrowRight, ShieldAlert,
  HardDrive, Smartphone, Monitor, BookOpen, Scale
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { rcService } from '../../modules/release/RcService';

export const RcDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gonogo' | 'freezes' | 'kpis' | 'regression' | 'security' | 'disaster' | 'packages'>('gonogo');
  
  const freezes = rcService.getFreezes();
  const kpis = rcService.getKpis();
  const regression = rcService.getRegressionTests();
  const security = rcService.getSecurityAudit();
  const packages = rcService.getStorePackages();
  const disaster = rcService.getDisasterRecovery();
  const decision = rcService.getGoNoGoDecision();

  const totalTestCases = regression.reduce((acc, curr) => acc + curr.testCasesCount, 0);
  const totalPassed = regression.reduce((acc, curr) => acc + curr.passedCount, 0);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-80" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-80" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">
              <BadgeCheck size={16} />
              <span>Release Engineering • Sprint 92 (Release Candidate)</span>
            </div>
            <Typography variant="h2" className="text-white tracking-tighter">
              Launch Readiness & Certification
            </Typography>
            <Typography variant="body" className="text-slate-400 mt-2 max-w-2xl">
              Xác nhận tính đóng hoàn toàn (Product Freeze), kiểm thử hồi quy 100%, bảo mật và đánh giá quyết định Go / No-Go trước khi chính thức phát hành LoveNote 1.0.
            </Typography>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-5 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trạng thái phát hành</div>
              <div className="text-lg font-black text-emerald-400 flex items-center gap-1.5">
                <span>GO FOR LAUNCH</span>
                <CheckCircle2 size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Freeze Status Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {freezes.map(f => (
          <div key={f.type} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{f.type}</div>
              <div className="text-sm font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                <Lock size={14} className="text-emerald-600" /> LOCKED
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 hide-scrollbar items-center justify-between">
        <div className="flex">
          <TabButton active={activeTab === 'gonogo'} onClick={() => setActiveTab('gonogo')} label="Go / No-Go Board" icon={<Award size={16} />} />
          <TabButton active={activeTab === 'kpis'} onClick={() => setActiveTab('kpis')} label="Performance Certification" icon={<Gauge size={16} />} />
          <TabButton active={activeTab === 'regression'} onClick={() => setActiveTab('regression')} label="Regression Suite" icon={<Layers size={16} />} />
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="Security Audit" icon={<ShieldAlert size={16} />} />
          <TabButton active={activeTab === 'disaster'} onClick={() => setActiveTab('disaster')} label="Disaster Recovery" icon={<Activity size={16} />} />
          <TabButton active={activeTab === 'packages'} onClick={() => setActiveTab('packages')} label="Store Publishing" icon={<PackageCheck size={16} />} />
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* 1. GO / NO-GO BOARD */}
          {activeTab === 'gonogo' && (
            <motion.div key="gonogo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" className="text-slate-900">Quyết định Go / No-Go chính thức</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Đánh giá tiêu chuẩn chất lượng tổng thể từ các Trưởng bộ phận phát triển.</Typography>
                </div>
                <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-sm flex items-center gap-2 border border-emerald-200">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  Sẵn sàng phát hành 100%
                </div>
              </div>

              {/* Scorecard Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <ScoreCard title="Quality" score={decision.qualityScore} target="≥ 95%" passed />
                <ScoreCard title="Performance" score={decision.performanceScore} target="≥ 90%" passed />
                <ScoreCard title="Security" score={decision.securityScore} target="100%" passed />
                <ScoreCard title="Accessibility" score={decision.accessibilityScore} target="≥ 90%" passed />
                <ScoreCard title="Documentation" score={decision.docsScore} target="100%" passed />
              </div>

              {/* Sign-off Details */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <Typography variant="h4" className="text-slate-900">Xác nhận ký duyệt (Sign-off List)</Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {decision.signedOffBy.map(role => (
                    <div key={role} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{role}</div>
                        <div className="text-[10px] text-emerald-600 font-medium">APPROVED</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. PERFORMANCE CERTIFICATION */}
          {activeTab === 'kpis' && (
            <motion.div key="kpis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Chứng nhận Hiệu năng (Performance Certification)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Mọi chỉ số đều đạt hoặc vượt mức tiêu chuẩn KPI của giai đoạn Release Candidate.</Typography>
              </div>

              <div className="space-y-3">
                {kpis.map(kpi => (
                  <div key={kpi.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Zap size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{kpi.metric}</div>
                        <div className="text-xs text-slate-500">Mục tiêu KPI: <span className="font-mono font-bold text-slate-700">{kpi.target}</span></div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-600 font-mono">{kpi.actual}</div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        PASSED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. REGRESSION TEST MATRIX */}
          {activeTab === 'regression' && (
            <motion.div key="regression" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" className="text-slate-900">Ma trận Kiểm thử Hồi quy (Regression Test Matrix)</Typography>
                  <Typography variant="body-sm" className="text-slate-500">
                    Đã thực thi <span className="font-bold text-slate-900">{totalPassed}/{totalTestCases}</span> kịch bản kiểm thử trên 12 module chính.
                  </Typography>
                </div>
                <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs">
                  Pass Rate: 100%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regression.map(mod => (
                  <div key={mod.moduleName} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{mod.moduleName}</h4>
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                      <span>Test cases: {mod.passedCount}/{mod.testCasesCount}</span>
                      <span className="text-emerald-600 font-bold uppercase text-[10px]">100% Pass</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. SECURITY AUDIT */}
          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Kiểm tra & Rà soát Bảo mật (Security Audit)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Đảm bảo an toàn dữ liệu kỷ niệm cá nhân của người dùng ở mức tuyệt đối.</Typography>
              </div>

              <div className="space-y-3">
                {security.map(sec => (
                  <div key={sec.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sec.checkName}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{sec.scope}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{sec.notes}</p>
                    </div>

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full shrink-0">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 5. DISASTER RECOVERY */}
          {activeTab === 'disaster' && (
            <motion.div key="disaster" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Kiểm thử Khôi phục sự cố (Disaster Recovery Test)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Mô phỏng các tình huống gián đoạn để đảm bảo không mất mát dữ liệu.</Typography>
              </div>

              <div className="space-y-3">
                {disaster.map(dr => (
                  <div key={dr.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{dr.scenarioName}</h4>
                      <div className="text-xs text-slate-500 mt-1">
                        Thời gian phục hồi: <span className="font-mono font-bold text-slate-700">{dr.recoveryTime}</span> • Toàn vẹn dữ liệu: <span className="font-bold text-emerald-600">{dr.dataIntegrity}</span>
                      </div>
                    </div>

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full shrink-0">
                      PASSED
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 6. STORE PACKAGES */}
          {activeTab === 'packages' && (
            <motion.div key="packages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Bộ cài đặt & Gói phát hành (Store Publishing Packages)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Sẵn sàng phân phối trên Windows, Android và Nền tảng Web SaaS.</Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <div key={pkg.platform} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        {pkg.platform === 'Windows' ? <Monitor size={28} className="text-blue-600" /> :
                         pkg.platform === 'Android' ? <Smartphone size={28} className="text-emerald-600" /> :
                         <Server size={28} className="text-indigo-600" />}
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase">
                          {pkg.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">{pkg.platform} Package</h4>
                      <p className="text-xs font-mono text-slate-500 mt-1">{pkg.artifactName}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-2 truncate">{pkg.checksum}</p>
                    </div>

                    <Button variant="outline" className="mt-6 bg-white w-full text-xs font-bold gap-2">
                      <PackageCheck size={14} /> Kiểm tra chữ ký số
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

const ScoreCard: React.FC<{ title: string, score: number, target: string, passed: boolean }> = ({ title, score, target, passed }) => (
  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
    <div className="text-xs font-bold text-slate-500 uppercase">{title}</div>
    <div className="text-3xl font-black text-slate-900 my-1">{score}%</div>
    <div className="text-[10px] text-emerald-600 font-bold">Mục tiêu {target}</div>
  </div>
);

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
      active ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);
