import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Activity, 
  Sparkles, 
  Heart, 
  AlertCircle,
  ChevronRight,
  LayoutDashboard,
  PenTool,
  ImageIcon,
  MessageSquare,
  Wand2,
  FileText,
  History,
  TrendingUp,
  Target,
  RotateCcw,
  Search,
  Eye,
  Star,
  Zap,
  ShieldCheck,
  Trophy,
  Settings2,
  Save,
  Users
} from 'lucide-react';
import { Project, ProjectActivity, ProjectChecklistItem, ProjectLifecyclePhase, WorkspaceInsight, PriorityTask } from '../../modules/workspace/Project';
import { Button } from '../ui/Button';
import { Typography } from '../ui/Typography';
import { timelineStore } from '../../modules/timeline/TimelineStore';
import { useProjectDashboardBusiness } from '../../modules/workspace/hooks/useProjectDashboardBusiness';

interface ProjectDashboardProps {
  project: Project;
  onNavigateToModule: (module: string) => void;
  onUpdateProject: (updates: Partial<Project>) => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ 
  project, 
  onNavigateToModule,
  onUpdateProject
}) => {
  const {
    showSaveSuccess,
    handleInsightAction,
    toggleChecklist,
    togglePriority,
    handleSaveAsTemplate,
  } = useProjectDashboardBusiness(project, onNavigateToModule, onUpdateProject);

  const timelineObj = timelineStore.getOrCreateTimeline(project.id, project.title, project.template);
  const timelineCount = timelineStore.getTimelineItems(timelineObj.id).length ?? project.recentActivity?.length ?? 0;
  const aiCount = (project.workspaceInsights?.length ?? 0) + (project.coachSuggestions?.length ?? 0);

  const handleGetMoreSuggestions = () => {
    const additional = [
      'Thêm ảnh kỷ niệm gia đình hoặc bạn bè để tăng tính gắn kết.',
      'Soạn thảo lời kết ấn tượng để khép lại dự án trọn vẹn.',
      'Sử dụng công cụ AI Assistant để tự động trau chuốt câu văn.',
      'Kiểm tra lại độ hoàn thiện của danh sách việc cần làm (checklist).',
      'Đổi màu sắc chủ đề và font chữ phù hợp với tâm trạng của bạn.'
    ];
    const current = project.coachSuggestions || [];
    const nextItem = additional.find(item => !current.includes(item)) || 'Tiếp tục sáng tạo và hoàn thiện các chi tiết cuối cùng.';
    onUpdateProject({
      coachSuggestions: [...current, nextItem]
    });
  };

  const handleCycleDailyFocus = () => {
    const focusPool = [
      ['Phác thảo ý tưởng chính', 'Tìm chủ đề và hình ảnh phù hợp'],
      ['Viết nội dung cảm xúc', 'Kiểm tra chính tả và ngữ pháp'],
      ['Chọn phong cách thiết kế', 'Thêm nhạc nền và sticker'],
      ['Hoàn thiện dự án', 'Xuất bản và chia sẻ với người thân']
    ];
    const current = project.dailyFocus || [];
    const currentIdx = focusPool.findIndex(f => f[0] === (current[0] || ''));
    const nextIdx = (currentIdx + 1) % focusPool.length;
    onUpdateProject({ dailyFocus: focusPool[nextIdx] || focusPool[0] });
  };


  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'good': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'critical': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-text-muted bg-surface-elevated border-border-subtle';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-emerald-500 bg-emerald-50';
      case 'medium': return 'text-blue-500 bg-blue-50';
      case 'low': return 'text-text-muted bg-surface-elevated';
      default: return 'text-text-muted bg-surface-elevated';
    }
  };

  const getLifecycleIcon = (phase: ProjectLifecyclePhase) => {
    switch (phase) {
      case 'idea': return <Sparkles size={16} />;
      case 'planning': return <Target size={16} />;
      case 'collecting': return <ImageIcon size={16} />;
      case 'writing': return <PenTool size={16} />;
      case 'designing': return <LayoutDashboard size={16} />;
      case 'reviewing': return <CheckCircle2 size={16} />;
      case 'exporting': return <TrendingUp size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const phases: ProjectLifecyclePhase[] = ['idea', 'planning', 'collecting', 'writing', 'designing', 'reviewing', 'exporting'];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-surface rounded-[40px] p-8 sm:p-10 border border-border-base shadow-xs">
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20"
          style={{ backgroundColor: project.themeColor }}
        />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{project.icon}</span>
              <div>
                <Typography variant="h1" className="tracking-tighter leading-tight">
                  {project.title}
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getHealthColor(project.health)}`}>
                    {project.health} Health
                  </span>
                  <span className="text-text-muted text-xs">•</span>
                  <span className="text-text-muted text-xs font-medium">Cập nhật {project.lastEditedText}</span>
                </div>
              </div>
            </div>
            <Typography variant="body" className="text-text-muted max-w-xl">
              {project.description}
            </Typography>
          </div>

          <div className="flex flex-col items-end gap-3">
            {project.lastState?.tab && project.lastState.tab !== 'project-dashboard' && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onNavigateToModule(project.lastState!.tab as any)}
                className="bg-surface-elevated/80 hover:bg-surface-elevated text-text-main border-border-base shadow-sm mb-2"
              >
                <RotateCcw size={14} className="mr-2" />
                Tiếp tục: {project.lastState.tab}
              </Button>
            )}
            
            <div className="relative">
              <Button 
                variant="outlined" 
                size="sm"
                onClick={handleSaveAsTemplate}
                className="bg-surface-elevated/50 text-text-muted hover:bg-surface-hover border-border-base mb-2"
              >
                <Save size={14} className="mr-2 text-indigo-500" />
                Lưu làm Template
              </Button>
              <AnimatePresence>
                {showSaveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-full mt-2 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-1 z-50"
                  >
                    <CheckCircle2 size={12} /> Đã lưu thành Mẫu
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-bold text-text-muted uppercase tracking-widest mb-1">
                {project.lifecyclePhase === 'idea' ? 'Giai đoạn ý tưởng' : 
                 project.lifecyclePhase === 'planning' ? 'Đang lập kế hoạch' :
                 project.lifecyclePhase === 'collecting' ? 'Đang thu thập tư liệu' :
                 project.lifecyclePhase === 'writing' ? 'Đang soạn thảo nội dung' :
                 project.lifecyclePhase === 'designing' ? 'Đang hoàn thiện thiết kế' :
                 project.lifecyclePhase === 'reviewing' ? 'Đang kiểm duyệt' :
                 'Sẵn sàng xuất bản'}
              </div>
              <div className="text-4xl font-black text-text-main tracking-tighter">{project.progress}%</div>
            </div>
            <div className="w-48 h-2 bg-border-subtle rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: project.themeColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Smart Intelligence Row: Daily Focus & Priority Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Focus */}
        <section className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-rose-200" />
                <h3 className="font-black text-lg">Daily Focus</h3>
              </div>
              <button 
                onClick={handleCycleDailyFocus}
                className="text-[10px] font-black uppercase tracking-wider bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-all text-white shadow-xs"
              >
                Đổi mục tiêu
              </button>
            </div>
            <div className="space-y-4">
              { (project.dailyFocus || []).map((focus, i) => (
                <div 
                  key={i} 
                  onClick={handleCycleDailyFocus}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-black">0{i+1}</div>
                  <span className="font-bold text-sm">{focus}</span>
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Priority Center */}
        <section className="lg:col-span-2 bg-surface rounded-[32px] p-8 border border-border-base shadow-xs relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-lg text-text-main flex items-center gap-2">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              Priority Center
            </h3>
            <button 
              onClick={() => onNavigateToModule('aistudio')}
              className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1 hover:text-text-main transition-colors"
            >
              <Settings2 size={12} /> Cấu hình AI
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            { Array.from(new Map((project.priorityTasks || []).map((t: any) => [t.id, t])).values()).map((task: any) => (
              <button 
                key={task.id}
                onClick={() => togglePriority(task.id)}
                className={`flex items-start gap-4 p-4 rounded-[24px] border transition-all text-left group ${
                  task.completed ? 'bg-surface border-border-subtle opacity-60' : 'bg-surface border-border-base hover:border-border-strong hover:shadow-sm'
                }`}
              >
                <div className={`mt-1 shrink-0 ${task.completed ? 'text-emerald-500' : 'text-text-muted group-hover:text-text-muted'}`}>
                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      task.priority >= 4 ? 'text-rose-500' : 'text-blue-500'
                    }`}>
                      {'★'.repeat(task.priority)}{'☆'.repeat(5-task.priority)}
                    </span>
                    <span className="text-[10px] font-bold text-text-muted">• {task.impact}</span>
                  </div>
                  <p className={`font-bold text-text-main ${task.completed ? 'line-through' : ''}`}>{task.label}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Workspace Insights Engine */}
      {project.intelligenceSettings.showInsights && (
        <section className="bg-surface-elevated/50 rounded-[40px] p-8 border border-border-subtle">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-xl text-text-main flex items-center gap-3">
                <Wand2 size={24} className="text-purple-500" />
                Workspace Insights
              </h3>
              <p className="text-sm text-text-muted mt-1">Gợi ý chủ động từ AI dựa trên tình trạng dự án</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            { Array.from(new Map((project.workspaceInsights || []).map((i: any) => [i.id, i])).values()).map((insight: any) => (
              <div key={insight.id} className="bg-surface p-6 rounded-[32px] border border-border-base shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl ${
                    insight.type === 'warning' ? 'bg-rose-50 text-rose-500' : 
                    insight.type === 'suggestion' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'
                  }`}>
                    {insight.type === 'warning' ? <AlertCircle size={20} /> : 
                     insight.type === 'suggestion' ? <Zap size={20} /> : <Sparkles size={20} />}
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getConfidenceColor(insight.confidence)}`}>
                    <ShieldCheck size={10} /> {insight.confidence} Confidence
                  </div>
                </div>
                <p className="font-bold text-text-main mb-6 flex-1 leading-relaxed">{insight.message}</p>
                {insight.actionLabel && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleInsightAction(insight.category)}
                    className="w-full bg-surface-elevated hover:bg-surface-hover text-text-main border-none font-black text-[10px] uppercase tracking-widest py-3"
                  >
                    {insight.actionLabel} <ChevronRight size={14} className="ml-1" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Grid: Statistics & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Health Dashboard */}
          <section className="bg-surface rounded-[32px] p-8 border border-border-base shadow-xs">
            <h3 className="font-black text-lg text-text-main flex items-center gap-2 mb-6">
              <Activity size={20} className="text-emerald-500" />
              Project Health Status
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <HealthBar label="Nội dung" value={project.healthStatus.content} color="rose" />
              <HealthBar label="Hình ảnh" value={project.healthStatus.media} color="blue" />
              <HealthBar label="Timeline" value={project.healthStatus.timeline} color="purple" />
            </div>
          </section>

          {/* Quick Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <QuickModuleCard 
              icon={<PenTool size={20} />} 
              label="Editor" 
              count={`${project.content.wordCount || 0} từ`}
              color="rose"
              onClick={() => onNavigateToModule('editor')}
            />
            <QuickModuleCard 
              icon={<ImageIcon size={20} />} 
              label="Media" 
              count={`${project.memoriesCount || 0} ảnh`}
              color="blue"
              onClick={() => onNavigateToModule('assets')}
            />
            <QuickModuleCard 
              icon={<History size={20} />} 
              label="Timeline" 
              count={timelineCount === 0 ? 'Chưa có mốc' : `${timelineCount} mốc`}
              color="purple"
              onClick={() => onNavigateToModule('timeline')}
            />
            <QuickModuleCard 
              icon={<Sparkles size={20} />} 
              label="AI Assist" 
              count={aiCount === 0 ? 'Chưa có gợi ý' : `${aiCount} gợi ý`}
              color="amber"
              onClick={() => onNavigateToModule('aistudio')}
            />
            <QuickModuleCard 
              icon={<Users size={20} />} 
              label="Members" 
              count={`${project.members?.length || 0} người`}
              color="emerald"
              onClick={() => onNavigateToModule('collaboration')}
            />
          </div>
        </div>

        {/* Sidebar: Productivity & Coach */}
        <div className="space-y-8">
          {/* Intelligence Settings (New) */}
          <section className="bg-surface rounded-[32px] p-6 border border-border-base shadow-xs">
            <h3 className="font-black text-xs text-text-main flex items-center gap-2 mb-4">
              <Settings2 size={16} className="text-text-muted" />
              Intelligence Settings
            </h3>
            <div className="space-y-3">
              <SettingToggle 
                label="Hiển thị AI Insights" 
                enabled={project.intelligenceSettings.showInsights} 
                onChange={(v) => onUpdateProject({ intelligenceSettings: { ...project.intelligenceSettings, showInsights: v } })} 
              />
              <SettingToggle 
                label="Theo dõi năng suất" 
                enabled={project.intelligenceSettings.showProductivity} 
                onChange={(v) => onUpdateProject({ intelligenceSettings: { ...project.intelligenceSettings, showProductivity: v } })} 
              />
              <SettingToggle 
                label="AI Coach chủ động" 
                enabled={project.intelligenceSettings.activeCoach} 
                onChange={(v) => onUpdateProject({ intelligenceSettings: { ...project.intelligenceSettings, activeCoach: v } })} 
              />
            </div>
          </section>

          {/* Productivity Stats */}
          {project.intelligenceSettings.showProductivity && (
            <section className="bg-surface rounded-[32px] p-8 border border-border-base shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg text-text-main flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  Productivity
                </h3>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tuần này</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <StatBox label="Dự án" value={project.productivity.weeklyProjects} />
                <StatBox label="Giờ làm" value={project.productivity.weeklyHours} />
                <StatBox label="Memories" value={project.productivity.newMemories} />
                <StatBox label="AI Assists" value={project.productivity.aiAssists} />
              </div>
            </section>
          )}

          {/* AI Project Coach */}
          <section className="bg-rose-500/10 rounded-[32px] p-8 border border-rose-500/20 shadow-sm">
            <h3 className="font-black text-lg text-rose-900 dark:text-rose-200 flex items-center gap-2 mb-4">
              <Wand2 size={20} className="text-rose-500" />
              AI Project Coach
            </h3>
            <div className="space-y-4">
              { (project.coachSuggestions || []).map((suggestion, i) => (
                <div key={i} className="flex gap-3 bg-surface p-4 rounded-2xl border border-border-base shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0">
                    <Typography variant="body-sm" className="font-black text-rose-500 text-[10px]">{i + 1}</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-text-main font-medium leading-relaxed">
                    {suggestion}
                  </Typography>
                </div>
              ))}
              <Button 
                variant="primary" 
                onClick={handleGetMoreSuggestions}
                className="w-full bg-rose-600 hover:bg-rose-700 mt-2"
              >
                Nhận thêm gợi ý
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string, value: number | string }> = ({ label, value }) => (
  <div className="bg-surface-elevated p-4 rounded-2xl border border-border-subtle">
    <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{label}</div>
    <div className="text-xl font-black text-text-main tracking-tight">{value}</div>
  </div>
);

interface QuickModuleCardProps {
  icon: React.ReactNode;
  label: string;
  count: string;
  color: 'rose' | 'blue' | 'purple' | 'amber' | 'emerald';
  onClick: () => void;
}

const QuickModuleCard: React.FC<QuickModuleCardProps> = ({ icon, label, count, color, onClick }) => {
  const colors = {
    rose: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40',
    blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/40',
    purple: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/40',
    amber: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/40',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-[32px] border transition-all hover:shadow-md active:scale-95 text-center gap-3 ${colors[color]}`}
    >
      <div className="p-3 rounded-2xl bg-surface shadow-sm text-text-main">{icon}</div>
      <div>
        <div className="text-xs font-black uppercase tracking-widest">{label}</div>
        <div className="text-[10px] font-bold opacity-60 mt-0.5">{count}</div>
      </div>
    </button>
  );
};

const HealthBar: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => {
  const colors: any = {
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</span>
        <span className="text-xs font-bold text-text-main">{value}%</span>
      </div>
      <div className="h-1.5 bg-border-subtle rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${colors[color]}`}
        />
      </div>
    </div>
  );
};

const InsightStat: React.FC<{ label: string, value: string | number, isLong?: boolean }> = ({ label, value, isLong }) => (
  <div className={isLong ? 'col-span-2' : ''}>
    <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{label}</div>
    <div className={`font-black text-white tracking-tight ${isLong ? 'text-sm' : 'text-xl'}`}>{value}</div>
  </div>
);

const SettingToggle: React.FC<{ label: string, enabled: boolean, onChange: (v: boolean) => void }> = ({ label, enabled, onChange }) => (
  <button 
    onClick={() => onChange(!enabled)}
    className="w-full flex items-center justify-between p-2 hover:bg-surface-hover rounded-xl transition-colors"
  >
    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{label}</span>
    <div className={`w-8 h-4 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-border-strong'}`}>
      <motion.div 
        animate={{ x: enabled ? 16 : 0 }}
        className="absolute left-0 top-0 w-4 h-4 rounded-full bg-white shadow-sm border border-border-subtle"
      />
    </div>
  </button>
);
