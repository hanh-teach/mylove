import React from 'react';
import { Clock, Info, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { IAgentActivity } from '../../modules/ai/AgentTypes';

interface AgentTimelineProps {
  activities: IAgentActivity[];
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ activities }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent Activity</h3>
      </div>

      <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
        {activities.map((activity) => (
          <div key={activity.id} className="relative pl-10 group">
            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-transform group-hover:scale-110 ${getLevelStyles(activity.level)}`}>
              {getLevelIcon(activity.level)}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  {new Date(activity.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight">{activity.action}</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                {activity.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'success': return <CheckCircle2 size={12} />;
    case 'warning': return <AlertCircle size={12} />;
    case 'error': return <AlertCircle size={12} />;
    default: return <Info size={12} />;
  }
};

const getLevelStyles = (level: string) => {
  switch (level) {
    case 'success': return 'bg-emerald-500 text-white';
    case 'warning': return 'bg-amber-500 text-white';
    case 'error': return 'bg-rose-500 text-white';
    default: return 'bg-slate-900 text-white';
  }
};
