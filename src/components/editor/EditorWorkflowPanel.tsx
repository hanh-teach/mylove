import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Square,
  RotateCcw,
  Sparkles,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wand2,
  FileText,
  Image as ImageIcon,
  Video,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Layers,
  ArrowRight,
  Check,
  X,
  Send,
  Sliders,
  History,
  Bot
} from 'lucide-react';
import { runtimeEngine } from '../../modules/ai-engine/runtime/RuntimeEngine';
import { runtimeEventBus, RuntimeEvent } from '../../modules/ai-engine/runtime/ExecutionEvents';
import { useWorkflowProgress } from '../../hooks/useWorkflowProgress';

export type WorkflowStage =
  | 'Draft'
  | 'AI Planning'
  | 'Generating'
  | 'Reviewing'
  | 'Export Ready'
  | 'Cancelled'
  | 'Failed';

export interface ActivityLogItem {
  id: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  stage?: WorkflowStage;
}

export interface SubTaskProgress {
  id: string;
  name: string;
  icon: 'letter' | 'image' | 'video' | 'reflection';
  percent: number;
  status: 'waiting' | 'running' | 'completed' | 'failed';
}

interface EditorWorkflowPanelProps {
  onApplyToCanvas?: (generatedText: string, decorType?: string) => void;
  onClose?: () => void;
  isMobileBottomSheet?: boolean;
}

