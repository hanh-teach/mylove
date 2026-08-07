import React from 'react';
import {
  Sparkles,
  Sun,
  Layers,
  Heart,
  CheckCircle,
  Eye
} from 'lucide-react';
import { AppTabType } from '../../components/shell/ApplicationShell';
import { ProjectToolbar } from '../../components/workspace/ProjectToolbar';
import { ProjectGrid } from '../../components/workspace/ProjectGrid';
import { SmartTemplateWizard } from '../../components/template/SmartTemplateWizard';
import { DraftRecoveryCard } from './DraftRecoveryCard';
import { QuickActions } from './QuickActions';
import { RecentProjects } from './RecentProjects';
import { useProjectWorkspace } from './WorkspaceContext';
import { useWorkspaceBusiness } from './hooks/useWorkspaceBusiness';

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
  const { activeProject, selectProject } = useProjectWorkspace();

  const {
    isNewDialogOpen,
    setIsNewDialogOpen,
    activeDraft,
    handleRestoreDraft,
    handleDismissDraft,
    greeting,
    handleOpenProject,
    handleMergeClick,
    duplicates,
    relationshipSuggestions,
    totalInsightsCount,
    dismissDuplicate,
    confirmRelationship,
    confirmAllRelationships,
    dismissRelationship,
  } = useWorkspaceBusiness(
    activeProject,
    selectProject,
    onNavigateTab,
    onContinueEditing
  );

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
                    className="ml-auto px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
                  >
                    Dashboard
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
                <p className="text-slate-500 font-medium text-sm">
                  {totalInsightsCount > 0
                    ? `AI đã phân tích và phát hiện ${totalInsightsCount} kết nối/gợi ý mới trong dữ liệu của bạn.`
                    : 'AI đã phân tích dữ liệu kỷ niệm. Không có gợi ý hoặc trùng lặp mới nào cần xử lý.'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => onNavigateTab('knowledge')}
                  className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all cursor-pointer"
                >
                  Knowledge Workspace
                </button>
                <button 
                  onClick={() => onNavigateTab('graph')}
                  className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all cursor-pointer"
                >
                  Mở Content Graph
                </button>
                {relationshipSuggestions.length > 0 && (
                  <button 
                    onClick={confirmAllRelationships}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg cursor-pointer"
                  >
                    Xác nhận {relationshipSuggestions.length} liên kết
                  </button>
                )}
              </div>
            </div>

            {totalInsightsCount === 0 ? (
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-center text-slate-500 font-medium text-xs mt-6 flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                <span>Không có trùng lặp hoặc gợi ý liên kết nhân vật chưa xác nhận. Dữ liệu kỷ niệm của bạn hoàn toàn tối ưu!</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                {/* Duplicate Detection Alerts */}
                {duplicates.map(candidate => (
                  <div key={candidate.pairId} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <Layers size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 mb-1">Phát hiện trùng lặp Kỷ niệm</h4>
                      <p className="text-[10px] text-slate-500 font-bold mb-3 line-clamp-2">
                        AI phát hiện "{candidate.memoryA.title}" và "{candidate.memoryB.title}" có thể là một ({candidate.reason}).
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleMergeClick(candidate.pairId)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Hợp nhất
                        </button>
                        <button 
                          onClick={() => dismissDuplicate(candidate.pairId)}
                          className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Bỏ qua
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Relationship Suggestions */}
                {relationshipSuggestions.map(sug => (
                  <div key={sug.id} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Heart size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-slate-900 mb-1">Gợi ý liên kết nhân vật</h4>
                      <p className="text-[10px] text-slate-500 font-bold mb-3 line-clamp-2">
                        Kỷ niệm "{sug.memoryTitle}" có nhắc đến nhân vật "{sug.personName}".
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => confirmRelationship(sug)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Xác nhận
                        </button>
                        <button 
                          onClick={() => onNavigateTab('memory')}
                          className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Eye size={10} /> Chi tiết
                        </button>
                        <button 
                          onClick={() => dismissRelationship(sug.id)}
                          className="px-2 py-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                        >
                          Bỏ qua
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Projects */}
          <RecentProjects
            onContinueEditing={onContinueEditing}
            onNavigateTab={onNavigateTab}
          />

          {/* Draft Recovery Alert if available */}
          {activeDraft && (
            <DraftRecoveryCard
              timestamp={activeDraft.timestamp}
              title={activeDraft.document?.title}
              onRestore={handleRestoreDraft}
              onDismiss={handleDismissDraft}
            />
          )}

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
