import React from 'react';
import { Plus, Clock, FileText, ArrowRight } from 'lucide-react';
import { AppTabType } from '../../components/shell/ApplicationShell';
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
}) => {
  const { projects, selectProject } = useProjectWorkspace();

  // Filter out archived/trashed projects
  const activeProjects = projects.filter(
    (p) => p.status !== 'archived' && p.status !== 'trash'
  );

  // Sort by updatedAt descending
  const sortedProjects = [...activeProjects].sort((a, b) => b.updatedAt - a.updatedAt);

  // Vùng 2: Continue Working (most recently edited project)
  const continueProject = sortedProjects[0];

  // Vùng 4: Recent Projects (the rest of the active projects)
  const recentProjects = sortedProjects.slice(1);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Vừa xong';
    const d = new Date(timestamp);
    const hrs = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  };

  const handleOpenProject = (project: Project) => {
    selectProject(project.id);
    onNavigateTab('card');
  };

  const handleCreateNew = () => {
    window.dispatchEvent(new CustomEvent('trigger-new-project-dialog'));
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-slate-50 flex flex-col overflow-y-auto">
      <div className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        
        {/* VÙNG 2 — CONTINUE WORKING */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Tiếp tục công việc
          </h2>
          {continueProject ? (
            <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-4xl filter drop-shadow-sm select-none">
                    {continueProject.icon || '📁'}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight leading-tight">
                      {continueProject.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase tracking-wide">
                        Đang chỉnh sửa
                      </span>
                      <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                        <Clock size={12} />
                        Lần lưu cuối: {formatTime(continueProject.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {continueProject.content?.message && (
                <div className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl">
                  <p className="text-slate-500 font-medium text-xs line-clamp-2 leading-relaxed italic">
                    "{continueProject.content.message}"
                  </p>
                </div>
              )}

              <button
                onClick={() => handleOpenProject(continueProject)}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>TIẾP TỤC CHỈNH SỬA</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] p-8 border border-slate-200/80 border-dashed text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center">
                <FileText size={24} />
              </div>
              <p className="text-slate-400 font-semibold text-xs leading-relaxed">
                Bạn chưa có thiệp nào đang thực hiện. Hãy bắt đầu tạo ngay!
              </p>
            </div>
          )}
        </div>

        {/* VÙNG 3 — QUICK CREATE */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Tạo mới
          </h2>
          <button
            onClick={handleCreateNew}
            className="w-full py-5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/10 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2.5 border border-rose-500"
          >
            <Plus size={18} strokeWidth={3} />
            <span>TẠO PROJECT THIỆP</span>
          </button>
        </div>

        {/* VÙNG 4 — RECENT PROJECTS */}
        <div className="space-y-3">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Dự án gần đây
          </h2>
          {recentProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recentProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleOpenProject(project)}
                  className="bg-white border border-slate-200/85 rounded-xl p-4 hover:border-slate-300 hover:shadow-xs transition-all text-left flex items-start gap-3.5 active:scale-[0.98]"
                >
                  <span className="text-2xl filter drop-shadow-xs select-none">
                    {project.icon || '📁'}
                  </span>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                      {project.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Clock size={10} />
                      Cập nhật: {formatTime(project.updatedAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 text-center text-slate-400 text-xs font-semibold border border-slate-200/40">
              Không có dự án gần đây nào khác.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