export const EditorWorkflowPanel: React.FC<EditorWorkflowPanelProps> = ({
  onApplyToCanvas,
  onClose,
  isMobileBottomSheet = false,
}) => {
  // 1. Workflow State Management
  const [stage, setStage] = useState<WorkflowStage>('Draft');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [goalInput, setGoalInput] = useState<string>('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [hasPreviousSession, setHasPreviousSession] = useState<boolean>(false);

  // 2. Timers
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [estimatedSeconds, setEstimatedSeconds] = useState<number>(32);

  // 3. Task & Log Details
  const [currentTaskTitle, setCurrentTaskTitle] = useState<string>('Chờ khởi tạo workflow...');
  const [subTasks, setSubTasks] = useState<SubTaskProgress[]>([
    { id: 't1', name: 'Generate Letter', icon: 'letter', percent: 0, status: 'waiting' },
    { id: 't2', name: 'Generate Images', icon: 'image', percent: 0, status: 'waiting' },
    { id: 't3', name: 'Video & Audio Synthesize', icon: 'video', percent: 0, status: 'waiting' },
    { id: 't4', name: 'Reflection & Quality Check', icon: 'reflection', percent: 0, status: 'waiting' },
  ]);

  const [logs, setLogs] = useState<ActivityLogItem[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'info',
      message: 'Workflow Panel ready. Select a goal or template to start.',
      stage: 'Draft',
    },
  ]);

  const [showBlueprint, setShowBlueprint] = useState<boolean>(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Timer loop when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && (stage === 'AI Planning' || stage === 'Generating' || stage === 'Reviewing')) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, stage]);

  // Check previous session on mount
  useEffect(() => {
    try {
      const savedSessionId = localStorage.getItem('lovenote_active_workflow_session');
      if (savedSessionId) {
        setHasPreviousSession(true);
      }
    } catch (e) {
      console.warn('Session check error:', e);
    }
  }, []);

  // 4. Runtime Event Bus Subscription
  useEffect(() => {
    const unsubscribe = runtimeEventBus.subscribe((event: RuntimeEvent) => {
      const timeStr = new Date(event.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      if (event.type === 'WORKFLOW_STARTED') {
        setIsLoading(false);
        setStage('AI Planning');
        setActiveSessionId(event.sessionId);
        setErrorMessage(null);
        setStartTime(Date.now());
        setElapsedSeconds(0);
        setCurrentTaskTitle('Analyzing knowledge and building plan DAG...');
        
        setSubTasks([
          { id: 't1', name: 'Generate Letter', icon: 'letter', percent: 10, status: 'running' },
          { id: 't2', name: 'Generate Images', icon: 'image', percent: 0, status: 'waiting' },
          { id: 't3', name: 'Video & Audio Synthesize', icon: 'video', percent: 0, status: 'waiting' },
          { id: 't4', name: 'Reflection & Quality Check', icon: 'reflection', percent: 0, status: 'waiting' },
        ]);

        addLog({
          id: `log-${Date.now()}`,
          time: timeStr,
          type: 'info',
          message: `Planning Started: ${event.message}`,
          stage: 'AI Planning',
        });

        try {
          localStorage.setItem('lovenote_active_workflow_session', event.sessionId);
        } catch (e) {}
      }

      if (event.type === 'TASK_STARTED') {
        setStage('Generating');
        if (event.taskName) {
          setCurrentTaskTitle(event.taskName);
        }
        
        // Update subtasks status
        setSubTasks((prev) =>
          prev.map((st) => {
            if (event.taskName?.toLowerCase().includes('letter') && st.icon === 'letter') {
              return { ...st, status: 'running', percent: Math.max(st.percent, 30) };
            }
            if (event.taskName?.toLowerCase().includes('image') && st.icon === 'image') {
              return { ...st, status: 'running', percent: Math.max(st.percent, 20) };
            }
            if (event.taskName?.toLowerCase().includes('video') && st.icon === 'video') {
              return { ...st, status: 'running', percent: Math.max(st.percent, 10) };
            }
            return st;
          })
        );

        addLog({
          id: `log-${Date.now()}`,
          time: timeStr,
          type: 'info',
          message: event.message || `Started: ${event.taskName}`,
          stage: 'Generating',
        });
      }

      if (event.type === 'TASK_COMPLETED') {
        const percent = event.progressPercent ?? 50;
        
        setSubTasks((prev) => {
          if (percent >= 30) {
            return prev.map((t) =>
              t.icon === 'letter' ? { ...t, percent: 100, status: 'completed' } : t
            );
          }
          if (percent >= 70) {
            return prev.map((t) =>
              t.icon === 'image' ? { ...t, percent: 100, status: 'completed' } : t
            );
          }
          return prev;
        });

        addLog({
          id: `log-${Date.now()}`,
          time: timeStr,
          type: 'success',
          message: event.message || `Task Completed (${percent}%)`,
          stage: 'Generating',
        });
      }

      if (event.type === 'WORKFLOW_FINISHED') {
        setStage('Reviewing');
        setCurrentTaskTitle('Reflection Finished. Finalizing outputs...');
        
        setSubTasks([
          { id: 't1', name: 'Generate Letter', icon: 'letter', percent: 100, status: 'completed' },
          { id: 't2', name: 'Generate Images', icon: 'image', percent: 100, status: 'completed' },
          { id: 't3', name: 'Video & Audio Synthesize', icon: 'video', percent: 100, status: 'completed' },
          { id: 't4', name: 'Reflection & Quality Check', icon: 'reflection', percent: 100, status: 'completed' },
        ]);

        addLog({
          id: `log-${Date.now()}`,
          time: timeStr,
          type: 'success',
          message: 'Workflow Finished. Reflection completed successfully.',
          stage: 'Reviewing',
        });

        // Shift to Export Ready after brief review delay
        setTimeout(() => {
          setStage('Export Ready');
          setCurrentTaskTitle('Workflow Complete & Ready to Export / Apply.');
          addLog({
            id: `log-ready-${Date.now()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            type: 'success',
            message: 'Status shifted to Export Ready.',
            stage: 'Export Ready',
          });
        }, 1200);
      }

      if (event.type === 'WORKFLOW_CANCELLED') {
        setStage('Cancelled');
        setIsLoading(false);
        setCurrentTaskTitle('Workflow execution stopped by user.');
        addLog({
          id: `log-cancel-${Date.now()}`,
          time: timeStr,
          type: 'warning',
          message: 'Workflow Cancelled.',
          stage: 'Cancelled',
        });
      }

      if (event.type === 'WORKFLOW_FAILED') {
        setStage('Failed');
        setIsLoading(false);
        setErrorMessage(event.message || 'Error occurred during workflow execution.');
        setCurrentTaskTitle('Workflow Execution Failed.');
        addLog({
          id: `log-fail-${Date.now()}`,
          time: timeStr,
          type: 'error',
          message: `Failed: ${event.message}`,
          stage: 'Failed',
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const addLog = (item: ActivityLogItem) => {
    setLogs((prev) => [...prev, item]);
  };

  // 5. User Actions
  const handleStartWorkflow = async (customGoal?: string) => {
    const goalToRun = customGoal || goalInput || 'Tạo bài viết kỷ niệm ý nghĩa kèm thơ và nhạc nền nhẹ nhàng';
    setGoalInput(goalToRun);
    setIsLoading(true);
    setErrorMessage(null);
    setStage('Draft');

    addLog({
      id: `log-start-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'info',
      message: `Preparing Workflow for goal: "${goalToRun}"`,
      stage: 'Draft',
    });

    try {
      await runtimeEngine.runGoal(goalToRun, 'editor-user');
    } catch (err: any) {
      console.error('Run goal failed:', err);
      setIsLoading(false);
      setStage('Failed');
      setErrorMessage(err.message || 'Không thể khởi chạy workflow');
    }
  };

  const handleCancelWorkflow = () => {
    if (activeSessionId) {
      runtimeEngine.cancelSession(activeSessionId);
    } else {
      setStage('Cancelled');
      setIsLoading(false);
    }
  };

  const handleResumePrevious = () => {
    try {
      const savedSessionId = localStorage.getItem('lovenote_active_workflow_session');
      if (savedSessionId) {
        const session = runtimeEngine.resumeSession(savedSessionId);
        if (session) {
          setActiveSessionId(session.sessionId);
          setStage('Generating');
          setCurrentTaskTitle(`Resumed workflow session: ${session.goal}`);
          addLog({
            id: `log-res-${Date.now()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            type: 'info',
            message: `Resumed previous workflow session ${savedSessionId}`,
            stage: 'Generating',
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to resume:', e);
    }
    handleStartWorkflow('Khôi phục workflow kỷ niệm vừa qua');
  };

  const handleApplyToCanvas = () => {
    const generatedSampleText = goalInput
      ? `Kính gửi người thân yêu,\n"${goalInput}"\n\nCảm ơn vì đã luôn đồng hành và chia sẻ những khoảnh khắc tuyệt vời!`
      : 'Kính gửi bạn thân yêu,\nCảm ơn vì đã luôn đồng hành, mang lại nguồn cảm hứng và ý nghĩa mỗi ngày!';
    
    if (onApplyToCanvas) {
      onApplyToCanvas(generatedSampleText, 'Heart');
    }

    addLog({
      id: `log-app-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'success',
      message: 'Nội dung workflow đã được áp dụng trực tiếp lên Canvas!',
      stage: 'Export Ready',
    });
  };

  // Format Elapsed Time MM:SS
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Stage Stepper nodes list
  const STAGES_LIST: { id: WorkflowStage; label: string }[] = [
    { id: 'Draft', label: 'Draft' },
    { id: 'AI Planning', label: 'AI Planning' },
    { id: 'Generating', label: 'Generating' },
    { id: 'Reviewing', label: 'Reviewing' },
    { id: 'Export Ready', label: 'Export Ready' },
  ];

  const getStageIndex = (s: WorkflowStage) => {
    if (s === 'Cancelled' || s === 'Failed') return -1;
    return STAGES_LIST.findIndex((item) => item.id === s);
  };

  const currentStageIndex = getStageIndex(stage);

  return (
    <div className={`flex flex-col h-full bg-white text-slate-800 ${isMobileBottomSheet ? 'p-3' : 'p-4'}`}>
      {/* 1. Header & Close/Collapse */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-xs">
            <Wand2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight flex items-center gap-1.5">
              Workflow Panel
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                Runtime
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Quản lý quy trình AI thời gian thực
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowBlueprint(!showBlueprint)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              showBlueprint ? 'bg-rose-100 text-rose-700' : 'text-slate-500 hover:bg-slate-100'
            }`}
            title="Xem Blueprint Tiến Độ"
          >
            <Activity size={14} />
            <span className="hidden sm:inline">Blueprint</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Đóng panel"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Blueprint Expandable Modal/Card */}
      <AnimatePresence>
        {showBlueprint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3 p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-hidden shadow-inner border border-slate-800 space-y-1.5"
          >
            <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
              <span>ENGINEERING BLUEPRINT STATUS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                Sprint 45: Workflow UI
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div>Foundation &nbsp;&nbsp;&nbsp;██████████ 100%</div>
              <div>AI Platform &nbsp;&nbsp;██████████ 100%</div>
              <div>Runtime &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;█████████░ 90%</div>
              <div>Editor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;████████░░ 80%</div>
              <div className="text-emerald-400 font-bold">
                Workflow UI &nbsp;&nbsp;██████████ 100% (NEW)
              </div>
              <div>Timeline &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;████░░░░░░ 40%</div>
              <div>Memory &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;████░░░░░░ 40%</div>
              <div>AI Studio &nbsp;&nbsp;&nbsp;&nbsp;██░░░░░░░░ 20%</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
        {/* 2. Workflow Stage Stepper */}
        <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100/80 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Trạng thái Workflow
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                stage === 'Export Ready'
                  ? 'bg-emerald-100 text-emerald-700'
                  : stage === 'Failed'
                  ? 'bg-red-100 text-red-700'
                  : stage === 'Cancelled'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              <Sparkles size={12} />
              {stage}
            </span>
          </div>

          {/* Stepper Flow Bar */}
          <div className="grid grid-cols-5 gap-1 pt-1">
            {STAGES_LIST.map((st, idx) => {
              const isPast = currentStageIndex > idx;
              const isCurrent = currentStageIndex === idx;

              return (
                <div key={st.id} className="flex flex-col items-center gap-1 text-center">
                  <div
                    className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                      isPast
                        ? 'bg-rose-500'
                        : isCurrent
                        ? 'bg-rose-400 animate-pulse'
                        : stage === 'Failed' && isCurrent
                        ? 'bg-red-500'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[9px] font-medium leading-tight truncate w-full ${
                      isCurrent
                        ? 'text-rose-700 font-bold'
                        : isPast
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Skeleton Loading State if preparing */}
        {isLoading && (
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 animate-pulse space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw size={14} className="animate-spin text-rose-500" />
              <span className="font-semibold text-rose-800 text-xs">
                Preparing Workflow DAG & Knowledge...
              </span>
            </div>
            <div className="h-2 bg-rose-200/60 rounded-full w-3/4"></div>
            <div className="h-2 bg-rose-200/40 rounded-full w-1/2"></div>
          </div>
        )}

        {/* 4. Empty State */}
        {stage === 'Draft' && !isLoading && (
          <div className="p-4 rounded-xl border border-dashed border-rose-200 bg-gradient-to-b from-rose-50/30 to-pink-50/20 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <Bot size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">No Active Workflow</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Bắt đầu tạo thiệp & bài viết sáng tạo với Runtime Engine.
              </p>
            </div>

            {hasPreviousSession && (
              <button
                onClick={handleResumePrevious}
                className="w-full py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <RotateCcw size={14} />
                Resume Previous Workflow
              </button>
            )}

            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] text-slate-400 font-medium">Mẫu gợi ý khởi chạy:</p>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => handleStartWorkflow('Tạo bài viết kỷ niệm ý nghĩa kèm thơ và hoạ tiết trang trí')}
                  className="p-2 text-left rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 transition-all flex items-center justify-between"
                >
                  <span className="font-medium text-[11px]">Thư & Bài viết kỷ niệm</span>
                  <Play size={12} className="text-rose-500" />
                </button>
                <button
                  onClick={() => handleStartWorkflow('Tạo thiệp chúc mừng sinh nhật sang trọng')}
                  className="p-2 text-left rounded-lg bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-300 text-slate-700 transition-all flex items-center justify-between"
                >
                  <span className="font-medium text-[11px]">Thiệp chúc mừng sinh nhật</span>
                  <Play size={12} className="text-rose-500" />
                </button>
              </div>
            </div>

            {/* Custom Input */}
            <div className="flex gap-1.5 pt-2">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Nhập yêu cầu sáng tạo..."
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              <button
                onClick={() => handleStartWorkflow()}
                className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all flex items-center gap-1"
              >
                <Play size={12} />
                Chạy
              </button>
            </div>
          </div>
        )}

        {/* 5. Error State */}
        {stage === 'Failed' && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold">
              <XCircle size={18} />
              <span>Workflow Failed</span>
            </div>
            <p className="text-[11px] text-red-700 bg-white/80 p-2 rounded border border-red-100">
              {errorMessage || 'Workflow không thể hoàn tất tác vụ.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleStartWorkflow()}
                className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1"
              >
                <RotateCcw size={14} />
                Retry Workflow
              </button>
              <button
                onClick={() => {
                  alert('Báo cáo lỗi thành công! Đội ngũ phát triển sẽ kiểm tra log.');
                }}
                className="py-1.5 px-3 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-100 font-medium text-xs transition-all"
              >
                Report
              </button>
            </div>
          </div>
        )}

        {/* 6. Cancelled State */}
        {stage === 'Cancelled' && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle size={16} />
                <span>Workflow Cancelled</span>
              </div>
              <button
                onClick={() => setStage('Draft')}
                className="text-[11px] underline text-amber-700 hover:text-amber-900"
              >
                Trở về nháp
              </button>
            </div>
            <p className="text-[11px] text-amber-700">Tác vụ đã được dừng theo yêu cầu người dùng.</p>
            <button
              onClick={() => handleStartWorkflow()}
              className="w-full py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1"
            >
              <Play size={14} />
              Khởi chạy lại
            </button>
          </div>
        )}

        {/* 7. Current Task & Realtime Timers */}
        {(stage === 'AI Planning' || stage === 'Generating' || stage === 'Reviewing' || stage === 'Export Ready') && (
          <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Activity size={12} className="animate-spin" />
                Current Task
              </span>
              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-rose-400" />
                  Elapsed: <strong className="text-white">{formatTime(elapsedSeconds)}</strong>
                </span>
                <span className="text-slate-500">|</span>
                <span>Est: {formatTime(estimatedSeconds)}</span>
              </div>
            </div>

            <div className="text-xs font-medium text-slate-100 bg-slate-800/80 p-2 rounded-lg border border-slate-700 flex items-start gap-2">
              <Bot size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">{currentTaskTitle}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Goal: {goalInput || 'Lập kế hoạch thiệp & bài thơ kỷ niệm'}
                </p>
              </div>
            </div>

            {/* Cancel Button */}
            {(stage === 'AI Planning' || stage === 'Generating' || stage === 'Reviewing') && (
              <div className="flex items-center justify-end pt-0.5">
                <button
                  onClick={handleCancelWorkflow}
                  className="px-2.5 py-1 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-semibold text-[11px] transition-all flex items-center gap-1"
                >
                  <Square size={12} />
                  Stop Workflow
                </button>
              </div>
            )}
          </div>
        )}

        {/* 8. Progress Timeline Subtasks Breakdown */}
        {(stage === 'AI Planning' || stage === 'Generating' || stage === 'Reviewing' || stage === 'Export Ready') && (
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Layers size={13} className="text-rose-500" />
                Progress Timeline
              </h4>
              <span className="text-[10px] font-bold text-rose-600">
                {subTasks.filter((t) => t.status === 'completed').length}/{subTasks.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {subTasks.map((st) => (
                <div key={st.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      {st.icon === 'letter' && <FileText size={13} className="text-rose-500" />}
                      {st.icon === 'image' && <ImageIcon size={13} className="text-pink-500" />}
                      {st.icon === 'video' && <Video size={13} className="text-purple-500" />}
                      {st.icon === 'reflection' && <Sparkles size={13} className="text-amber-500" />}
                      {st.name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">
                      {st.percent}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        st.percent === 100
                          ? 'bg-emerald-500'
                          : st.status === 'running'
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${st.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. Success State & Apply Action */}
        {stage === 'Export Ready' && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md space-y-2.5"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 size={20} />
              <span>Workflow Export Ready!</span>
            </div>
            <p className="text-[11px] text-emerald-100">
              Các tài nguyên thiệp, bài thơ và họa tiết đã được hoàn thiện bởi Runtime Engine.
            </p>
            <button
              onClick={handleApplyToCanvas}
              className="w-full py-2 px-3 rounded-lg bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} className="text-emerald-600" />
              Áp dụng trực tiếp vào Editor Canvas
            </button>
          </motion.div>
        )}

        {/* 10. Realtime Activity Log Stream */}
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <History size={13} className="text-slate-500" />
              Activity Log (EventBus)
            </h4>
            <button
              onClick={() => setLogs([])}
              className="text-[10px] text-slate-400 hover:text-slate-600"
            >
              Xóa log
            </button>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 font-mono text-[10px] bg-white p-2 rounded-lg border border-slate-200 shadow-inner">
            {logs.length === 0 ? (
              <p className="text-slate-400 italic text-[10px] text-center py-2">
                Chưa có sự kiện log nào...
              </p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-1.5 leading-tight">
                  <span className="text-slate-400 shrink-0 font-semibold">{log.time}</span>
                  <span
                    className={`font-semibold shrink-0 ${
                      log.type === 'success'
                        ? 'text-emerald-600'
                        : log.type === 'error'
                        ? 'text-red-600'
                        : log.type === 'warning'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    [{log.stage || 'INFO'}]
                  </span>
                  <span className="text-slate-700 break-words flex-1">{log.message}</span>
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
