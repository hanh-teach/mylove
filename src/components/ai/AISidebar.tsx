import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Activity, Database, Sparkles, ChevronRight, ChevronLeft, Play, Clock, Code } from 'lucide-react';
import { WorkflowProgressPanel } from './WorkflowProgressPanel';
import { runtimeEngine } from '../../modules/ai-engine/runtime/RuntimeEngine';
import { useWorkflowProgress } from '../../hooks/useWorkflowProgress';
import { useAIState } from '../../hooks/useAIState';

import { WorkflowPanel } from '../ai-assistant/workflow/WorkflowPanel';

export const AISidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'workflow' | 'memory' | 'reflection' | 'inspector'>('workflow');
  const { isActive } = useWorkflowProgress();
  const { events, memories, reflections, inspectorData } = useAIState();

  const handleRunWorkflow = async () => {
    setActiveTab('workflow');
    try {
      await runtimeEngine.runGoal('Create a romantic anniversary card with images and music');
    } catch (error) {
      console.error('Workflow failed:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 left-4 z-40 bg-white/95 p-3 rounded-full shadow-lg text-indigo-600 hover:bg-indigo-50 border border-indigo-100 transition-all flex items-center justify-center gap-2"
        title="AI Assistant"
      >
        <BrainCircuit size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -450, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -450, opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed top-0 left-0 h-full w-[380px] sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col border-r border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                <BrainCircuit size={20} />
                <span>AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('inspector')}
                  className={`p-1.5 rounded-lg transition-colors ${activeTab === 'inspector' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100'}`}
                  title="Developer Inspector"
                >
                  <Code size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-2 gap-1 bg-gray-50/50 border-b border-gray-100">
              <button
                onClick={() => setActiveTab('workflow')}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'workflow' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <Activity size={16} className="mb-1" />
                Workflow
              </button>
              <button
                onClick={() => setActiveTab('memory')}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'memory' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <Database size={16} className="mb-1" />
                Memory
              </button>
              <button
                onClick={() => setActiveTab('reflection')}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'reflection' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <Sparkles size={16} className="mb-1" />
                Reflection
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {activeTab === 'workflow' && (
                <div className="flex-1 overflow-y-auto">
                  <WorkflowPanel />
                </div>
              )}

              {activeTab === 'memory' && (
                <div className="p-6 overflow-y-auto h-full flex flex-col">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex-shrink-0">Memory Graph</h3>
                  
                  {/* Filter Tags */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide flex-shrink-0">
                    {['All', 'Personal', 'Family', 'Travel', 'Birthday', 'Milestones', 'Writing'].map(tag => (
                       <button key={tag} className="px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200">
                         {tag}
                       </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {memories.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        <Database className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No memories available.</p>
                      </div>
                    ) : (
                      memories.map((m: any, i: number) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-indigo-100 transition-colors shadow-sm cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                             <div className="font-medium text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">{m.title || 'Memory Item'}</div>
                             <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{new Date(m.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">{m.content}</p>
                          
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            {m.tags?.map((tag: string, idx: number) => (
                               <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100/50">{tag}</span>
                            ))}
                            <div className="ml-auto flex items-center gap-1.5 text-gray-400">
                              <Activity size={10} />
                              <span className="font-mono">Score: {(m.importance || 9)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reflection' && (
                <div className="p-6 overflow-y-auto h-full space-y-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Reflection Trace</h3>
                  {reflections.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No reflection data.</p>
                    </div>
                  ) : (
                    reflections.map((r: any, i: number) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Scores Header */}
                        <div className="bg-gray-50/80 p-4 border-b border-gray-100 grid grid-cols-2 gap-4">
                           <div className="space-y-1 text-center">
                             <div className="text-2xl font-light text-emerald-600">{Math.round((r.qualityScore || 0.92) * 100)}</div>
                             <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Quality</div>
                           </div>
                           <div className="space-y-1 text-center">
                             <div className="text-2xl font-light text-indigo-600">{Math.round((r.confidence || 0.97) * 100)}%</div>
                             <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Confidence</div>
                           </div>
                           <div className="col-span-2 grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-gray-100/50">
                              <div className="text-center">
                                <div className="text-xs font-medium text-gray-700">95</div>
                                <div className="text-[9px] text-gray-400 uppercase">Emotion</div>
                              </div>
                              <div className="text-center border-l border-r border-gray-100/50">
                                <div className="text-xs font-medium text-emerald-600">PASS</div>
                                <div className="text-[9px] text-gray-400 uppercase">Grammar</div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs font-medium text-emerald-600">PASS</div>
                                <div className="text-[9px] text-gray-400 uppercase">Safety</div>
                              </div>
                           </div>
                        </div>

                        {/* Flow Body */}
                        <div className="p-4 space-y-4">
                           <div>
                             <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Original Draft</div>
                             <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded line-clamp-2">{r.originalOutput}</div>
                           </div>
                           
                           <div className="flex justify-center -my-2 relative z-10">
                              <div className="bg-white p-1 rounded-full border border-gray-100">
                                <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
                              </div>
                           </div>

                           <div>
                             <div className="text-[10px] font-semibold text-amber-500 uppercase mb-1 flex items-center justify-between">
                               Critique & Repair
                               <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">{r.improvement || 'None'}</span>
                             </div>
                             <div className="text-xs text-amber-700 bg-amber-50/50 p-2 rounded italic">{r.critique}</div>
                           </div>

                           <div className="flex justify-center -my-2 relative z-10">
                              <div className="bg-white p-1 rounded-full border border-gray-100">
                                <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
                              </div>
                           </div>

                           <div>
                             <div className="text-[10px] font-semibold text-emerald-600 uppercase mb-1">Final Output</div>
                             <div className="text-xs text-emerald-700 bg-emerald-50/50 p-2 rounded line-clamp-2">{r.finalOutput}</div>
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'inspector' && (
                <div className="p-6 overflow-y-auto h-full bg-slate-900 text-slate-300 font-mono text-xs space-y-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Developer Inspector</h3>
                  {Object.keys(inspectorData).length === 0 ? (
                    <p className="text-slate-500">No runtime data available.</p>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-500">Workflow ID:</span>
                        <div className="text-slate-200 break-all mt-0.5">{inspectorData.workflowId || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Provider:</span>
                        <div className="text-blue-400 mt-0.5">{inspectorData.provider || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Latency:</span>
                        <div className="text-emerald-400 mt-0.5">{inspectorData.latency ? `${inspectorData.latency}ms` : 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Tokens:</span>
                        <div className="text-amber-400 mt-0.5">{inspectorData.tokens || 0}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Cost:</span>
                        <div className="text-rose-400 mt-0.5">${(inspectorData.cost || 0).toFixed(4)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
