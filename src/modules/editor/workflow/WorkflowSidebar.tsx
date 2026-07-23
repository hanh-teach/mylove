import React, { useState } from 'react';
import { WorkflowController, WORKFLOW_TEMPLATES, WorkflowStepItem } from './WorkflowController';
import { 
  Play, Pause, Square, RefreshCw, ChevronRight, CheckCircle2, Clock, DollarSign, Layers, Sparkles, X, History, FileText, AlertCircle 
} from 'lucide-react';

interface WorkflowSidebarProps {
  onClose?: () => void;
  isMobileDrawer?: boolean;
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({ onClose, isMobileDrawer = false }) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'templates' | 'history'>('progress');
  const [selectedStep, setSelectedStep] = useState<WorkflowStepItem | null>(null);

  const template = WorkflowController.getActiveTemplate();
  const progress = WorkflowController.getProgress();
  const isPaused = WorkflowController.getIsPaused();
  const timelineLogs = WorkflowController.getTimelineLogs();

  return (
    <div className={`bg-white/98 backdrop-blur-md flex flex-col h-full border-l border-rose-100 ${isMobileDrawer ? 'w-full rounded-t-3xl shadow-2xl max-h-[85vh]' : 'w-full lg:w-[360px] shadow-lg'}`}>
      {/* Header */}
      <div className="bg-rose-50/70 border-b border-rose-100 px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-rose-950 font-serif font-bold text-base">
          <Sparkles size={18} className="text-rose-600" />
          <span>Smart Workflow (Sprint 56)</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-rose-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-rose-100 px-3 py-2 bg-rose-50/30 gap-2 shrink-0">
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'progress' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-rose-800 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'templates' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-rose-800 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white text-rose-800 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          History
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'progress' && (
          <div className="space-y-4">
            {/* Active Workflow Card */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50/70 border border-rose-200/80 rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Active Pipeline</span>
                  <h4 className="font-serif font-bold text-rose-950 text-sm">{template.name}</h4>
                </div>
                <span className="text-xs font-bold bg-rose-200/80 text-rose-900 px-2.5 py-0.5 rounded-full">
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-rose-200/50 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-rose-600 to-pink-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Pause / Resume Controls */}
              <div className="flex items-center gap-2 pt-1">
                {isPaused ? (
                  <button
                    onClick={() => WorkflowController.resume()}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Play size={13} /> Resume
                  </button>
                ) : (
                  <button
                    onClick={() => WorkflowController.pause()}
                    className="flex-1 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Pause size={13} /> Pause
                  </button>
                )}
                <button
                  onClick={() => WorkflowController.stop()}
                  className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <Square size={13} /> Stop
                </button>
              </div>
            </div>

            {/* Workflow Steps List */}
            <div className="space-y-2">
              <h5 className="font-bold text-xs text-rose-900 uppercase tracking-wider">Pipeline Steps</h5>
              <div className="space-y-2">
                {template.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    onClick={() => setSelectedStep(step)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedStep?.id === step.id
                        ? 'bg-rose-100/90 border-rose-300 shadow-xs'
                        : step.status === 'completed'
                        ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-950'
                        : step.status === 'running'
                        ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-300'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        step.status === 'completed' ? 'bg-emerald-600 text-white' :
                        step.status === 'running' ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <span className="font-bold text-xs block">{step.name}</span>
                        <span className="text-[10px] text-slate-500">{step.provider} • {step.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {step.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-600" />}
                      {step.status === 'running' && <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-bold">Running</span>}
                      {step.status === 'failed' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); WorkflowController.retryStep(step.id); }}
                          className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700"
                        >
                          Retry
                        </button>
                      )}
                      <ChevronRight size={14} className="text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Step Detail Modal / Box */}
            {selectedStep && (
              <div className="bg-rose-50/90 border border-rose-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-950 text-sm">{selectedStep.name}</span>
                  <button onClick={() => setSelectedStep(null)} className="text-rose-500 hover:text-rose-800 text-xs font-bold">Close</button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-white p-2 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-slate-500 block">Provider</span>
                    <span className="font-bold text-slate-800">{selectedStep.provider}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-slate-500 block">Est. Time</span>
                    <span className="font-bold text-slate-800">{selectedStep.estimatedTime}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-slate-500 block">Est. Cost</span>
                    <span className="font-bold text-slate-800">{selectedStep.estimatedCost || '$0.01'}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-rose-100">
                    <span className="text-[10px] text-slate-500 block">Status</span>
                    <span className="font-bold text-rose-700 capitalize">{selectedStep.status}</span>
                  </div>
                </div>
                {selectedStep.outputSummary && (
                  <p className="text-[11px] text-emerald-800 font-medium bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    ✓ Output: {selectedStep.outputSummary}
                  </p>
                )}
              </div>
            )}

            {/* Mini Timeline Logs */}
            <div className="space-y-2 pt-2 border-t border-rose-100">
              <h5 className="font-bold text-xs text-rose-900 uppercase tracking-wider">Mini Timeline</h5>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-xl font-mono text-[10px] space-y-1.5 max-h-36 overflow-y-auto">
                {timelineLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 shrink-0">[{log.time}]</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-rose-900 uppercase tracking-wider">Workflow Templates</h5>
            <div className="space-y-2.5">
              {WORKFLOW_TEMPLATES.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    WorkflowController.setActiveTemplate(t.id);
                    setActiveTab('progress');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                    template.id === t.id ? 'bg-rose-100 border-rose-300 shadow-xs' : 'bg-white border-rose-100 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h6 className="font-serif font-bold text-rose-950 text-sm">{t.name}</h6>
                    <span className="text-[10px] bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-full font-bold">{t.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-rose-900 uppercase tracking-wider">Workflow History</h5>
            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Story & Media Keepsake v1</span>
                  <span className="text-emerald-600">Completed</span>
                </div>
                <p className="text-[10px] text-slate-500">Yesterday • 6 steps executed successfully</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Birthday Surprise</span>
                  <span className="text-amber-600">Paused</span>
                </div>
                <p className="text-[10px] text-slate-500">Today • 2 of 4 steps completed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
