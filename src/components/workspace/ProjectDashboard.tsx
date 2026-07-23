import React, { useState } from 'react';
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
import { templateService, ISmartTemplate } from '../../modules/templates/TemplateService';

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
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const toggleChecklist = (id: string) => {
    const newChecklist = project.checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdateProject({ checklist: newChecklist });
  };

  const togglePriority = (id: string) => {
    const newTasks = project.priorityTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    onUpdateProject({ priorityTasks: newTasks });
  };

  const handleSaveAsTemplate = () => {
    const customTemplate: ISmartTemplate = {
      id: `custom-tpl-${Date.now()}`,
      title: `${project.title} (Bản Mẫu)`,
      description: project.description || 'Mẫu được lưu từ dự án của bạn',
      category: project.metadata?.smartTemplate?.category || 'personal',
      tags: project.tags || [],
      icon: 'Star',
      theme: project.themeColor,
      aiPromptConfig: project.metadata?.smartTemplate?.aiPromptConfig || {
        systemPrompt: 'Hỗ trợ viết theo phong cách cá nhân',
        tone: 'creative',
        suggestedTopics: []
      },
      structure: {
        hasTimeline: true,
        hasGallery: true,
        hasChecklist: project.checklist.length > 0,
        hasDraftWriter: true,
        hasExportPreset: true
      },
      placeholders: [],
      workflowSteps: [],
      exportPreset: {
        format: 'pdf',
        aspectRatio: 'A4'
      },
      isUserCreated: true
    };
    
    templateService.saveCustomTemplate(customTemplate);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };


  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'good': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'critical': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-emerald-500 bg-emerald-50';
      case 'medium': return 'text-blue-500 bg-blue-50';
      case 'low': return 'text-slate-400 bg-slate-50';
      default: return 'text-slate-400 bg-slate-50';
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
      <div className="relative overflow-hidden bg-white rounded-[40px] p-8 sm:p-10 border border-slate-200/80 shadow-xs">
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
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-slate-500 text-xs font-medium">Cập nhật {project.lastEditedText}</span>
                </div>
              </div>
            </div>
            <Typography variant="body" className="text-slate-500 max-w-xl">
              {project.description}
            </Typography>
          </div>

          <div className="flex flex-col items-end gap-3">
            {project.lastState?.tab && project.lastState.tab !== 'project-dashboard' && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onNavigateToModule(project.lastState!.tab as any)}
                className="bg-white/80 hover:bg-white text-slate-900 border-slate-200 shadow-sm mb-2"
              >
                <RotateCcw size={14} className="mr-2" />
                Tiếp tục: {project.lastState.tab}
              </Button>
            )}
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveAsTemplate}
                className="bg-white/50 text-slate-700 hover:bg-slate-50 border-slate-200 mb-2"
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
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                {project.lifecyclePhase === 'idea' ? 'Giai đoạn ý tưởng' : 
                 project.lifecyclePhase === 'planning' ? 'Đang lập kế hoạch' :
                 project.lifecyclePhase === 'collecting' ? 'Đang thu thập tư liệu' :
                 project.lifecyclePhase === 'writing' ? 'Đang soạn thảo nội dung' :
                 project.lifecyclePhase === 'designing' ? 'Đang hoàn thiện thiết kế' :
                 project.lifecyclePhase === 'reviewing' ? 'Đang kiểm duyệt' :
                 'Sẵn sàng xuất bản'}
              </div>
              <div className="text-4xl font-black text-slate-900 tracking-tighter">{project.progress}%</div>
            </div>
            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
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
            <div className="flex items-center gap-2 mb-6">
              <Zap size={20} className="text-rose-200" />
              <h3 className="font-black text-lg">Daily Focus</h3>
            </div>
            <div className="space-y-4">
              {project.dailyFocus.map((focus, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-black">0{i+1}</div>
                  <span className="font-bold text-sm">{focus}</span>
                  <ChevronRight size={14} className="ml-auto opacity-40" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Priority Center */}
        <section className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-slate-200/80 shadow-xs relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <Star size={20} className="text-amber-500 fill-amber-500" />
              Priority Center
            </h3>
            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-900">
              <Settings2 size={12} /> Cấu hình AI
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.priorityTasks.map((task) => (
              <button 
                key={task.id}
                onClick={() => togglePriority(task.id)}
                className={`flex items-start gap-4 p-4 rounded-[24px] border transition-all text-left group ${
                  task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className={`mt-1 shrink-0 ${task.completed ? 'text-emerald-500' : 'text-slate-300 group-hover:text-slate-400'}`}>
                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      task.priority >= 4 ? 'text-rose-500' : 'text-blue-500'
                    }`}>
                      {'★'.repeat(task.priority)}{'☆'.repeat(5-task.priority)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">• {task.impact}</span>
                  </div>
                  <p className={`font-bold text-slate-900 ${task.completed ? 'line-through' : ''}`}>{task.label}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Workspace Insights Engine */}
      {project.intelligenceSettings.showInsights && (
        <section className="bg-slate-50/50 rounded-[40px] p-8 border border-slate-200/60">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-xl text-slate-900 flex items-center gap-3">
                <Wand2 size={24} className="text-purple-500" />
                Workspace Insights
              </h3>
              <p className="text-sm text-slate-500 mt-1">Gợi ý chủ động từ AI dựa trên tình trạng dự án</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.workspaceInsights.map((insight) => (
              <div key={insight.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
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
                <p className="font-bold text-slate-900 mb-6 flex-1 leading-relaxed">{insight.message}</p>
                {insight.actionLabel && (
                  <Button variant="secondary" size="sm" className="w-full bg-slate-50 hover:bg-slate-100 border-none font-black text-[10px] uppercase tracking-widest py-3">
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
          <section className="bg-white rounded-[32px] p-8 border border-slate-200/80 shadow-xs">
            <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 mb-6">
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
              count="12 mốc"
              color="purple"
              onClick={() => onNavigateToModule('timeline')}
            />
            <QuickModuleCard 
              icon={<Sparkles size={20} />} 
              label="AI Assist" 
              count="5 gợi ý"
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
          <section className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-xs">
            <h3 className="font-black text-xs text-slate-900 flex items-center gap-2 mb-4">
              <Settings2 size={16} className="text-slate-400" />
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
            <section className="bg-white rounded-[32px] p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  Productivity
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tuần này</span>
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
          <section className="bg-rose-50 rounded-[32px] p-8 border border-rose-100 shadow-sm">
            <h3 className="font-black text-lg text-rose-900 flex items-center gap-2 mb-4">
              <Wand2 size={20} className="text-rose-500" />
              AI Project Coach
            </h3>
            <div className="space-y-4">
              {project.coachSuggestions.map((suggestion, i) => (
                <div key={i} className="flex gap-3 bg-white p-4 rounded-2xl border border-rose-200/50 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <Typography variant="body-sm" className="font-black text-rose-500 text-[10px]">{i + 1}</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-rose-900 font-medium leading-relaxed">
                    {suggestion}
                  </Typography>
                </div>
              ))}
              <Button variant="primary" className="w-full bg-rose-600 hover:bg-rose-700 mt-2">
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
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-xl font-black text-slate-900 tracking-tight">{value}</div>
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
    rose: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100',
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-[32px] border transition-all hover:shadow-md active:scale-95 text-center gap-3 ${colors[color]}`}
    >
      <div className="p-3 rounded-2xl bg-white shadow-sm">{icon}</div>
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
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-xs font-bold text-slate-900">{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</div>
    <div className={`font-black text-white tracking-tight ${isLong ? 'text-sm' : 'text-xl'}`}>{value}</div>
  </div>
);

const SettingToggle: React.FC<{ label: string, enabled: boolean, onChange: (v: boolean) => void }> = ({ label, enabled, onChange }) => (
  <button 
    onClick={() => onChange(!enabled)}
    className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors"
  >
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    <div className={`w-8 h-4 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}>
      <motion.div 
        animate={{ x: enabled ? 16 : 0 }}
        className="absolute left-0 top-0 w-4 h-4 rounded-full bg-white shadow-sm border border-slate-100"
      />
    </div>
  </button>
);
