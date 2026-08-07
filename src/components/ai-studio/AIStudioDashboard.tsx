import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PromptBuilder } from './PromptBuilder';
import { IPromptBuilderState } from './types';
import { TaskQueuePanel } from './TaskQueuePanel';
import { GenerationHistoryPanel } from './GenerationHistoryPanel';
import { AIAssistantPanel } from './AIAssistantPanel';
import { ContextInspector } from './ContextInspector';
import { ExecutionQueue } from './ExecutionQueue';
import { ReviewCenter } from './ReviewCenter';
import { AgentTimeline } from './AgentTimeline';
import { IPlan, IProposedChange } from '../../modules/ai/AgentTypes';
import { agentService } from '../../modules/ai/AgentService';
import { KnowledgeRegistry } from '../../modules/ai-engine/knowledge/KnowledgeRegistry';
import { idbAdapter } from '../../modules/storage/IndexedDbAdapter';
import { WritingService } from '../../modules/ai-engine/writing/WritingService';
import { cleanAIGeneratedText } from '../../utils/textCleaner';
import { 
  Sparkles, 
  LayoutDashboard, 
  Library, 
  Sliders, 
  History, 
  Bot, 
  Wand2, 
  ClipboardList, 
  Activity,
  ShieldCheck,
  ChevronRight,
  Play,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { AICreativeType, IAITask } from './types';

type StudioView = 'dashboard' | 'builder' | 'history' | 'assistant' | 'agent';

interface AIStudioDashboardProps {
  onOpenInEditor?: (text: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AIStudioDashboard: React.FC<AIStudioDashboardProps> = ({ onOpenInEditor, onNavigateTab }) => {
  const [activeView, setActiveView] = useState<StudioView>('dashboard');
  const [selectedCreativeType, setSelectedCreativeType] = useState<AICreativeType>('love_letter');
  
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);

  // Plans & Agent State
  const [activePlan, setActivePlan] = useState<IPlan | null>(null);
  const [activities, setActivities] = useState(agentService.getActivity());
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const allProposedChanges = useMemo(() => {
    if (!activePlan) return [];
    return activePlan.tasks.flatMap(t => t.proposedChanges || []).filter(c => c.status === 'pending');
  }, [activePlan]);

  const mappedTasks: IAITask[] = useMemo(() => {
    return (activePlan?.tasks || []).map(t => ({
      id: t.id,
      type: selectedCreativeType,
      title: t.title,
      status: (t.status === 'running' ? 'in_progress' : t.status === 'waiting_approval' ? 'pending' : t.status === 'cancelled' ? 'failed' : t.status) as any,
      progress: t.status === 'completed' ? 100 : t.status === 'running' ? 50 : 0,
      startedAt: new Date(t.createdAt).getTime(),
      estimatedTokens: 1000,
      estimatedCost: 'Free',
      durationMs: 0,
      result: typeof t.result === 'string' ? { text: t.result } : t.result,
      error: t.error,
    }));
  }, [activePlan?.tasks, selectedCreativeType]);
  const aiAssistEnabled = localStorage.getItem('ai_assist_enabled') !== 'false';
  const planningEngineStatus = aiAssistEnabled ? 'Online' : 'Offline';
  const planningEngineColor = aiAssistEnabled ? 'emerald' : 'slate';
  const reviewCenterStatus = `${allProposedChanges.length} Pending`;

  // Sync state
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(agentService.getActivity(activePlan?.id));
      if (activePlan) {
        const plans = agentService.getPlans();
        const p = plans.find(plan => plan.id === activePlan.id);
        if (p) setActivePlan(p);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activePlan?.id]);

  // Generation History State
  const [generationHistory, setGenerationHistory] = useState<any[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  
  // Current compiled prompt for Assistant analysis
  const [currentCompiledPrompt, setCurrentCompiledPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [pendingGenerationData, setPendingGenerationData] = useState<{ prompt: string, builderState: IPromptBuilderState } | null>(null);

  // Simulated Context Data for Inspector
  const contextData = useMemo(() => ({
    memory: 95,
    timeline: 80,
    people: 100,
    places: 70,
    assets: 40,
    overallQuality: 88
  }), []);

  const contextSources = useMemo(() => [
    { type: 'memory' as const, label: 'Kỷ niệm "Sinh nhật 2022"', description: 'Chứa thông tin về sở thích quà tặng và không khí buổi tiệc.', active: true },
    { type: 'person' as const, label: 'Nhân vật "Nguyễn Văn A"', description: 'Thông tin về tính cách và mối quan hệ.', active: true },
    { type: 'place' as const, label: 'Địa điểm "Đà Lạt"', description: 'Ngữ cảnh về không gian lãng mạn.', active: true },
    { type: 'timeline' as const, label: 'Sự kiện "Kỷ niệm 1 năm"', description: 'Mốc thời gian quan trọng cần nhắc đến.', active: true },
    { type: 'asset' as const, label: 'Hình ảnh "Dalat_Trip.jpg"', description: 'Mô tả hình ảnh để đưa vào văn bản.', active: false },
  ], []);

  // Load history from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    idbAdapter.get<any[]>('lovenote_generation_history')
      .then((saved) => {
        if (!isMounted) return;
        if (saved && Array.isArray(saved)) {
          setGenerationHistory(saved);
        }
      })
      .catch((e) => {
        console.warn('Failed to load generation history from IndexedDB:', e);
      })
      .finally(() => {
        if (isMounted) setIsHistoryLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Save history to IndexedDB
  useEffect(() => {
    if (isHistoryLoading) return;
    idbAdapter.set('lovenote_generation_history', generationHistory).catch((e) => {
      console.error('Failed to save generation history to IndexedDB:', e);
    });
  }, [generationHistory, isHistoryLoading]);

  const handleReopenHistoryItem = useCallback((item: any) => {
    // In a real app, we'd restore the builder state
    setActiveView('builder');
  }, []);

  // Generation Trigger Logic
  const handleGenerate = useCallback(async (compiledPrompt: string, builderState: IPromptBuilderState) => {
    // Sprint 80: Show Context Inspector before generating
    setPendingGenerationData({ prompt: compiledPrompt, builderState });
    setIsInspectorOpen(true);
  }, []);

  const confirmGenerate = useCallback(async () => {
    if (!pendingGenerationData) return;
    const { prompt: compiledPrompt, builderState } = pendingGenerationData;
    setIsInspectorOpen(false);
    setPendingGenerationData(null);
    
    setIsGenerating(true);
    setCurrentCompiledPrompt(compiledPrompt);

    try {
      const type = builderState.creativeType || selectedCreativeType;
      
      // Determine mood/tone translation
      let selectedTone = 'romantic';
      if (builderState.mood) {
        if (builderState.mood.includes('đáng yêu') || builderState.mood.includes('Hóm hỉnh')) selectedTone = 'cute';
        else if (builderState.mood.includes('trang trọng') || builderState.mood.includes('Trân trọng')) selectedTone = 'formal';
        else if (builderState.mood.includes('hài hước') || builderState.mood.includes('Vui vẻ')) selectedTone = 'funny';
        else if (builderState.mood.includes('xúc động') || builderState.mood.includes('Sâu sắc')) selectedTone = 'emotional';
      }

      // Map selected AI model option to valid Gemini model name
      let mappedModel = 'gemini-3.6-flash';
      if (builderState.aiModel) {
        if (builderState.aiModel.includes('3.1 Pro') || builderState.aiModel.includes('1.5 Pro')) {
          mappedModel = 'gemini-3.1-pro-preview';
        } else if (builderState.aiModel.includes('3.5 Flash Lite')) {
          mappedModel = 'gemini-3.5-flash-lite';
        } else if (builderState.aiModel.includes('3.5 Flash')) {
          mappedModel = 'gemini-3.5-flash';
        } else if (builderState.aiModel.includes('3.1 Flash Lite')) {
          mappedModel = 'gemini-3.1-flash-lite';
        } else if (builderState.aiModel.includes('3.6 Flash')) {
          mappedModel = 'gemini-3.6-flash';
        }
      }

      const startTime = Date.now();
      const res = await WritingService.processWriting({
        action: 'generate' as any,
        text: compiledPrompt,
        tone: selectedTone as any,
        language: builderState.language || 'Vietnamese',
        model: mappedModel
      });
      const durationMs = Date.now() - startTime;

      const cleanedResultText = res.result ? cleanAIGeneratedText(res.result) : '';
      const estimatedCost = `~$${((compiledPrompt.length + cleanedResultText.length) * 0.000015).toFixed(4)}`;

      const newItem = {
        id: Date.now().toString(),
        taskType: type as any,
        title: builderState.occasion || 'Tác phẩm sáng tạo',
        promptUsed: compiledPrompt,
        createdAt: Date.now(),
        status: res.success ? 'completed' : 'failed' as any,
        estimatedCost,
        durationMs,
        result: {
          text: cleanedResultText || `Không thể tạo kết quả dựa trên yêu cầu này.`
        }
      };
      setGenerationHistory(prev => [newItem, ...prev]);
      setActiveView('history');
    } catch (e) {
      console.error('Error generating creative prompt:', e);
    } finally {
      setIsGenerating(false);
    }
  }, [pendingGenerationData, selectedCreativeType]);

  // Agent Logic
  const handleStartAgent = async (title: string, intent: string) => {
    const plan = agentService.createPlan('p1', title, intent);
    setActivePlan(plan);
    setActiveView('agent');
    await agentService.decompose(plan.id, intent);
    
    // Simulate some task progress dynamically querying the updated plan state
    setTimeout(() => {
      const currentPlans = agentService.getPlans();
      const currentPlan = currentPlans.find(p => p.id === plan.id);
      if (currentPlan && currentPlan.tasks && currentPlan.tasks.length > 0) {
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[0].id, 'running');
      }
    }, 2500);

    setTimeout(() => {
      const currentPlans = agentService.getPlans();
      const currentPlan = currentPlans.find(p => p.id === plan.id);
      if (currentPlan && currentPlan.tasks && currentPlan.tasks.length > 1) {
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[0].id, 'completed');
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[1].id, 'running');
      }
    }, 5000);

    setTimeout(() => {
      const currentPlans = agentService.getPlans();
      const currentPlan = currentPlans.find(p => p.id === plan.id);
      if (currentPlan && currentPlan.tasks && currentPlan.tasks.length > 2) {
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[1].id, 'completed');
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[2].id, 'running');
      }
    }, 8500);

    setTimeout(() => {
      const currentPlans = agentService.getPlans();
      const currentPlan = currentPlans.find(p => p.id === plan.id);
      if (currentPlan && currentPlan.tasks && currentPlan.tasks.length > 3) {
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[2].id, 'completed');
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[3].id, 'running');
        agentService.addProposedChange(plan.id, currentPlan.tasks[2].id, {
          type: 'add',
          entityType: 'memory',
          description: 'AI đề xuất thêm kỷ niệm "Lần đầu gặp gỡ" vào Timeline.',
          newData: { title: 'Lần đầu gặp gỡ', date: '2021-05-20', mood: 'Happy' }
        });
      }
    }, 11000);

    setTimeout(() => {
      const currentPlans = agentService.getPlans();
      const currentPlan = currentPlans.find(p => p.id === plan.id);
      if (currentPlan && currentPlan.tasks && currentPlan.tasks.length > 3) {
        agentService.updateTaskStatus(plan.id, currentPlan.tasks[3].id, 'completed');
      }
    }, 14000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] bg-slate-50 overflow-hidden">
      {/* Studio Navigation Sidebar */}
      <div className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-900 tracking-tighter uppercase">AI Studio</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform v2.0</p>
            </div>
          </div>

          <div className="space-y-1">
            <NavButton 
              active={activeView === 'dashboard'} 
              icon={<LayoutDashboard size={18} />} 
              label="Tổng quan" 
              onClick={() => setActiveView('dashboard')} 
            />
            <NavButton 
              active={activeView === 'agent'} 
              icon={<Bot size={18} />} 
              label="AI Agent" 
              onClick={() => setActiveView('agent')} 
            />
            <NavButton 
              active={activeView === 'builder'} 
              icon={<Wand2 size={18} />} 
              label="Prompt Builder" 
              onClick={() => setActiveView('builder')} 
            />
            <NavButton 
              active={activeView === 'assistant'} 
              icon={<Bot size={18} />} 
              label="AI Assistant" 
              onClick={() => setActiveView('assistant')} 
            />
            <NavButton 
              active={activeView === 'history'} 
              icon={<History size={18} />} 
              label="Lịch sử sáng tạo" 
              onClick={() => setActiveView('history')} 
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {activeView === 'agent' && activePlan ? (
             <AgentTimeline activities={activities} />
           ) : (
             <TaskQueuePanel tasks={mappedTasks} />
           )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">AI Status</div>
              <div className="text-xs font-bold text-emerald-900">Mọi thứ đều sẵn sàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Canvas */}
      <div className="flex-1 overflow-y-auto bg-slate-50 relative">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StudioCard 
                  title="Tạo dự án mới"
                  description="Bắt đầu hành trình sáng tạo mới với trợ lý AI."
                  icon={<Sparkles size={24} />}
                  onClick={() => setActiveView('builder')}
                  variant="primary"
                />
                <StudioCard 
                  title="AI Agent Coach"
                  description="Lập kế hoạch và thực hiện các tác vụ phức tạp."
                  icon={<Bot size={24} />}
                  onClick={() => setActiveView('agent')}
                  variant="secondary"
                />
                <StudioCard 
                  title="Prompt Library"
                  description="Khám phá các mẫu câu lệnh chuyên nghiệp."
                  icon={<Library size={24} />}
                  onClick={() => setIsPromptLibraryOpen(true)}
                  variant="outline"
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Dự án AI Agent gần đây</h3>
                  <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm space-y-4">
                    <AgentProjectItem 
                      title="Tạo Album kỷ niệm 1 năm"
                      status="active"
                      progress={40}
                      onClick={() => handleStartAgent("Tạo Album kỷ niệm 1 năm", "Tôi muốn tạo một album ảnh và kỷ niệm cho ngày tròn 1 năm quen nhau.")}
                    />
                    <AgentProjectItem 
                      title="Sắp xếp Dòng thời gian 2023"
                      status="completed"
                      progress={100}
                    />
                  </div>
                </section>

                <section className="space-y-4">
                   <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Trạng thái Hệ thống</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <SystemStat label="Planning Engine" status={planningEngineStatus} color={planningEngineColor} />
                     <SystemStat label="Review Center" status={reviewCenterStatus} color={allProposedChanges.length > 0 ? 'amber' : 'slate'} />
                     <SystemStat label="Execution Queue" status="Active" color="blue" />
                     <SystemStat label="Tool Orchestrator" status="Connected" color="emerald" />
                   </div>
                </section>
              </div>
            </motion.div>
          )}

          {/* Prompt Library Modal */}
          {isPromptLibraryOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-[32px] max-w-xl w-full p-8 shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Library size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Prompt Library</h3>
                      <p className="text-xs font-medium text-slate-500">Thư viện mẫu câu lệnh và prompt chuyên nghiệp</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsPromptLibraryOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {[
                    { title: 'Tạo Thư Tỏ Tình Lãng Mạn', category: 'Cảm xúc', prompt: 'Viết một lá thư tình ngọt ngào nhắc lại kỷ niệm tại [Địa điểm] vào ngày [Ngày] với giọng văn chân thành.' },
                    { title: 'Tóm Tắt Kỷ Niệm Chuyến Đi', category: 'Du lịch', prompt: 'Tóm tắt các hoạt động nổi bật trong chuyến đi [Tên chuyến đi] dựa trên các mốc thời gian và hình ảnh đã lưu.' },
                    { title: 'Gợi Ý Món Quà Sinh Nhật', category: 'Tư vấn', prompt: 'Dựa trên sở thích ẩm thực và màu sắc yêu thích của [Tên người nhận], hãy gợi ý 3 món quà ý nghĩa nhất.' },
                    { title: 'Kế Hoạch Tổ Chức Kỷ Niệm', category: 'Lập kế hoạch', prompt: 'Lập chi tiết các bước chuẩn bị cho lễ kỷ niệm ngày cưới gồm thực đơn, trang trí và timeline chương trình.' }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:border-slate-200 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">{p.title}</span>
                        <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600">{p.category}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{p.prompt}</p>
                      <button 
                        onClick={() => {
                          setIsPromptLibraryOpen(false);
                          setActiveView('builder');
                        }}
                        className="text-[10px] font-black uppercase text-rose-600 hover:underline flex items-center gap-1 pt-1"
                      >
                        Sử dụng prompt này <ChevronRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => setIsPromptLibraryOpen(false)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === 'agent' && (
            <motion.div
              key="agent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 space-y-8 max-w-4xl mx-auto"
            >
              {!activePlan ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl">
                    <Bot size={40} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">AI Project Coach</h2>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">
                      AI Agent sẽ giúp bạn lập kế hoạch và thực thi các tác vụ phức tạp theo từng bước minh bạch.
                    </p>
                  </div>
                  <button 
                    onClick={() => handleStartAgent("Album Kỷ niệm mới", "Tạo một album kỷ niệm mới")}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:shadow-2xl transition-all"
                  >
                    Bắt đầu lập kế hoạch
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Project Plan</div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activePlan.title}</h2>
                    </div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => setIsReviewOpen(true)}
                         className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                           allProposedChanges.length > 0 ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-200 text-slate-500'
                         }`}
                       >
                         <ShieldCheck size={16} />
                         Review Center ({allProposedChanges.length})
                       </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                       <ExecutionQueue 
                         tasks={activePlan.tasks} 
                         onApproveTask={() => setIsReviewOpen(true)}
                         onRejectTask={() => {}}
                       />
                    </div>
                    <div className="space-y-6">
                       <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm space-y-4">
                         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Permission Model</h3>
                         <PermissionItem icon={<Bot size={14} />} label="Đọc dữ liệu" allowed={true} />
                         <PermissionItem icon={<Bot size={14} />} label="Sửa nội dung" allowed={true} />
                         <PermissionItem icon={<Bot size={14} />} label="Xóa dữ liệu" allowed={false} />
                         <PermissionItem icon={<Bot size={14} />} label="Xuất bản" allowed={true} />
                       </div>

                       <div className="bg-slate-900 rounded-[32px] p-6 text-white space-y-4 shadow-xl">
                         <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tool Orchestrator</h3>
                            <Activity size={14} className="text-emerald-400" />
                         </div>
                         <div className="space-y-2">
                            <ToolItem label="Memory Engine" status="connected" />
                            <ToolItem label="Timeline Engine" status="connected" />
                            <ToolItem label="Writer Agent" status="active" />
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'builder' && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 max-w-4xl mx-auto"
            >
              <PromptBuilder 
                creativeType={selectedCreativeType} 
                onCreativeTypeChange={setSelectedCreativeType} 
                onGenerate={handleGenerate} 
                isGenerating={isGenerating} 
                isPendingConfirmation={isInspectorOpen}
              />
            </motion.div>
          )}

          {activeView === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GenerationHistoryPanel 
                history={generationHistory} 
                onReopenHistoryItem={handleReopenHistoryItem}
              />
            </motion.div>
          )}

          {activeView === 'assistant' && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <AIAssistantPanel 
                compiledPrompt={currentCompiledPrompt} 
                onRefine={(suggestion) => console.log('Refining with:', suggestion)}
                onOpenInEditor={onOpenInEditor}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ContextInspector
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        onConfirm={confirmGenerate}
        contextData={contextData}
        sources={contextSources}
      />

      <ReviewCenter 
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        changes={allProposedChanges}
        onApproveAll={() => {
          if (activePlan) {
            agentService.approveAllChanges(activePlan.id);
            // Refresh local state immediately
            const p = agentService.getPlans().find(plan => plan.id === activePlan.id);
            if (p) setActivePlan(p);
          }
          setIsReviewOpen(false);
        }}
        onApproveChange={(id) => {
          if (activePlan) {
            agentService.updateChangeStatus(activePlan.id, id, 'approved');
            // Refresh local state immediately
            const p = agentService.getPlans().find(plan => plan.id === activePlan.id);
            if (p) setActivePlan(p);
          }
        }}
        onRejectChange={(id) => {
          if (activePlan) {
            agentService.updateChangeStatus(activePlan.id, id, 'rejected');
            // Refresh local state immediately
            const p = agentService.getPlans().find(plan => plan.id === activePlan.id);
            if (p) setActivePlan(p);
          }
        }}
      />
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, icon: React.ReactNode, label: string, onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${
      active 
        ? 'bg-slate-900 text-white shadow-lg' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    {label}
  </button>
);

const StudioCard: React.FC<{ title: string, description: string, icon: React.ReactNode, onClick: () => void, variant: 'primary' | 'secondary' | 'outline' }> = ({ title, description, icon, onClick, variant }) => {
  const styles = {
    primary: 'bg-slate-900 text-white shadow-xl hover:shadow-2xl',
    secondary: 'bg-white border-2 border-slate-900 text-slate-900 shadow-lg hover:shadow-xl',
    outline: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
  };

  return (
    <button
      onClick={onClick}
      className={`p-8 rounded-[40px] text-left space-y-4 transition-all group ${styles[variant]}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${variant === 'primary' ? 'bg-white/10' : 'bg-slate-900 text-white'}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-black text-xl tracking-tighter uppercase mb-1">{title}</h3>
        <p className={`text-sm font-medium ${variant === 'primary' ? 'text-slate-400' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${variant === 'primary' ? 'text-rose-400' : 'text-rose-600'}`}>
        Bắt đầu ngay <ChevronRight size={14} />
      </div>
    </button>
  );
};

const AgentProjectItem: React.FC<{ title: string, status: string, progress: number, onClick?: () => void }> = ({ title, status, progress, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all group"
  >
    <div className="flex items-center justify-between mb-3">
       <div className="flex items-center gap-3">
         <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
         <h4 className="text-sm font-black text-slate-900">{title}</h4>
       </div>
       <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{status}</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`h-full ${status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}
      />
    </div>
  </button>
);

const SystemStat: React.FC<{ label: string, status: string, color: string }> = ({ label, status, color }) => (
  <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
    <div className={`text-[10px] font-black text-${color}-600 uppercase`}>{status}</div>
  </div>
);

const PermissionItem: React.FC<{ icon: React.ReactNode, label: string, allowed: boolean }> = ({ icon, label, allowed }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
    <div className="flex items-center gap-2 text-slate-600">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className={`p-1 rounded-md ${allowed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}`}>
      {allowed ? <CheckCircle2 size={12} /> : <X size={12} />}
    </div>
  </div>
);

const ToolItem: React.FC<{ label: string, status: string }> = ({ label, status }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs font-bold text-slate-400">{label}</span>
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
      status === 'active' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
    }`}>
      {status}
    </span>
  </div>
);

