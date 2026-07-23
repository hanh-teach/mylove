import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Star,
  Clock,
  FileText,
  Check,
  Edit2,
  Folder,
  Archive,
  RotateCcw,
  Trash2,
  Sparkles
} from 'lucide-react';
import { Project, PROJECT_TEMPLATES } from '../../modules/workspace/Project';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { ProjectMenu } from './ProjectMenu';

interface ProjectCardProps {
  project: Project;
  onOpen?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpen }) => {
  const { selectProject, toggleFavorite, renameProject } = useProjectWorkspace();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.title);

  const templateConfig = PROJECT_TEMPLATES[project.template] || PROJECT_TEMPLATES.card;

  const handleCardClick = () => {
    if (isEditingTitle) return;
    selectProject(project.id);
    if (onOpen) onOpen(project);
  };

  const handleSaveTitle = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempTitle.trim() && tempTitle !== project.title) {
      renameProject(project.id, tempTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.15 }}
      onClick={handleCardClick}
      className={`group relative rounded-3xl bg-white border border-slate-200/90 hover:border-rose-300 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col cursor-pointer ${
        project.status === 'trash' ? 'opacity-70 bg-slate-50' : ''
      }`}
    >
      {/* Header Banner / Thumbnail */}
      <div
        className="h-28 w-full relative overflow-hidden flex items-center justify-center"
        style={{
          background: project.thumbnail
            ? `url(${project.thumbnail}) center/cover no-repeat`
            : `linear-gradient(135deg, ${project.themeColor || '#e11d48'}22, ${project.themeColor || '#e11d48'}55)`,
        }}
      >
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

        {/* Template Badge & Icon */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md shadow-xs border border-white/40 text-[11px] font-bold text-slate-800">
          <span>{project.icon || templateConfig.icon}</span>
          <span>{templateConfig.labelVi || project.template}</span>
        </div>

        {/* Favorite & Menu Top Right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(project.id);
            }}
            className="p-1.5 rounded-xl bg-white/90 backdrop-blur-md hover:bg-white text-slate-400 hover:text-amber-500 transition-colors shadow-2xs"
            title={project.favorite ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            <Heart
              size={14}
              className={project.favorite ? 'text-rose-500 fill-rose-500' : ''}
            />
          </button>

          <ProjectMenu
            project={project}
            onOpen={() => onOpen && onOpen(project)}
            onStartRename={() => setIsEditingTitle(true)}
          />
        </div>

        {/* Version Badge */}
        <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-lg bg-slate-900/70 text-white backdrop-blur-md text-[10px] font-mono font-medium">
          v{project.version || '1.0'}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          {/* Title or Title Editor */}
          {isEditingTitle ? (
            <form
              onSubmit={handleSaveTitle}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 mb-1"
            >
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="w-full px-2 py-1 text-xs font-bold rounded-lg border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-emerald-500 text-white"
              >
                <Check size={12} />
              </button>
            </form>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 leading-snug">
                {project.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-opacity shrink-0"
                title="Đổi tên nhanh"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}

          {/* Description */}
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mt-1">
            {project.description || project.content?.message || 'Chưa có mô tả ngắn...'}
          </p>
        </div>

        {/* Meta details & Progress - Progressive Disclosure (Slide in from bottom on hover) */}
        <div className="relative h-4 mt-2 overflow-hidden">
          <motion.div 
            initial={false}
            animate={{ y: isEditingTitle ? 0 : 0 }} // Simplified for base state
            className="absolute inset-0 flex items-center justify-between text-[10px] text-slate-400 font-medium group-hover:translate-y-[-100%] transition-transform duration-300"
          >
            <div className="flex items-center gap-1">
              <Clock size={11} />
              <span>{project.lastEditedText || 'Sửa gần đây'}</span>
            </div>
            <div className="flex items-center gap-1.5">
               <FileText size={10} />
               <span>{project.content?.wordCount || 0} từ</span>
            </div>
          </motion.div>

          <motion.div 
            initial={false}
            className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-between"
          >
            <div className="w-full flex items-center gap-3">
              <div className="px-1.5 py-0.5 rounded bg-slate-900 text-[8px] font-black text-white uppercase tracking-wider shrink-0">
                {project.lifecyclePhase}
              </div>
              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${project.progress || 10}%`,
                    backgroundColor: project.themeColor || '#e11d48',
                  }}
                />
              </div>
              <span className="text-[9px] font-black text-slate-900">{project.progress || 0}%</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
