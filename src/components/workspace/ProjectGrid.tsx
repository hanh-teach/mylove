import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, FolderPlus, Sparkles, FolderOpen, Trash2 } from 'lucide-react';
import { Project } from '../../modules/workspace/Project';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  onOpenProject?: (project: Project) => void;
  onOpenNewDialog?: () => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  onOpenProject,
  onOpenNewDialog,
}) => {
  const { filteredProjects, activeView, searchQuery, emptyTrash } = useProjectWorkspace();

  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white/60 backdrop-blur-xs rounded-[32px] border border-dashed border-slate-200 my-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-[32px] bg-rose-50 text-rose-500 flex items-center justify-center mb-8 shadow-inner"
        >
          <FolderOpen size={48} className="drop-shadow-sm" />
        </motion.div>
        
        <h3 className="font-extrabold text-xl text-slate-900 mb-3 tracking-tight">
          {searchQuery
            ? `Không tìm thấy kết quả nào`
            : activeView === 'favorites'
            ? 'Danh sách yêu thích trống'
            : activeView === 'archive'
            ? 'Lưu trữ trống'
            : activeView === 'trash'
            ? 'Thùng rác trống'
            : 'Sẵn sàng bắt đầu dự án mới?'}
        </h3>
        
        <p className="text-sm text-slate-500 max-w-sm mb-10 leading-relaxed font-medium">
          {searchQuery
            ? `Chúng tôi không tìm thấy dự án nào khớp với "${searchQuery}". Thử lại với từ khóa khác nhé.`
            : activeView === 'favorites'
            ? 'Đánh dấu ⭐ các dự án quan trọng để truy cập nhanh tại đây.'
            : 'Tạo dự án mới để bắt đầu thiệp chúc mừng, bài phát biểu, nhật ký hoặc thư tay của bạn.'}
        </p>

        {activeView === 'projects' && onOpenNewDialog && (
          <button
            onClick={onOpenNewDialog}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-xl shadow-rose-500/20 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            <span>Tạo dự án đầu tiên</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* If Trash View, show empty trash header action */}
      {activeView === 'trash' && (
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-amber-600 shrink-0" />
            <span>
              Các dự án trong Thùng rác có thể được khôi phục hoặc xóa vĩnh viễn.
            </span>
          </div>
          <button
            onClick={emptyTrash}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors shrink-0"
          >
            Dọn sạch thùng rác
          </button>
        </div>
      )}

      {/* Grid Layout: Desktop 3-4 cols, Tablet 2 cols, Mobile 1 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Quick New Project Card (only in active projects view) */}
        {activeView === 'projects' && !searchQuery && onOpenNewDialog && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            onClick={onOpenNewDialog}
            className="rounded-3xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50/80 p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px] transition-all group shadow-2xs"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-3 shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h4 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 mb-1">
              + Tạo Dự Án Mới
            </h4>
            <p className="text-[11px] text-slate-500 max-w-[180px]">
              Thiệp, Thư, Bài phát biểu, Nhật ký, Album...
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={onOpenProject}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
