import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Activity, Database, Terminal, Settings as SettingsIcon, Info } from 'lucide-react';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';
import { getModuleStatus } from '../../modules/testing/ProductHealth';

export const DeveloperDiagnosticPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'system' | 'ui' | 'data' | 'logs'>('system');

  // Skip in production unless we want a special debug build
  // if (process.env.NODE_ENV === 'production') return null;

  const modules = ['Project', 'AI', 'Editor', 'Timeline', 'Assets', 'Export', 'Print', 'Settings'];

  const stats = {
    environment: 'Production',
    version: 'v4.0.0',
    build: '#2025.05.25',
    userId: 'usr_8d2f...',
    workspaceId: 'ws_91af...',
    platform: 'Windows'
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-10 w-10 h-10 bg-slate-900 text-white rounded-xl shadow-lg flex items-center justify-center z-[1000] hover:bg-slate-800 transition-all active:scale-95"
        title="Toggle Developer Mode"
      >
        <span className="font-mono text-sm">{"{}"}</span>
      </button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1001] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[340px] bg-slate-950 text-slate-300 shadow-2xl z-[1002] border-l border-slate-800 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <Typography variant="title" className="text-white flex items-center gap-2">
                  <Cpu size={18} className="text-rose-500" />
                  Developer Mode
                </Typography>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-500">
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-800 px-2">
                {(['system', 'ui', 'data', 'logs'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      activeTab === tab ? 'text-rose-500 border-b-2 border-rose-500' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {activeTab === 'system' && (
                  <>
                    <div className="space-y-2">
                      {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-[11px]">
                          <span className="capitalize text-slate-500">{key}</span>
                          <span className="font-mono text-slate-300">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-800 space-y-3">
                      <Typography variant="label" className="text-slate-500">Modules Status</Typography>
                      <div className="space-y-1.5">
                        {modules.map(module => (
                          <div key={module} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                            <span className="text-[11px] font-medium">{module}</span>
                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">
                              <Activity size={10} />
                              healthy
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'ui' && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                    <Activity size={40} className="mb-4 opacity-20" />
                    <Typography variant="body-sm">UI Visualizer Ready</Typography>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                    <Database size={40} className="mb-4 opacity-20" />
                    <Typography variant="body-sm">Cache Inspector Ready</Typography>
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="space-y-2 font-mono text-[10px]">
                    <div className="text-emerald-500">[SYSTEM] Application Shell Initialized</div>
                    <div className="text-emerald-500">[THEME] Light Mode Active</div>
                    <div className="text-slate-500">[VITE] HMR Disabled by Platform</div>
                    <div className="text-blue-500">[INFO] Sprint 75.9 Layout Applied</div>
                    <div className="text-rose-500">[ERROR] Failed to fetch remote assets (Offline)</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-[10px] text-slate-600 font-mono text-center">
                LOVE NOTE ENGINE v4.0.0-STABLE
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
