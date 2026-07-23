import React, { useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Sun,
  Plus,
  FolderPlus,
  Layers,
  LayoutGrid,
  Heart
} from 'lucide-react';
import { AppTabType } from '../../components/shell/ApplicationShell';
import { WorkspaceSidebar } from '../../components/workspace/WorkspaceSidebar';
import { ProjectToolbar } from '../../components/workspace/ProjectToolbar';
import { ProjectGrid } from '../../components/workspace/ProjectGrid';
import { SmartTemplateWizard } from '../../components/template/SmartTemplateWizard';
import { DraftRecoveryCard } from './DraftRecoveryCard';
import { QuickActions } from './QuickActions';
import { RecentProjects } from './RecentProjects';
import { useProjectWorkspace } from './WorkspaceContext';
import { Project } from './Project';

interface WorkspaceDashboardProps {
  onNavigateTab: (tab: AppTabType) => void;
  onOpenNewMemory: () => void;
  onOpenNewTimeline: () => void;
  onContinueEditing: () => void;
}

export const WorkspaceDashboard: React.FC<WorkspaceDashboardProps> = ({
  onNavigateTab,
  onOpenNewMemory,
  onOpenNewTimeline,
  onContinueEditing,
}) => {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { activeProject, selectProject } = useProjectWorkspace();

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Chào buổi sáng' : currentHour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const handleOpenProject = (project: Project) => {
    selectProject(project.id);
    onNavigateTab('project-dashboard');
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Main Workspace Workspace Content */}
      <div className="flex-1 flex flex-col min-w-0 h-[calc(100vh-3.5rem)] overflow-y-auto">
        {/* Dashboard Area */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col gap-10 bg-white rounded-[40px] p-8 sm:p-10 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 text-rose-600 font-bold text-sm uppercase tracking-widest mb-4">
                <Sun size={18} className="text-amber-500" />
                <span>{greeting}, Creator</span>
              </div>
              
              <h1 className="font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tighter leading-tight max-w-2xl mb-6">
                {activeProject ? activeProject.title : "Không gian quản lý dự án & sáng tạo đa tài liệu ✨"}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl leading-relaxed mb-8">
                Tất cả thiệp chúc, bài phát biểu, thư tay và nhật ký của bạn được tổ chức tập trung tại một không gian cao cấp.
              </p>

              {activeProject && (
                <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/80 p-4 rounded-[24px] inline-flex shadow-inner">
                  <div className="text-2xl">{activeProject.icon}</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Dự án đang mở
                    </p>
                    <p className="font-bold text-sm text-slate-900">
                      {activeProject.title}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('project-dashboard')}
                    className="ml-4 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Mở Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Relationship Engine & Intelligence Widget */}
          <section className="bg-white rounded-[32px] p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Layers size={80} className="text-rose-500" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white">
                    <Sparkles size={16} />
                  </div>
                  <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Intelligence Engine</h3>
                </div>
                <p className="text-slate-500 font-medium text-sm">AI đã phân tích và tìm thấy các kết nối mới trong dữ liệu của bạn.</p>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => onNavigateTab('knowledge')}
                  className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all"
                >
                  Knowledge Workspace
                </button>
                <button 
                  onClick={() => onNavigateTab('graph')}
                  className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all"
                >
                  Mở Content Graph
                </button>
                <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">
                  Xác nhận 12 liên kết
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {/* Duplicate Detection Alert */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Layers size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">Phát hiện trùng lặp Kỷ niệm</h4>
                  <p className="text-[10px] text-slate-500 font-bold mb-3">AI phát hiện "Sinh nhật 2022" và "Sinh nhật năm 2022" có thể là một.</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Hợp nhất</button>
                    <button className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Bỏ qua</button>
                  </div>
                </div>
              </div>

              {/* Relationship Suggestion */}
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Heart size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 mb-1">Gợi ý liên kết nhân vật</h4>
                  <p className="text-[10px] text-slate-500 font-bold mb-3">Kỷ niệm "Chuyến đi Đà Lạt" có nhắc đến "Nguyễn Văn A".</p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">Xác nhận</button>
                    <button className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Chi tiết</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Projects */}
          <RecentProjects
            onContinueEditing={onContinueEditing}
            onNavigateTab={onNavigateTab}
          />

          {/* Draft Recovery Alert if available */}
          <DraftRecoveryCard onRestore={onContinueEditing} />

          {/* Quick Actions Grid */}
          <QuickActions
            onNavigateTab={onNavigateTab}
            onOpenNewMemory={onOpenNewMemory}
            onOpenNewTimeline={onOpenNewTimeline}
          />

          {/* Project Toolbar */}
          <ProjectToolbar onOpenNewDialog={() => setIsNewDialogOpen(true)} />

          {/* Project Grid */}
          <ProjectGrid
            onOpenProject={handleOpenProject}
            onOpenNewDialog={() => setIsNewDialogOpen(true)}
          />
        </div>
      </div>

      {/* Smart Template Wizard */}
      <SmartTemplateWizard
        isOpen={isNewDialogOpen}
        onClose={() => setIsNewDialogOpen(false)}
        onCreated={(projectId) => {
          selectProject(projectId);
          onNavigateTab('project-dashboard');
        }}
      />
    </div>
  );
};
