import React from 'react';
import { Heart, BookOpen, Clock, PenTool, Wand2, Sparkles, FolderPlus } from 'lucide-react';
import { AppTabType } from '../../components/shell/ApplicationShell';

interface QuickActionsProps {
  onNavigateTab: (tab: AppTabType) => void;
  onOpenNewMemory: () => void;
  onOpenNewTimeline: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigateTab,
  onOpenNewMemory,
  onOpenNewTimeline,
}) => {
  const actions = [
    {
      title: 'Create Content (AI Writer)',
      description: 'Craft cards, letters, speeches & posts with AI',
      icon: <Sparkles size={20} className="text-slate-600" />,
      bg: 'bg-white hover:bg-slate-50 border-slate-200',
      onClick: () => onNavigateTab('editor'),
    },
    {
      title: 'Memory Collection',
      description: 'Archive photos, audio, documents & notes',
      icon: <BookOpen size={20} className="text-slate-600" />,
      bg: 'bg-white hover:bg-slate-50 border-slate-200',
      onClick: () => onNavigateTab('memory'),
    },
    {
      title: 'Life Timeline',
      description: 'Track milestones, events & travel history',
      icon: <Clock size={20} className="text-slate-600" />,
      bg: 'bg-white hover:bg-slate-50 border-slate-200',
      onClick: () => onNavigateTab('timeline'),
    },
    {
      title: 'Studio Canvas',
      description: 'Design visual cards & story graphics',
      icon: <PenTool size={20} className="text-slate-600" />,
      bg: 'bg-white hover:bg-slate-50 border-slate-200',
      onClick: () => onNavigateTab('editor'),
    },
    {
      title: 'AI Workflows',
      description: 'Automated multi-step creation pipelines',
      icon: <Wand2 size={20} className="text-slate-600" />,
      bg: 'bg-white hover:bg-slate-50 border-slate-200',
      onClick: () => onNavigateTab('aistudio'),
    },
    {
      title: 'Workspace Home',
      description: 'Dashboard & project overview',
      icon: <Heart size={20} className="text-slate-600" />,
      bg: 'bg-white hover:bg-slate-50 border-slate-200',
      onClick: () => onNavigateTab('home'),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-bold text-slate-900 text-base">Quick Actions</h3>
        <span className="text-xs text-slate-500">Instant Access</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`p-4 rounded-2xl border text-left transition-all hover:shadow-md flex items-start gap-3.5 ${action.bg}`}
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0">
              {action.icon}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{action.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
