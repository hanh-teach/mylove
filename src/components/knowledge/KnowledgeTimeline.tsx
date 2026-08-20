import React from 'react';
import { Clock, Check, Sparkles, Plus, Edit2, Link, ExternalLink } from 'lucide-react';
import { ProjectActivity } from '../../modules/workspace/Project';

interface KnowledgeTimelineProps {
  activities?: ProjectActivity[];
  onNavigateToModule?: (module: string) => void;
}

export const KnowledgeTimeline: React.FC<KnowledgeTimelineProps> = ({ 
  activities = [], 
  onNavigateToModule 
}) => {
  const sortedActivities = React.useMemo(() => {
    if (!activities || activities.length === 0) return [];
    return [...activities].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8);
  }, [activities]);

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
          <Clock size={16} />
          Knowledge Timeline
        </h3>
        <button 
          onClick={() => onNavigateToModule?.('timeline')}
          className="text-[10px] font-black uppercase text-rose-600 hover:underline"
        >
          Xem tất cả
        </button>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs font-medium">
          Chưa có hoạt động nào được ghi nhận
        </div>
      ) : (
        <div className="relative space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {sortedActivities.map((activity) => {
            const actionType = activity.type || 'system';
            return (
              <div key={activity.id} className="relative pl-10 group">
                <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${getActionColor(actionType)}`}>
                  {getActionIcon(actionType)}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${getActionColor(actionType).replace('bg-', 'bg-opacity-10 text-').replace('text-', 'text-')}`}>
                      {actionType.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    {activity.metadata?.itemTitle || activity.description || 'Hoạt động dự án'}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const getActionIcon = (action: string) => {
  switch (action) {
    case 'add':
    case 'created': return <Plus size={12} />;
    case 'edit':
    case 'modified': return <Edit2 size={12} />;
    case 'ai':
    case 'ai_used': return <Sparkles size={12} />;
    case 'export': return <ExternalLink size={12} />;
    case 'referenced': return <Link size={12} />;
    default: return <Check size={12} />;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'add':
    case 'created': return 'bg-emerald-500 text-white';
    case 'edit':
    case 'modified': return 'bg-blue-500 text-white';
    case 'ai':
    case 'ai_used': return 'bg-rose-500 text-white';
    case 'export': return 'bg-purple-500 text-white';
    case 'referenced':
    case 'system': return 'bg-amber-500 text-white';
    default: return 'bg-slate-500 text-white';
  }
};

